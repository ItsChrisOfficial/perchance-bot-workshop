/**
 * Snippet: ai-response-stream-monitor
 *
 * Purpose:
 *   Monitors and reacts to streaming AI messages in real-time using the
 *   documented StreamingMessage event. Collects streamed chunks, provides
 *   a live word count, and optionally triggers callbacks when patterns
 *   are detected mid-stream.
 *
 * Why realistic:
 *   Uses oc.thread.on("StreamingMessage") (documented) which provides
 *   data.chunks as an async iterable. Pure offline monitoring logic.
 *   No frameworks.
 *
 * Immediate behavior when pasted:
 *   - Monitors streaming AI messages in real-time.
 *   - Shows live word count in the iframe.
 *   - Logs stream statistics after completion.
 *   - Exposes window.__pcbw_streamMonitor API for custom pattern watchers.
 *
 * Customization points:
 *   - PATTERN_WATCHERS: array of { pattern, callback } for mid-stream detection.
 *   - SHOW_WORD_COUNT: toggle live word count display.
 *
 * Caveats:
 *   - StreamingMessage fires during AI generation; processing must be lightweight.
 *   - Heavy processing in the stream loop may degrade performance.
 *   - Stream chunks are text fragments, not complete messages.
 */
(async () => {
  if (window.__pcbw_streamMon_init) return;
  window.__pcbw_streamMon_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const SHOW_WORD_COUNT = true;

  // Watchers: { pattern: RegExp or string, callback: fn(match, fullText) }
  const PATTERN_WATCHERS = [
    // Example: detect when the AI mentions a specific word mid-stream
    // { pattern: /\b(combat|fight|battle)\b/i, callback: (match, text) => console.log("Combat detected mid-stream!") }
  ];
  // ─────────────────────────────────────────────────────────────────────

  // ─── Word Count Display ──────────────────────────────────────────────
  const wordCountEl = document.createElement("div");
  wordCountEl.id = "pcbw-stream-wordcount";
  wordCountEl.style.cssText = [
    "position:fixed; top:8px; right:8px; z-index:9999;",
    "padding:3px 8px; border-radius:8px; font-size:11px;",
    "font-family:sans-serif; opacity:0; transition:opacity .3s;",
    "background:light-dark(#E8EAF6,#1A237E); color:light-dark(#283593,#9FA8DA);"
  ].join("");
  document.body.appendChild(wordCountEl);

  function showWordCount(count) {
    if (!SHOW_WORD_COUNT) return;
    wordCountEl.textContent = `✍️ ${count} words`;
    wordCountEl.style.opacity = "1";
  }
  function hideWordCount() {
    wordCountEl.style.opacity = "0";
  }

  // Track watchers that have already fired per stream
  const firedWatchers = new Set();

  oc.thread.on("StreamingMessage", async function (data) {
    try {
      let fullText = "";
      let wordCount = 0;
      let chunkCount = 0;
      const startTime = Date.now();

      firedWatchers.clear();

      for await (const chunk of data.chunks) {
        fullText += chunk;
        chunkCount++;
        wordCount = fullText.split(/\s+/).filter(Boolean).length;

        showWordCount(wordCount);

        // Check pattern watchers
        for (let i = 0; i < PATTERN_WATCHERS.length; i++) {
          if (firedWatchers.has(i)) continue;
          const watcher = PATTERN_WATCHERS[i];
          const pattern = typeof watcher.pattern === "string"
            ? new RegExp(watcher.pattern, "i")
            : watcher.pattern;

          const match = fullText.match(pattern);
          if (match) {
            firedWatchers.add(i);
            try {
              watcher.callback(match, fullText);
            } catch (e) {
              console.error("[pcbw-streamMon] Watcher error:", e);
            }
          }
        }
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `[pcbw-streamMon] Stream complete: ${wordCount} words, ` +
        `${chunkCount} chunks, ${elapsed}s`
      );

      setTimeout(hideWordCount, 1500);
    } catch (err) {
      console.error("[pcbw-streamMon] Error:", err);
      hideWordCount();
    }
  });

  const api = {
    addWatcher(pattern, callback) {
      PATTERN_WATCHERS.push({ pattern, callback });
      return PATTERN_WATCHERS.length - 1; // Return index for removal
    },
    removeWatcher(index) {
      if (index >= 0 && index < PATTERN_WATCHERS.length) {
        PATTERN_WATCHERS.splice(index, 1);
      }
    },
    getWatchers() {
      return PATTERN_WATCHERS.map((w, i) => ({
        index: i,
        pattern: String(w.pattern)
      }));
    }
  };

  window.__pcbw_streamMonitor = api;
  console.log("[pcbw-streamMon] Stream monitor loaded.");
})();

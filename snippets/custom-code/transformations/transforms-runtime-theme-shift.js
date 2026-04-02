/**
 * Snippet: transforms-runtime-theme-shift
 *
 * Purpose:
 *   Monitors conversation mood over a rolling window of recent AI messages.
 *   Computes a dominant mood and applies a corresponding visual theme to
 *   oc.thread.messageWrapperStyle. Tracks mood history in customData.
 *
 * Why realistic:
 *   Uses oc.getInstructCompletion() (documented) for mood classification,
 *   oc.thread.messageWrapperStyle (documented) for global styling,
 *   oc.thread.customData (documented) for persistence. Offline-safe
 *   classification fallback.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, classifies mood, adds to rolling window.
 *   - Computes dominant mood from recent history.
 *   - Applies a theme (CSS) to oc.thread.messageWrapperStyle.
 *   - Shows current theme label in iframe.
 *
 * Customization points:
 *   - THEMES: mood-keyed objects with label and CSS string.
 *   - WINDOW_SIZE: how many recent moods to consider.
 *   - MOOD_LABELS: vocabulary for mood classification.
 *
 * Caveats:
 *   - Overwrites oc.thread.messageWrapperStyle — coordinate with other snippets.
 *   - LLM call per AI message; errors leave theme unchanged.
 */
(async () => {
  if (window.__pcbw_themeShift_init) return;
  window.__pcbw_themeShift_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_theme";
  const WINDOW_SIZE = 6;

  const MOOD_LABELS = ["cheerful", "melancholy", "tense", "romantic", "mysterious", "neutral"];

  const THEMES = {
    cheerful: {
      label: "☀️ Cheerful",
      css: "color: light-dark(#2E7D32, #A5D6A7); border-left: 3px solid light-dark(#66BB6A, #388E3C);"
    },
    melancholy: {
      label: "🌧️ Melancholy",
      css: "color: light-dark(#37474F, #90A4AE); border-left: 3px solid light-dark(#78909C, #455A64);"
    },
    tense: {
      label: "⚡ Tense",
      css: "color: light-dark(#B71C1C, #EF9A9A); border-left: 3px solid light-dark(#E53935, #C62828);"
    },
    romantic: {
      label: "💕 Romantic",
      css: "color: light-dark(#880E4F, #F48FB1); border-left: 3px solid light-dark(#EC407A, #AD1457);"
    },
    mysterious: {
      label: "🔮 Mysterious",
      css: "color: light-dark(#4A148C, #CE93D8); border-left: 3px solid light-dark(#AB47BC, #6A1B9A);"
    },
    neutral: {
      label: "⚖️ Neutral",
      css: ""
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  // Initialize state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = {
      moodWindow: [],
      currentTheme: "neutral"
    };
  }
  const ts = oc.thread.customData[NAMESPACE];

  // ─── Theme Label in Iframe ───────────────────────────────────────────
  const themeBadge = document.createElement("div");
  themeBadge.id = "pcbw-theme-badge";
  themeBadge.style.cssText = [
    "position:fixed; top:8px; left:8px; z-index:9999;",
    "padding:3px 8px; border-radius:10px; font-size:12px;",
    "font-family:sans-serif; pointer-events:none;",
    "background:light-dark(#fafafa,#2a2a2a); color:light-dark(#333,#ddd);",
    "box-shadow:0 1px 3px rgba(0,0,0,.15); transition:all .3s;"
  ].join("");
  document.body.appendChild(themeBadge);

  function applyTheme(themeKey) {
    const theme = THEMES[themeKey] || THEMES.neutral;
    ts.currentTheme = themeKey;
    oc.thread.messageWrapperStyle = theme.css;
    themeBadge.textContent = theme.label;
  }

  function computeDominant(window_) {
    const freq = {};
    for (const m of window_) {
      freq[m] = (freq[m] || 0) + 1;
    }
    let best = "neutral";
    let bestCount = 0;
    for (const [mood, count] of Object.entries(freq)) {
      if (count > bestCount) {
        best = mood;
        bestCount = count;
      }
    }
    return best;
  }

  async function classifyMood(text) {
    const instruction =
      `Classify the overall mood of this text into exactly one of: ${MOOD_LABELS.join(", ")}. ` +
      `Respond with ONLY the label.\n\nText:\n${text.slice(0, 600)}`;
    const result = await oc.getInstructCompletion({ instruction });
    const cleaned = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    return MOOD_LABELS.includes(cleaned) ? cleaned : "neutral";
  }

  // Apply current theme on load
  applyTheme(ts.currentTheme);

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      const mood = await classifyMood(lastMsg.content);

      // Add to rolling window
      ts.moodWindow.push(mood);
      if (ts.moodWindow.length > WINDOW_SIZE) {
        ts.moodWindow.shift();
      }

      const dominant = computeDominant(ts.moodWindow);
      if (dominant !== ts.currentTheme) {
        applyTheme(dominant);
        console.log(`[pcbw-theme] Theme shifted to: ${dominant}`);
      }
    } catch (err) {
      console.error("[pcbw-theme] Error:", err);
    }
  });

  console.log("[pcbw-theme] Runtime theme shift loaded. Theme:", ts.currentTheme);
})();

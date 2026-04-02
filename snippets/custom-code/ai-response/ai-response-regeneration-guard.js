/**
 * Snippet: ai-response-regeneration-guard
 *
 * Purpose:
 *   Prevents duplicate AI responses and guards against accidental regeneration.
 *   Tracks recent AI message hashes to detect duplicates. If a duplicate is
 *   detected, removes it and optionally prompts the AI for a different response.
 *
 * Why realistic:
 *   Uses MessageAdded event (documented), oc.thread.messages array manipulation
 *   (documented: splice), oc.thread.customData (documented), and optional
 *   oc.getInstructCompletion() for re-generation. Offline hash comparison;
 *   re-generation is network-dependent.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, computes a content hash and checks for duplicates.
 *   - If duplicate detected, removes it and logs a warning.
 *   - Tracks last N content hashes in customData.
 *
 * Customization points:
 *   - HASH_WINDOW: how many recent hashes to keep.
 *   - SIMILARITY_THRESHOLD: character-overlap ratio (0-1) for fuzzy matching.
 *   - AUTO_REGENERATE: whether to request a new response on duplicate.
 *
 * Caveats:
 *   - Simple hash comparison; very similar (not identical) messages may pass.
 *   - Auto-regeneration adds an LLM call.
 */
(async () => {
  if (window.__pcbw_regenGuard_init) return;
  window.__pcbw_regenGuard_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_regenGuard";
  const HASH_WINDOW = 10;
  const SIMILARITY_THRESHOLD = 0.85; // 0-1; 1 = exact match only
  const AUTO_REGENERATE = false;
  // ─────────────────────────────────────────────────────────────────────

  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { recentHashes: [] };
  }
  const state = oc.thread.customData[NAMESPACE];

  // Simple string hash for fast comparison
  function simpleHash(str) {
    let hash = 0;
    const s = str.slice(0, 500); // Only hash first 500 chars for performance
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash;
  }

  // Compute similarity ratio between two strings
  function similarity(a, b) {
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length > b.length ? a : b;
    if (longer.length === 0) return 1.0;

    // Simple character overlap ratio
    const shorterNorm = shorter.slice(0, 200).toLowerCase();
    const longerNorm = longer.slice(0, 200).toLowerCase();

    let matches = 0;
    for (let i = 0; i < shorterNorm.length; i++) {
      if (longerNorm.includes(shorterNorm[i])) matches++;
    }
    return matches / longerNorm.length;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      const content = (lastMsg.content || "").trim();
      if (content.length < 20) return; // Skip very short messages

      const hash = simpleHash(content);

      // Check for exact hash match
      let isDuplicate = state.recentHashes.includes(hash);

      // If not exact, check similarity against recent messages
      if (!isDuplicate && SIMILARITY_THRESHOLD < 1) {
        const recentAiMsgs = oc.thread.messages
          .filter(m => m.author === "ai" && m !== lastMsg)
          .slice(-HASH_WINDOW);

        for (const prev of recentAiMsgs) {
          const sim = similarity(content, prev.content || "");
          if (sim >= SIMILARITY_THRESHOLD) {
            isDuplicate = true;
            break;
          }
        }
      }

      if (isDuplicate) {
        console.warn("[pcbw-regenGuard] Duplicate AI message detected. Removing.");

        // Remove the duplicate
        const idx = oc.thread.messages.indexOf(lastMsg);
        if (idx >= 0) {
          oc.thread.messages.splice(idx, 1);
        }

        if (AUTO_REGENERATE) {
          try {
            const instruction =
              "The previous response was a duplicate. Generate a fresh, different response " +
              "that continues the conversation naturally. Do not repeat the previous message.";
            const newContent = await oc.getInstructCompletion({ instruction });
            if (newContent && newContent.trim().length > 10) {
              oc.thread.messages.push({
                content: newContent.trim(),
                author: "ai"
              });
            }
          } catch (regenErr) {
            console.error("[pcbw-regenGuard] Re-generation failed:", regenErr);
          }
        }

        return;
      }

      // Store hash
      state.recentHashes.push(hash);
      if (state.recentHashes.length > HASH_WINDOW) {
        state.recentHashes.shift();
      }
    } catch (err) {
      console.error("[pcbw-regenGuard] Error:", err);
    }
  });

  console.log("[pcbw-regenGuard] Regeneration guard loaded.");
})();

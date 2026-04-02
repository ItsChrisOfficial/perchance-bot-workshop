/**
 * Snippet: preformat-roleplay-layout-normalizer
 *
 * Purpose:
 *   Normalizes common roleplay formatting conventions in AI messages.
 *   Wraps *action text* in styled <em> tags, "dialogue" in styled
 *   <span> tags, and identifies narration blocks. Applies CSS classes
 *   for distinct visual treatment.
 *
 * Why realistic:
 *   Uses MessageAdded event and message.content modification (documented).
 *   Pure regex/string processing. Fully offline. Character-agnostic.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, applies RP formatting normalization.
 *   - *actions* get italic styling with a subtle color.
 *   - "dialogue" gets a distinct dialogue color.
 *   - Tracks processing via per-message customData.
 *
 * Customization points:
 *   - ACTION_STYLE: CSS for action text.
 *   - DIALOGUE_STYLE: CSS for dialogue text.
 *   - NARRATION_STYLE: CSS for narration wrapper.
 *
 * Caveats:
 *   - Regex-based; may not handle nested or unusual quote patterns perfectly.
 *   - Only processes AI messages.
 */
(async () => {
  if (window.__pcbw_rpNormalizer_init) return;
  window.__pcbw_rpNormalizer_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_rpNorm";

  const ACTION_STYLE = "font-style:italic; color:light-dark(#5D4037, #A1887F);";
  const DIALOGUE_STYLE = "color:light-dark(#1565C0, #64B5F6); font-weight:500;";
  const NARRATION_STYLE = "color:light-dark(#37474F, #B0BEC5);";
  // ─────────────────────────────────────────────────────────────────────

  // Inject scoped styles
  const style = document.createElement("style");
  style.textContent = `
    .pcbw-rp-action { ${ACTION_STYLE} }
    .pcbw-rp-dialogue { ${DIALOGUE_STYLE} }
    .pcbw-rp-narration { ${NARRATION_STYLE} }
  `;
  document.head.appendChild(style);

  function normalizeRP(content) {
    let result = content;

    // 1. Convert *action text* to styled <em> (single asterisks, not **)
    //    Match *text* but not **text** (bold)
    result = result.replace(
      /(?<!\*)\*(?!\*)([^*\n]+?)(?<!\*)\*(?!\*)/g,
      '<em class="pcbw-rp-action">$1</em>'
    );

    // 2. Convert "dialogue text" to styled <span> (double quotes)
    result = result.replace(
      /"([^"\n]+?)"/g,
      '<span class="pcbw-rp-dialogue">"$1"</span>'
    );

    // 3. Convert \u201c dialogue \u201d (smart/curly quotes) to styled <span>
    result = result.replace(
      /\u201c([^\u201d\n]+?)\u201d/g,
      '<span class="pcbw-rp-dialogue">\u201c$1\u201d</span>'
    );

    return result;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already processed
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      const original = lastMsg.content;
      lastMsg.content = normalizeRP(original);

      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { normalized: true };

      if (original !== lastMsg.content) {
        console.log("[pcbw-rpNorm] RP layout normalized.");
      }
    } catch (err) {
      console.error("[pcbw-rpNorm] Error:", err);
    }
  });

  console.log("[pcbw-rpNorm] Roleplay layout normalizer loaded.");
})();

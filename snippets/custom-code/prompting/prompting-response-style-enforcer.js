/**
 * Snippet: prompting-response-style-enforcer
 *
 * Purpose:
 *   After each AI message, runs a configurable instruct-completion step to
 *   enforce style rules (length, tense, tone, etc.). Combines all rules
 *   into a single rewrite instruction. Tracks processing via per-message
 *   customData to avoid double-processing.
 *
 * Why realistic:
 *   Uses oc.getInstructCompletion() (documented LLM helper) for rewriting,
 *   per-message customData (documented) for dedup, and standard MessageAdded
 *   event (documented). Network-dependent but gracefully falls back.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, rewrites content to match configured style rules.
 *   - Shows a brief "refining…" indicator in the iframe during processing.
 *   - Skips already-processed messages.
 *
 * Customization points:
 *   - STYLE_RULES: array of rule strings that the AI should follow.
 *   - MAX_CONTENT_LENGTH: truncation limit for the instruction prompt.
 *
 * Caveats:
 *   - Adds latency to every AI message (one additional LLM call).
 *   - Rewriting may occasionally alter intended meaning.
 *   - Network errors leave the message unchanged.
 */
(async () => {
  if (window.__pcbw_styleEnforcer_init) return;
  window.__pcbw_styleEnforcer_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_styleEnf";
  const MAX_CONTENT_LENGTH = 1500;

  const STYLE_RULES = [
    "Keep responses under 3 paragraphs.",
    "Use vivid sensory details in descriptions.",
    "Stay in character at all times — never break the fourth wall.",
    "Use present tense for narration.",
    "Avoid repeating phrases from the previous message."
  ];
  // ─────────────────────────────────────────────────────────────────────

  // ─── Status Indicator ────────────────────────────────────────────────
  const indicator = document.createElement("div");
  indicator.id = "pcbw-style-indicator";
  indicator.style.cssText = [
    "position:fixed; bottom:8px; right:8px; z-index:9999;",
    "padding:4px 10px; border-radius:8px; font-size:11px;",
    "font-family:sans-serif; opacity:0; transition:opacity .3s;",
    "background:light-dark(#FFF3E0,#3E2723); color:light-dark(#E65100,#FFB74D);"
  ].join("");
  indicator.textContent = "✨ Refining…";
  document.body.appendChild(indicator);

  function showIndicator() { indicator.style.opacity = "1"; }
  function hideIndicator() { indicator.style.opacity = "0"; }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already processed
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      showIndicator();

      const rulesText = STYLE_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n");
      const truncated = lastMsg.content.slice(0, MAX_CONTENT_LENGTH);

      const instruction =
        `Rewrite the following message to strictly follow these style rules:\n${rulesText}\n\n` +
        `Original message:\n---\n${truncated}\n---\n\n` +
        `Respond with ONLY the rewritten message. Preserve the core meaning and events.`;

      const result = await oc.getInstructCompletion({ instruction });

      if (result && result.trim().length > 10) {
        lastMsg.content = result.trim();
      }

      // Mark as processed
      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { processed: true, at: new Date().toISOString() };

      console.log("[pcbw-styleEnf] Message refined successfully.");
    } catch (err) {
      console.error("[pcbw-styleEnf] Refinement error:", err);
    } finally {
      hideIndicator();
    }
  });

  console.log("[pcbw-styleEnf] Response style enforcer loaded.");
})();

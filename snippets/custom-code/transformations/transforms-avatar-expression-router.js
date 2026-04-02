/**
 * Snippet: transforms-avatar-expression-router
 *
 * Purpose:
 *   After each AI message, classifies the emotional tone using
 *   oc.getInstructCompletion() and sets the message's avatar to an
 *   expression-specific image URL. Appends a hidden visual indicator
 *   (hidden from AI) showing the detected expression.
 *
 * Why realistic:
 *   Uses per-message avatar property (documented), oc.getInstructCompletion()
 *   (documented LLM helper), per-message customData (documented), and
 *   hidden-from-ai HTML comments (documented). All character-agnostic.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, classifies expression from configurable list.
 *   - Sets message avatar URL to the matching expression image.
 *   - Appends a small expression emoji badge to the message (hidden from AI).
 *   - Caches classification in per-message customData.
 *
 * Customization points:
 *   - EXPRESSIONS: define expression labels, avatar URLs, and display emojis.
 *   - DEFAULT_EXPRESSION: fallback when classification fails.
 *
 * Caveats:
 *   - Avatar URLs must be valid, publicly accessible, or data URIs.
 *   - LLM call adds latency to each AI response.
 *   - Placeholder URLs in default config — replace with your own.
 */
(async () => {
  if (window.__pcbw_avatarExpr_init) return;
  window.__pcbw_avatarExpr_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_avatarExpr";
  const DEFAULT_EXPRESSION = "neutral";

  const EXPRESSIONS = {
    happy:    { emoji: "😊", avatarUrl: "" },
    sad:      { emoji: "😢", avatarUrl: "" },
    angry:    { emoji: "😠", avatarUrl: "" },
    surprised:{ emoji: "😲", avatarUrl: "" },
    neutral:  { emoji: "😐", avatarUrl: "" },
    amused:   { emoji: "😄", avatarUrl: "" },
    worried:  { emoji: "😟", avatarUrl: "" }
  };

  const EXPRESSION_LABELS = Object.keys(EXPRESSIONS);
  // ─────────────────────────────────────────────────────────────────────

  async function classifyExpression(text) {
    const instruction =
      `Classify the emotional expression of the speaker in the following text. ` +
      `Choose exactly one from: ${EXPRESSION_LABELS.join(", ")}. ` +
      `Respond with ONLY the label.\n\nText:\n${text.slice(0, 600)}`;
    const result = await oc.getInstructCompletion({ instruction });
    const cleaned = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    return EXPRESSION_LABELS.includes(cleaned) ? cleaned : DEFAULT_EXPRESSION;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already processed
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      const expression = await classifyExpression(lastMsg.content);
      const exprInfo = EXPRESSIONS[expression] || EXPRESSIONS[DEFAULT_EXPRESSION];

      // Set per-message avatar if URL is provided
      if (exprInfo.avatarUrl) {
        lastMsg.avatar = { url: exprInfo.avatarUrl };
      }

      // Append hidden expression badge (visible to user, hidden from AI)
      lastMsg.content +=
        `\n<!--hidden-from-ai-start-->` +
        `<span style="display:inline-block;margin-top:4px;font-size:11px;` +
        `opacity:0.7;font-family:sans-serif;">` +
        `${exprInfo.emoji} ${expression}` +
        `</span>` +
        `<!--hidden-from-ai-end-->`;

      // Cache in per-message customData
      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { expression: expression };

      console.log(`[pcbw-avatar] Expression: ${expression} ${exprInfo.emoji}`);
    } catch (err) {
      console.error("[pcbw-avatar] Classification error:", err);
    }
  });

  console.log("[pcbw-avatar] Avatar expression router loaded.");
})();

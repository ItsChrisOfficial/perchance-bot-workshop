/**
 * Snippet: prompting-last-message-classifier
 *
 * Purpose:
 *   Classifies each AI message into a configurable category (e.g. action,
 *   dialogue, narration, question, emotional, descriptive) using
 *   oc.getInstructCompletion(). Stores the classification in per-message
 *   customData and applies a category-specific border color via wrapperStyle.
 *   Appends a hidden classification badge visible only to the user.
 *
 * Why realistic:
 *   Uses documented APIs: getInstructCompletion, per-message customData,
 *   wrapperStyle, hidden-from-ai HTML comments. Network-dependent with
 *   graceful fallback.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, classifies content and applies color-coded border.
 *   - Appends small badge text (hidden from AI) showing the category.
 *
 * Customization points:
 *   - CATEGORIES: define category labels with colors.
 *   - DEFAULT_CATEGORY: fallback category.
 *
 * Caveats:
 *   - One LLM call per AI message (latency).
 *   - Classification accuracy depends on LLM quality.
 */
(async () => {
  if (window.__pcbw_msgClassifier_init) return;
  window.__pcbw_msgClassifier_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_classify";
  const DEFAULT_CATEGORY = "general";

  const CATEGORIES = {
    action:      { color: "#F44336", emoji: "⚔️" },
    dialogue:    { color: "#2196F3", emoji: "💬" },
    narration:   { color: "#9C27B0", emoji: "📖" },
    question:    { color: "#FF9800", emoji: "❓" },
    emotional:   { color: "#E91E63", emoji: "💗" },
    descriptive: { color: "#4CAF50", emoji: "🎨" },
    general:     { color: "#757575", emoji: "📝" }
  };

  const CATEGORY_LABELS = Object.keys(CATEGORIES);
  // ─────────────────────────────────────────────────────────────────────

  async function classify(text) {
    const instruction =
      `Classify the following message into exactly one category from: ${CATEGORY_LABELS.join(", ")}.\n` +
      `- action: physical actions, combat, movement\n` +
      `- dialogue: direct speech, conversation\n` +
      `- narration: storytelling, exposition\n` +
      `- question: asks something\n` +
      `- emotional: focuses on feelings, internal states\n` +
      `- descriptive: detailed scene/environment description\n` +
      `- general: none of the above\n\n` +
      `Respond with ONLY the category label.\n\nText:\n${text.slice(0, 600)}`;
    const result = await oc.getInstructCompletion({ instruction });
    const cleaned = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    return CATEGORY_LABELS.includes(cleaned) ? cleaned : DEFAULT_CATEGORY;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already classified
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      const category = await classify(lastMsg.content);
      const catInfo = CATEGORIES[category] || CATEGORIES[DEFAULT_CATEGORY];

      // Apply border color
      lastMsg.wrapperStyle =
        (lastMsg.wrapperStyle || "") +
        `border-left: 3px solid ${catInfo.color}; padding-left: 6px;`;

      // Append hidden badge
      lastMsg.content +=
        `\n<!--hidden-from-ai-start-->` +
        `<span style="display:inline-block;margin-top:4px;font-size:10px;` +
        `color:${catInfo.color};font-family:sans-serif;opacity:0.8;">` +
        `${catInfo.emoji} ${category}` +
        `</span>` +
        `<!--hidden-from-ai-end-->`;

      // Store in per-message customData
      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { category, at: new Date().toISOString() };

      console.log(`[pcbw-classify] Category: ${category} ${catInfo.emoji}`);
    } catch (err) {
      console.error("[pcbw-classify] Error:", err);
    }
  });

  console.log("[pcbw-classify] Message classifier loaded.");
})();

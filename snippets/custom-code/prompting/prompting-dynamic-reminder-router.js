/**
 * Snippet: prompting-dynamic-reminder-router
 *
 * Purpose:
 *   Maintains configurable reminder templates keyed by situation type.
 *   After each user message, classifies intent via oc.getInstructCompletion()
 *   and swaps oc.character.reminderMessage to the matching template.
 *
 * Why realistic:
 *   Uses oc.character.reminderMessage (documented, writable, propagates
 *   immediately), oc.getInstructCompletion() (documented LLM helper),
 *   oc.thread.customData (documented persistence). Network-dependent
 *   classification with fallback.
 *
 * Immediate behavior when pasted:
 *   - On each user message, classifies intent and selects a reminder.
 *   - Updates oc.character.reminderMessage for the next AI response.
 *   - Shows active reminder label in iframe.
 *
 * Customization points:
 *   - REMINDERS: keyed object of situation → reminder text.
 *   - SITUATION_LABELS: must match keys in REMINDERS.
 *   - DEFAULT_SITUATION: fallback when classification is ambiguous.
 *
 * Caveats:
 *   - Overwrites reminderMessage — coordinate with other snippets.
 *   - Classification runs on user messages, adding slight latency before AI responds.
 */
(async () => {
  if (window.__pcbw_reminderRouter_init) return;
  window.__pcbw_reminderRouter_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_reminder";
  const DEFAULT_SITUATION = "general";

  const REMINDERS = {
    combat: "Focus on action, tactics, and physical consequences. Describe attacks, defenses, and movement dynamically. Keep combat tense and consequential.",
    emotional: "Be empathetic and nuanced. Explore internal feelings and motivations. Use body language and subtle cues. Allow moments of vulnerability.",
    exploration: "Describe the environment richly with sensory details. Reveal information gradually. Create a sense of discovery and wonder.",
    dialogue: "Maintain natural conversation flow. Use distinct speech patterns. Keep responses conversational and include direct speech.",
    puzzle: "Present challenges fairly. Give hints without revealing answers. Reward clever thinking. Maintain internal logic.",
    general: "Respond naturally to the situation. Balance description, dialogue, and action appropriately."
  };

  const SITUATION_LABELS = Object.keys(REMINDERS);
  // ─────────────────────────────────────────────────────────────────────

  // Initialize state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { activeSituation: DEFAULT_SITUATION };
  }
  const state = oc.thread.customData[NAMESPACE];

  // ─── Label UI ────────────────────────────────────────────────────────
  const label = document.createElement("div");
  label.id = "pcbw-reminder-label";
  label.style.cssText = [
    "position:fixed; bottom:8px; right:8px; z-index:9999;",
    "padding:3px 8px; border-radius:8px; font-size:11px;",
    "font-family:sans-serif; pointer-events:none;",
    "background:light-dark(#F3E5F5,#311B92); color:light-dark(#6A1B9A,#CE93D8);",
    "box-shadow:0 1px 3px rgba(0,0,0,.12);"
  ].join("");
  document.body.appendChild(label);

  function applyReminder(situationKey) {
    const text = REMINDERS[situationKey] || REMINDERS[DEFAULT_SITUATION];
    state.activeSituation = situationKey;
    oc.character.reminderMessage = text;
    label.textContent = "🔔 " + situationKey;
  }

  // Apply current on load
  applyReminder(state.activeSituation);

  async function classifySituation(text) {
    const instruction =
      `Classify the user's intent/situation into exactly one of: ${SITUATION_LABELS.join(", ")}.\n` +
      `Respond with ONLY the label.\n\nUser message:\n${text.slice(0, 400)}`;
    const result = await oc.getInstructCompletion({ instruction });
    const cleaned = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    return SITUATION_LABELS.includes(cleaned) ? cleaned : DEFAULT_SITUATION;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "user") return;

      const situation = await classifySituation(lastMsg.content);
      if (situation !== state.activeSituation) {
        applyReminder(situation);
        console.log(`[pcbw-reminder] Switched to: ${situation}`);
      }
    } catch (err) {
      console.error("[pcbw-reminder] Error:", err);
      // Keep current reminder on error
    }
  });

  console.log(`[pcbw-reminder] Dynamic reminder router loaded. Active: ${state.activeSituation}`);
})();

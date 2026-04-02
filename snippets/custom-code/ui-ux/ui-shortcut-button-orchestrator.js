/**
 * Snippet: ui-shortcut-button-orchestrator
 *
 * Purpose:
 *   Dynamically manages oc.thread.shortcutButtons based on conversation state.
 *   Defines button sets keyed by state name and switches between them based
 *   on configurable rules evaluated on each message.
 *
 * Why realistic:
 *   Uses oc.thread.shortcutButtons (documented, writable), oc.thread.customData
 *   (documented persistence), and MessageAdded event (documented). Offline-safe.
 *
 * Immediate behavior when pasted:
 *   - Evaluates state on each message and updates shortcut buttons accordingly.
 *   - Default state is "default"; switches to "deep" after 10+ messages.
 *   - Persists active button set in customData.
 *
 * Customization points:
 *   - BUTTON_SETS: named arrays of shortcut button objects.
 *   - RULES: functions that return a button set name based on current state.
 *   - INITIAL_SET: the starting button set.
 *
 * Caveats:
 *   - Overwrites oc.thread.shortcutButtons on each evaluation.
 *   - Coordinate with other snippets that also modify shortcut buttons.
 */
(async () => {
  if (window.__pcbw_btnOrchestrator_init) return;
  window.__pcbw_btnOrchestrator_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_btnOrch";
  const INITIAL_SET = "default";

  const BUTTON_SETS = {
    default: [
      { name: "Continue", message: "/ai Continue the story naturally.", insertionType: "replace", autoSend: true, clearAfterSend: true },
      { name: "Describe", message: "/ai Describe the current surroundings in detail.", insertionType: "replace", autoSend: true, clearAfterSend: true },
      { name: "Ask", message: "/ai Ask a question to advance the conversation.", insertionType: "replace", autoSend: true, clearAfterSend: true }
    ],
    deep: [
      { name: "Reflect", message: "/ai Reflect on recent events with emotional depth.", insertionType: "replace", autoSend: true, clearAfterSend: true },
      { name: "Flashback", message: "/ai Describe a relevant memory or flashback.", insertionType: "replace", autoSend: true, clearAfterSend: true },
      { name: "Tension", message: "/ai Introduce tension or a complication.", insertionType: "replace", autoSend: true, clearAfterSend: true },
      { name: "Resolve", message: "/ai Begin resolving the current situation.", insertionType: "replace", autoSend: true, clearAfterSend: true }
    ],
    minimal: [
      { name: "Continue", message: "/ai Continue.", insertionType: "replace", autoSend: true, clearAfterSend: true }
    ]
  };

  // Rules evaluated in order; first one that returns a set name wins.
  // Each rule receives { messageCount, lastMessage, customData }.
  const RULES = [
    function (ctx) {
      if (ctx.messageCount >= 10) return "deep";
      return null;
    }
  ];
  // ─────────────────────────────────────────────────────────────────────

  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { activeSet: INITIAL_SET };
  }
  const state = oc.thread.customData[NAMESPACE];

  function applySet(setName) {
    const buttons = BUTTON_SETS[setName];
    if (!buttons) return;
    state.activeSet = setName;
    oc.thread.shortcutButtons = buttons.map(b => ({ ...b }));
  }

  function evaluate() {
    const ctx = {
      messageCount: oc.thread.messages.length,
      lastMessage: oc.thread.messages.at(-1),
      customData: oc.thread.customData
    };

    for (const rule of RULES) {
      const result = rule(ctx);
      if (result && BUTTON_SETS[result]) {
        if (result !== state.activeSet) {
          applySet(result);
          console.log(`[pcbw-btnOrch] Switched to set: ${result}`);
        }
        return;
      }
    }
    // No rule matched — keep current set
  }

  // Apply initial set
  applySet(state.activeSet);

  oc.thread.on("MessageAdded", async function () {
    try {
      evaluate();
    } catch (err) {
      console.error("[pcbw-btnOrch] Error:", err);
    }
  });

  console.log(`[pcbw-btnOrch] Shortcut button orchestrator loaded. Active: ${state.activeSet}`);
})();

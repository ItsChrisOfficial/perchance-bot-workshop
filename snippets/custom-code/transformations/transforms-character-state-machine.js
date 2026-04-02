/**
 * Snippet: transforms-character-state-machine
 *
 * Purpose:
 *   A configurable finite state machine (FSM) persisted in oc.thread.customData.
 *   On each AI message, classifies the message mood via oc.getInstructCompletion()
 *   and transitions the FSM state based on configurable rules. Each state applies
 *   a distinct wrapperStyle to AI messages and shows a status badge in the iframe.
 *
 * Why realistic:
 *   Uses documented oc.thread.customData for persistence, oc.getInstructCompletion()
 *   for classification (documented LLM helper), and wrapperStyle for per-message
 *   styling (documented message property). All iframe-local DOM.
 *
 * Immediate behavior when pasted:
 *   - Creates a small floating badge in the iframe showing the current FSM state.
 *   - On each AI message, classifies mood and transitions state accordingly.
 *   - Applies per-state CSS to the AI message bubble.
 *
 * Customization points:
 *   - STATES: define your own states with labels and CSS.
 *   - TRANSITIONS: define which moods trigger which state transitions.
 *   - MOOD_LABELS: the mood vocabulary used for classification.
 *   - INITIAL_STATE: the starting state key.
 *
 * Caveats:
 *   - LLM classification is network-dependent; errors are caught and state is unchanged.
 *   - Classification adds latency to each AI message.
 */
(async () => {
  if (window.__pcbw_fsm_init) return;
  window.__pcbw_fsm_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_fsm";
  const INITIAL_STATE = "neutral";

  const STATES = {
    neutral:  { label: "😐 Neutral",   style: "border-left: 3px solid gray;" },
    happy:    { label: "😊 Happy",     style: "border-left: 3px solid #4CAF50;" },
    tense:    { label: "😠 Tense",     style: "border-left: 3px solid #F44336;" },
    sad:      { label: "😢 Sad",       style: "border-left: 3px solid #2196F3;" },
    excited:  { label: "🎉 Excited",   style: "border-left: 3px solid #FF9800;" }
  };

  const MOOD_LABELS = ["happy", "sad", "angry", "excited", "calm", "fearful", "neutral"];

  // Maps detected mood → target FSM state
  const TRANSITIONS = {
    happy:   "happy",
    sad:     "sad",
    angry:   "tense",
    excited: "excited",
    calm:    "neutral",
    fearful: "tense",
    neutral: "neutral"
  };
  // ─────────────────────────────────────────────────────────────────────

  // Initialize persisted state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { currentState: INITIAL_STATE, history: [] };
  }
  const fsm = oc.thread.customData[NAMESPACE];

  // ─── Badge UI ────────────────────────────────────────────────────────
  const badge = document.createElement("div");
  badge.id = "pcbw-fsm-badge";
  badge.style.cssText = [
    "position:fixed; top:8px; right:8px; z-index:9999;",
    "padding:4px 10px; border-radius:12px; font-size:13px;",
    "font-family:sans-serif; pointer-events:none;",
    "background:light-dark(#f5f5f5,#333); color:light-dark(#222,#eee);",
    "box-shadow:0 1px 4px rgba(0,0,0,.2); transition:opacity .3s;"
  ].join("");
  document.body.appendChild(badge);

  function updateBadge() {
    const info = STATES[fsm.currentState] || STATES[INITIAL_STATE];
    badge.textContent = info.label;
  }
  updateBadge();

  // ─── Classify + Transition ───────────────────────────────────────────
  async function classifyMood(text) {
    const instruction =
      `Classify the emotional mood of the following text into exactly one of these labels: ${MOOD_LABELS.join(", ")}.\n` +
      `Respond with ONLY the label, nothing else.\n\nText:\n${text.slice(0, 800)}`;
    const result = await oc.getInstructCompletion({ instruction });
    const cleaned = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    return MOOD_LABELS.includes(cleaned) ? cleaned : "neutral";
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      const mood = await classifyMood(lastMsg.content);
      const targetState = TRANSITIONS[mood] || INITIAL_STATE;

      // Record transition
      fsm.history.push({
        from: fsm.currentState,
        to: targetState,
        mood: mood,
        at: new Date().toISOString()
      });
      // Cap history at 50 entries
      if (fsm.history.length > 50) fsm.history.splice(0, fsm.history.length - 50);

      fsm.currentState = targetState;

      // Apply per-state style to the message
      const stateInfo = STATES[targetState] || STATES[INITIAL_STATE];
      lastMsg.wrapperStyle = (lastMsg.wrapperStyle || "") + stateInfo.style;

      updateBadge();
      console.log(`[pcbw-fsm] Mood: ${mood} → State: ${targetState}`);
    } catch (err) {
      console.error("[pcbw-fsm] Classification error:", err);
    }
  });

  console.log("[pcbw-fsm] Character state machine loaded. State:", fsm.currentState);
})();

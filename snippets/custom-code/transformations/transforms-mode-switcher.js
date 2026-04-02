/**
 * Snippet: transforms-mode-switcher
 *
 * Purpose:
 *   Allows toggling between conversation modes (e.g. narrative, dialogue, combat,
 *   puzzle) via dynamically generated shortcut buttons. Each mode sets a tailored
 *   reminderMessage and a per-mode wrapperStyle on new AI messages.
 *
 * Why realistic:
 *   Uses oc.thread.shortcutButtons (documented), oc.character.reminderMessage
 *   (documented, writable), wrapperStyle (documented), and oc.thread.customData
 *   for persistence. All offline-safe, character-agnostic.
 *
 * Immediate behavior when pasted:
 *   - Initializes in "dialogue" mode (configurable).
 *   - Creates shortcut buttons for each mode so the user can switch.
 *   - Applies mode-specific CSS and reminder to the AI.
 *   - Shows current mode label in iframe.
 *
 * Customization points:
 *   - MODES: add/remove/edit modes with label, reminderText, and style.
 *   - DEFAULT_MODE: the mode active on first load.
 *
 * Caveats:
 *   - Overwrites oc.character.reminderMessage; coordinate with other snippets
 *     that may also write to it.
 *   - Replaces oc.thread.shortcutButtons with mode-switch buttons on init.
 *     Append to existing buttons if needed.
 */
(async () => {
  if (window.__pcbw_modeSwitcher_init) return;
  window.__pcbw_modeSwitcher_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_mode";
  const DEFAULT_MODE = "dialogue";

  const MODES = {
    dialogue: {
      label: "💬 Dialogue",
      reminderText: "Focus on character dialogue and conversation. Keep responses conversational, include direct speech, and maintain natural back-and-forth.",
      style: "border-left: 3px solid #2196F3; padding-left: 8px;"
    },
    narrative: {
      label: "📖 Narrative",
      reminderText: "Write in a narrative style with rich descriptions, sensory details, and third-person perspective. Focus on atmosphere and storytelling.",
      style: "border-left: 3px solid #9C27B0; font-style: italic;"
    },
    combat: {
      label: "⚔️ Combat",
      reminderText: "Describe combat actions vividly with tactical details. Keep responses dynamic and action-oriented. Include movement, attacks, and consequences.",
      style: "border-left: 3px solid #F44336; font-weight: bold;"
    },
    puzzle: {
      label: "🧩 Puzzle",
      reminderText: "Present logical challenges, riddles, or problem-solving scenarios. Give hints when asked but do not reveal answers immediately. Encourage thinking.",
      style: "border-left: 3px solid #FF9800;"
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  // Initialize state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { activeMode: DEFAULT_MODE };
  }
  const state = oc.thread.customData[NAMESPACE];

  // ─── Mode Label in Iframe ────────────────────────────────────────────
  const label = document.createElement("div");
  label.id = "pcbw-mode-label";
  label.style.cssText = [
    "position:fixed; bottom:8px; left:8px; z-index:9999;",
    "padding:4px 10px; border-radius:10px; font-size:12px;",
    "font-family:sans-serif;",
    "background:light-dark(#f0f0f0,#333); color:light-dark(#222,#eee);",
    "box-shadow:0 1px 3px rgba(0,0,0,.15); pointer-events:none;"
  ].join("");
  document.body.appendChild(label);

  function applyMode(modeKey) {
    const mode = MODES[modeKey];
    if (!mode) return;
    state.activeMode = modeKey;
    oc.character.reminderMessage = mode.reminderText;
    label.textContent = "Mode: " + mode.label;
    console.log(`[pcbw-mode] Switched to: ${modeKey}`);
  }

  // ─── Build Shortcut Buttons ──────────────────────────────────────────
  function buildButtons() {
    const buttons = [];
    for (const [key, mode] of Object.entries(MODES)) {
      if (key === state.activeMode) continue; // Don't show button for current mode
      buttons.push({
        name: mode.label,
        message: `/sys Mode switched to ${key}. The AI should now respond in ${key} style.`,
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      });
    }
    oc.thread.shortcutButtons = buttons;
  }

  // Listen for system messages that contain our mode-switch pattern
  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);

      // Detect mode-switch system messages
      if (lastMsg && lastMsg.author === "system") {
        const match = lastMsg.content.match(/Mode switched to (\w+)/);
        if (match && MODES[match[1]]) {
          applyMode(match[1]);
          buildButtons();
          return;
        }
      }

      // Apply style to AI messages in current mode
      if (lastMsg && lastMsg.author === "ai") {
        const modeInfo = MODES[state.activeMode];
        if (modeInfo) {
          lastMsg.wrapperStyle = (lastMsg.wrapperStyle || "") + modeInfo.style;
        }
      }
    } catch (err) {
      console.error("[pcbw-mode] Error:", err);
    }
  });

  // Apply initial mode and build buttons
  applyMode(state.activeMode);
  buildButtons();

  console.log("[pcbw-mode] Mode switcher loaded. Active:", state.activeMode);
})();

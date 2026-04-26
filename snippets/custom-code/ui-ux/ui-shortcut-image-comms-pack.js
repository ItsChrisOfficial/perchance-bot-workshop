/**
 * Snippet: ui-shortcut-image-comms-pack
 *
 * Purpose:
 *   Adds four capabilities to any bot:
 *   1. /hidden [text] slash command — creates a system message that is hidden
 *      from the user (hiddenFrom: ["user"]) with expectsReply: false, letting
 *      you inject AI-only context without surfacing it in the chat log.
 *   2. 📸 Scene shortcut — generates a scene image mid-action (triggered by the
 *      user before the AI's next reply) using oc.textToImage(). The image is
 *      shown to the user and hidden from the AI to avoid wasting context tokens.
 *   3. 📸 {{char}} POV shortcut — generates the same scene from the character's
 *      first-person point of view, also mid-action and hidden from the AI.
 *   4. Comms toggle shortcut — toggles oc.character.reminderMessage between a
 *      text/call communication style and a face-to-face communication style.
 *      The injected toggle notification is hidden from the user (hiddenFrom:
 *      ["user"]) so only the AI sees the mode-change instruction.
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented), oc.thread.messages (splice/
 *   push — documented), oc.thread.shortcutButtons (documented, writable),
 *   oc.character.reminderMessage (documented, writable), oc.textToImage()
 *   (documented), oc.getInstructCompletion() (documented), and
 *   oc.thread.customData (documented persistence). All gracefully degraded.
 *
 * Immediate behavior when pasted:
 *   - /hidden command: removes user message, injects hiddenFrom:["user"] system
 *     message with expectsReply:false so only the AI receives it.
 *   - Three buttons are added to oc.thread.shortcutButtons alongside the
 *     existing 🗣️ {{char}} base button: 📸 Scene, 📸 {{char}} POV, and the
 *     active comms-mode toggle button.
 *   - Image buttons: build scene description via oc.getInstructCompletion(),
 *     call oc.textToImage(), display the result as a hiddenFrom:["ai"] system
 *     message so the user sees the image but the AI does not.
 *   - Comms toggle: flips between "textcall" and "facetoface" reminder modes,
 *     updates oc.character.reminderMessage, refreshes the toggle button label,
 *     and pushes a hiddenFrom:["user"] system message so the AI adapts its
 *     communication style.
 *
 * Customization points:
 *   - HIDDEN_CMD: command prefix for the hidden-message slash command.
 *   - COMMS_MODES: reminder text and labels for each communication style.
 *   - DEFAULT_COMMS_MODE: starting communication mode key.
 *   - BASE_BUTTONS: existing shortcut buttons to preserve alongside new ones.
 *   - IMAGE_CONTEXT_MSGS: how many recent messages to feed the image-prompt
 *     builder (more = richer but slower extraction call).
 *
 * Caveats:
 *   - oc.textToImage() is rate-limited and slow (5–15 s per image). A
 *     generating flag prevents duplicate concurrent calls; pending requests
 *     surface a user-visible warning.
 *   - Overwrites oc.thread.shortcutButtons; coordinate with other snippets
 *     that write to shortcutButtons (e.g. ui-shortcut-button-orchestrator).
 *   - Overwrites oc.character.reminderMessage on every comms toggle; do not
 *     combine with prompting-dynamic-reminder-router without merging their
 *     reminder-write logic into a single owner.
 *   - /hidden command messages are permanently spliced from the thread.
 *   - Image buttons do NOT trigger an automatic AI reply — the user continues
 *     the conversation by clicking the 🗣️ {{char}} button or typing normally.
 */
(async () => {
  if (window.__pcbw_imgCommsPack_init) return;
  window.__pcbw_imgCommsPack_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_imgCommsPack";
  const HIDDEN_CMD = "/hidden";
  const IMAGE_CONTEXT_MSGS = 6;
  const DEFAULT_COMMS_MODE = "facetoface";

  const COMMS_MODES = {
    textcall: {
      label: "📱 Text/Call",
      toggleLabel: "📱 → Text/Call",
      reminder:
        "You are currently communicating via text message or phone call. " +
        "Write responses as if texting or talking on the phone: short, " +
        "natural sentences, no physical action descriptions or emotes unless " +
        "very brief. Match the informal, fragmented style of real digital " +
        "or voice communication."
    },
    facetoface: {
      label: "👁️ Face-to-Face",
      toggleLabel: "👁️ → Face-to-Face",
      reminder:
        "You are currently communicating face to face with the user. " +
        "Write responses with full physical presence: include body language, " +
        "facial expressions, actions, and dialogue in a natural in-person " +
        "conversation style. Add sensory and environmental detail appropriate " +
        "to the setting."
    }
  };

  // Base buttons to preserve when building the shortcutButtons array.
  // These reflect the bot's existing shortcut configuration.
  const BASE_BUTTONS = [
    {
      name: "🗣️ {{char}}",
      message: "/ai ",
      insertionType: "replace",
      autoSend: true,
      clearAfterSend: true
    }
  ];

  // Internal trigger tokens sent by the shortcut buttons.
  // These strings are intentionally obscure to avoid accidental collisions
  // with normal user input.
  const TRIGGER_SCENE = "__PCBW_SCENE_IMG__";
  const TRIGGER_POV   = "__PCBW_POV_IMG__";
  const TRIGGER_COMMS = "__PCBW_TOGGLE_COMMS__";
  // ─────────────────────────────────────────────────────────────────────

  // ─── State initialisation ────────────────────────────────────────────
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = {
      commsMode: DEFAULT_COMMS_MODE,
      generating: false
    };
  }
  const state = oc.thread.customData[NAMESPACE];

  // Apply the persisted comms reminder on load.
  oc.character.reminderMessage = COMMS_MODES[state.commsMode].reminder;

  // ─── Button builder ──────────────────────────────────────────────────
  function buildButtons() {
    const otherModeKey = state.commsMode === "textcall" ? "facetoface" : "textcall";
    const otherMode = COMMS_MODES[otherModeKey];

    return [
      ...BASE_BUTTONS,
      {
        name: "📸 Scene",
        message: TRIGGER_SCENE,
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      },
      {
        name: "📸 {{char}} POV",
        message: TRIGGER_POV,
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      },
      {
        name: otherMode.toggleLabel,
        message: TRIGGER_COMMS,
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      }
    ];
  }

  oc.thread.shortcutButtons = buildButtons();

  // ─── Utility helpers ─────────────────────────────────────────────────

  /** Remove a message object from the thread by reference. */
  function removeMessage(msg) {
    const idx = oc.thread.messages.indexOf(msg);
    if (idx >= 0) oc.thread.messages.splice(idx, 1);
  }

  /**
   * Push a brief status message visible only to the user.
   * Used for loading states and confirmations.
   */
  function pushUserOnlyMsg(html) {
    oc.thread.messages.push({
      author: "system",
      content: html,
      hiddenFrom: ["ai"],
      expectsReply: false
    });
  }

  /**
   * Build a concise visual scene description from recent messages using the
   * LLM. Returns a plain-text string, or null on failure.
   */
  async function buildSceneDescription() {
    const recent = oc.thread.messages
      .filter(m => m.author === "ai" || m.author === "user")
      .slice(-IMAGE_CONTEXT_MSGS)
      .map(m =>
        `[${m.author}]: ${(m.content || "")
          .replace(/<!--hidden-from-ai-start-->[\s\S]*?<!--hidden-from-ai-end-->/g, "")
          .replace(/<[^>]+>/g, "")
          .slice(0, 300)}`
      )
      .join("\n");

    if (!recent.trim()) return null;

    const instruction =
      "From the following roleplay excerpt, extract a concise visual scene " +
      "description for an image generator. Include: characters (appearance, " +
      "not names), setting/environment, mood, and key action or pose. Output " +
      "ONLY the scene description, 1–2 sentences, no character names.\n\n" +
      "Excerpt:\n" + recent;

    try {
      const raw = await oc.getInstructCompletion({ instruction });
      const cleaned = (raw || "").trim();
      return cleaned.length >= 10 ? cleaned : null;
    } catch (err) {
      console.error("[pcbw-imgCommsPack] buildSceneDescription error:", err);
      return null;
    }
  }

  /**
   * Call oc.textToImage() and return a usable image src string.
   * Returns an empty string on failure.
   */
  async function generateImage(prompt) {
    try {
      const result = await oc.textToImage(prompt);
      if (typeof result === "string") return result;
      if (result && result.dataUrl) return result.dataUrl;
      return "";
    } catch (err) {
      console.error("[pcbw-imgCommsPack] oc.textToImage error:", err);
      return "";
    }
  }

  /**
   * Inject a generated image as a user-visible, AI-hidden system message.
   * The AI does not see the image data, preventing token waste.
   */
  function showImageToUser(dataUrl, caption) {
    oc.thread.messages.push({
      author: "system",
      content:
        `<div style="margin:4px 0;">` +
        `<em style="font-size:11px;color:light-dark(#888,#666);">${caption}</em>` +
        `<img src="${dataUrl}" ` +
        `style="max-width:100%;border-radius:8px;display:block;margin-top:4px;">` +
        `</div>`,
      hiddenFrom: ["ai"],
      expectsReply: false
    });
  }

  // ─── Main message handler ────────────────────────────────────────────
  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "user") return;

      const content = (lastMsg.content || "").trim();

      // ── /hidden slash command ─────────────────────────────────────
      // Usage: /hidden [text to inject as AI-only context]
      // Removes the user message and injects a hiddenFrom:["user"] system
      // message with expectsReply:false so only the AI receives the text.
      if (content.toLowerCase().startsWith(HIDDEN_CMD + " ") || content.toLowerCase() === HIDDEN_CMD) {
        const text = content.slice(HIDDEN_CMD.length).trim();
        removeMessage(lastMsg);
        if (text) {
          oc.thread.messages.push({
            author: "system",
            content: text,
            hiddenFrom: ["user"],
            expectsReply: false
          });
          console.log("[pcbw-imgCommsPack] Hidden system message injected.");
        }
        return;
      }

      // ── 📸 Scene image (mid-action) ───────────────────────────────
      // Generates a neutral third-person scene image from recent context
      // before the AI produces its next response.
      if (content === TRIGGER_SCENE) {
        if (state.generating) {
          removeMessage(lastMsg);
          pushUserOnlyMsg("⏳ Image already generating — please wait.");
          return;
        }

        removeMessage(lastMsg);
        state.generating = true;
        pushUserOnlyMsg("📸 Generating scene image…");

        const sceneDesc = await buildSceneDescription();
        if (!sceneDesc) {
          state.generating = false;
          // Replace the loading message with the error.
          const loadMsg = oc.thread.messages.findLast(
            m => m.author === "system" && (m.content || "").includes("Generating scene image")
          );
          if (loadMsg) removeMessage(loadMsg);
          pushUserOnlyMsg("❌ Could not extract scene description — try again after more messages.");
          return;
        }

        const prompt =
          "detailed digital painting, " + sceneDesc +
          ", cinematic lighting, high quality, 8k";
        const dataUrl = await generateImage(prompt);
        state.generating = false;

        const loadMsg = oc.thread.messages.findLast(
          m => m.author === "system" && (m.content || "").includes("Generating scene image")
        );
        if (loadMsg) removeMessage(loadMsg);

        if (!dataUrl) {
          pushUserOnlyMsg("❌ Image generation failed. Try again.");
          return;
        }

        showImageToUser(dataUrl, "📸 Scene");
        console.log("[pcbw-imgCommsPack] Scene image shown.");
        return;
      }

      // ── 📸 {{char}} POV image (mid-action) ───────────────────────
      // Generates the same scene from the character's first-person
      // perspective before the AI produces its next response.
      if (content === TRIGGER_POV) {
        if (state.generating) {
          removeMessage(lastMsg);
          pushUserOnlyMsg("⏳ Image already generating — please wait.");
          return;
        }

        removeMessage(lastMsg);
        state.generating = true;
        pushUserOnlyMsg("📸 Generating character POV image…");

        const sceneDesc = await buildSceneDescription();
        if (!sceneDesc) {
          state.generating = false;
          const loadMsg = oc.thread.messages.findLast(
            m => m.author === "system" && (m.content || "").includes("Generating character POV image")
          );
          if (loadMsg) removeMessage(loadMsg);
          pushUserOnlyMsg("❌ Could not extract scene description — try again after more messages.");
          return;
        }

        const prompt =
          "first-person point of view, seen through the character's eyes, " +
          sceneDesc +
          ", immersive POV perspective, highly detailed, cinematic, 8k";
        const dataUrl = await generateImage(prompt);
        state.generating = false;

        const loadMsg = oc.thread.messages.findLast(
          m => m.author === "system" && (m.content || "").includes("Generating character POV image")
        );
        if (loadMsg) removeMessage(loadMsg);

        if (!dataUrl) {
          pushUserOnlyMsg("❌ Image generation failed. Try again.");
          return;
        }

        showImageToUser(dataUrl, "📸 {{char}} POV");
        console.log("[pcbw-imgCommsPack] POV image shown.");
        return;
      }

      // ── Comms mode toggle ─────────────────────────────────────────
      // Flips reminderMessage between text/call and face-to-face styles.
      // The toggle notification is hidden from the user (hiddenFrom:["user"])
      // so only the AI receives the mode-change instruction.
      if (content === TRIGGER_COMMS) {
        removeMessage(lastMsg);

        const newMode = state.commsMode === "textcall" ? "facetoface" : "textcall";
        state.commsMode = newMode;
        oc.character.reminderMessage = COMMS_MODES[newMode].reminder;
        oc.thread.shortcutButtons = buildButtons();

        // AI-only notification (hidden from user) so it adapts its style.
        oc.thread.messages.push({
          author: "system",
          content:
            `[Communication mode has switched to: ${COMMS_MODES[newMode].label}. ` +
            `Adjust your response style accordingly for the next reply.]`,
          hiddenFrom: ["user"],
          expectsReply: false
        });

        // User-visible confirmation (hidden from AI to avoid token waste).
        pushUserOnlyMsg(
          `<span style="font-size:12px;font-family:sans-serif;">` +
          `✅ Communication mode: <strong>${COMMS_MODES[newMode].label}</strong>` +
          `</span>`
        );

        console.log("[pcbw-imgCommsPack] Comms mode toggled to:", newMode);
        return;
      }
    } catch (err) {
      console.error("[pcbw-imgCommsPack] Unhandled error:", err);
    }
  });

  console.log(
    "[pcbw-imgCommsPack] Image & comms pack loaded. Comms mode:",
    state.commsMode
  );
})();

/**
 * Snippet: ui-shortcut-image-comms-pack
 *
 * Purpose:
 *   Adds five capabilities to any bot:
 *
 *   Slash command reply-as router (/ prefix):
 *     /sys [text]   — reply as system: push { author:"system" }, visible to
 *                     both user and AI, expectsReply:false.
 *     /ai [text]    — reply as AI: push { author:"ai" }, visible to both,
 *                     expectsReply:false. Useful for pre-writing AI turns or
 *                     injecting fake AI context.
 *     /user [text]  — reply as user: push { author:"user" }, visible to both,
 *                     expectsReply:true — the AI will respond to the injected
 *                     user message as it would to any real user turn.
 *     /image [text] — reply as narrator: build a scene-image prompt from
 *                     recent context (+ optional extra text), generate the
 *                     image via oc.textToImage(), and push it as a narrator
 *                     (system) message that contains ONLY the image. The
 *                     message is hiddenFrom:["ai"] so the raw data URL does
 *                     not waste AI context tokens.
 *
 *   Empty-text commands (e.g. "/ai " with no payload) are NOT intercepted,
 *   preserving the base 🗣️ {{char}} shortcut button's fall-through behavior.
 *
 *   Shortcut buttons (in addition to the preserved base button):
 *     📸 Scene        — mid-action scene image (same logic as /image but
 *                       triggered by button, no extra text).
 *     📸 {{char}} POV — same scene re-generated from character's first-person
 *                       POV before the AI's next reply.
 *     Comms toggle    — toggles oc.character.reminderMessage between text/call
 *                       and face-to-face communication styles. The notification
 *                       pushed into the thread is hiddenFrom:["user"] so only
 *                       the AI sees the mode-change instruction.
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented), oc.thread.messages (splice/
 *   push — documented), oc.thread.shortcutButtons (documented, writable),
 *   oc.character.reminderMessage (documented, writable), oc.textToImage()
 *   (documented), oc.getInstructCompletion() (documented), and
 *   oc.thread.customData (documented persistence). All paths gracefully degraded.
 *
 * Immediate behavior when pasted:
 *   - Slash commands: /sys, /ai, /user, /image intercepted in MessageAdded;
 *     the triggering user message is spliced out and the appropriate reply
 *     is injected in its place.
 *   - Three extra buttons added to oc.thread.shortcutButtons alongside the
 *     existing 🗣️ {{char}} base button: 📸 Scene, 📸 {{char}} POV, and the
 *     active comms-mode toggle label.
 *   - Image generation: scene description extracted via oc.getInstructCompletion(),
 *     image generated via oc.textToImage(), result shown as hiddenFrom:["ai"]
 *     narrator message.
 *   - Comms toggle: flips between "textcall" and "facetoface" reminder modes,
 *     updates oc.character.reminderMessage, refreshes toggle button label, and
 *     pushes a hiddenFrom:["user"] system message so the AI adapts its style.
 *
 * Customization points:
 *   - COMMS_MODES: reminder text and labels for each communication style.
 *   - DEFAULT_COMMS_MODE: starting communication mode key.
 *   - BASE_BUTTONS: existing shortcut buttons to preserve alongside new ones.
 *   - IMAGE_CONTEXT_MSGS: how many recent messages feed the image-prompt
 *     builder (more = richer but slower extraction call).
 *
 * Caveats:
 *   - oc.textToImage() is rate-limited and slow (5–15 s per image). A
 *     generating flag prevents duplicate concurrent calls.
 *   - Overwrites oc.thread.shortcutButtons; coordinate with other snippets
 *     that write to shortcutButtons (e.g. ui-shortcut-button-orchestrator).
 *   - Overwrites oc.character.reminderMessage on every comms toggle; do not
 *     combine with prompting-dynamic-reminder-router without merging their
 *     reminder-write logic into a single owner.
 *   - Intercepted slash-command messages are permanently spliced from the thread.
 *   - Image shortcut buttons do NOT trigger an automatic AI reply — continue
 *     by clicking 🗣️ {{char}} or typing normally.
 */
(async () => {
  if (window.__pcbw_imgCommsPack_init) return;
  window.__pcbw_imgCommsPack_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_imgCommsPack";
  const IMAGE_CONTEXT_MSGS = 6;
  const DEFAULT_COMMS_MODE = "facetoface";

  // Slash commands handled as "reply-as" prompters.
  // Keys must be lowercase; values are matched against trimmed user input.
  const REPLY_AS_CMDS = ["/sys", "/ai", "/user", "/image"];

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

  // Validate persisted commsMode; reset to default if corrupted.
  if (!COMMS_MODES[state.commsMode]) {
    state.commsMode = DEFAULT_COMMS_MODE;
  }

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
   * Safely strip HTML tags from a string using DOM textContent extraction.
   * This avoids the incomplete-sanitization pitfall of regex-based tag stripping.
   */
  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  /**
   * Build a standard scene image prompt from a scene description string.
   * Centralises the prompt template used by /image, 📸 Scene, and 📸 POV.
   */
  function createImagePrompt(description, povPrefix) {
    const base = povPrefix ? povPrefix + description : description;
    return "detailed digital painting, " + base + ", cinematic lighting, high quality, 8k";
  }

  /**
   * Build the HTML block used inside narrator/showImageToUser messages.
   * Centralises the image + caption markup.
   */
  function createImageHTML(dataUrl, caption) {
    return (
      `<div style="margin:4px 0;">` +
      `<em style="font-size:11px;color:light-dark(#888,#666);">${caption}</em>` +
      `<img src="${dataUrl}" ` +
      `style="max-width:100%;border-radius:8px;display:block;margin-top:4px;">` +
      `</div>`
    );
  }

  /**
   * Find the most recent system message whose content contains searchText and
   * remove it from the thread. Used to clear transient loading-state messages.
   */
  function findAndRemoveLoadingMsg(searchText) {
    const msg = oc.thread.messages.findLast(
      m => m.author === "system" && (m.content || "").includes(searchText)
    );
    if (msg) removeMessage(msg);
  }

  /**
   * Build a concise visual scene description from recent messages using the
   * LLM. Returns a plain-text string, or null on failure.
   */
  async function buildSceneDescription() {
    const recent = oc.thread.messages
      .filter(m => m.author === "ai" || m.author === "user")
      .slice(-IMAGE_CONTEXT_MSGS)
      .map(m => {
        // Strip HTML comments and tags safely via DOM to prevent CodeQL
        // incomplete-multi-character-sanitization on message content.
        const raw = (m.content || "")
          .replace(/<!--hidden-from-ai-start-->[\s\S]*?<!--hidden-from-ai-end-->/g, "");
        return `[${m.author}]: ${stripHtml(raw).slice(0, 300)}`;
      })
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
      content: createImageHTML(dataUrl, caption),
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

      // ── Reply-as slash command router ────────────────────────────
      // Intercepts /sys, /ai, /user, /image and pushes a message under the
      // requested author. Commands with no payload text are NOT intercepted
      // so that the base "🗣️ {{char}}" button (/ai with empty text) keeps
      // triggering normal AI responses.
      const lowerContent = content.toLowerCase();
      const matchedCmd = REPLY_AS_CMDS.find(
        cmd => lowerContent === cmd || lowerContent.startsWith(cmd + " ")
      );

      if (matchedCmd) {
        const payload = content.slice(matchedCmd.length).trim();

        // Empty payload → fall through (don't intercept).
        if (!payload && matchedCmd !== "/image") return;

        removeMessage(lastMsg);

        switch (matchedCmd) {
          // /sys [text] — system message visible to AI and user.
          case "/sys":
            oc.thread.messages.push({
              author: "system",
              content: payload,
              hiddenFrom: [],
              expectsReply: false
            });
            console.log("[pcbw-imgCommsPack] /sys message injected.");
            break;

          // /ai [text] — fake AI turn injected directly into the thread.
          case "/ai":
            oc.thread.messages.push({
              author: "ai",
              content: payload,
              hiddenFrom: [],
              expectsReply: false
            });
            console.log("[pcbw-imgCommsPack] /ai message injected.");
            break;

          // /user [text] — user-attributed message; expectsReply:true so the
          // AI will respond to it as a real user turn.
          case "/user":
            oc.thread.messages.push({
              author: "user",
              content: payload,
              hiddenFrom: [],
              expectsReply: true
            });
            console.log("[pcbw-imgCommsPack] /user message injected.");
            break;

          // /image [optional text] — narrator image reply.
          // Builds a scene description from recent context, appends any extra
          // text from the command payload, generates the image, and pushes it
          // as a narrator (system) message that shows ONLY the image.
          // hiddenFrom:["ai"] prevents the data URL wasting context tokens.
          case "/image": {
            if (state.generating) {
              pushUserOnlyMsg("⏳ Image already generating — please wait.");
              return;
            }
            state.generating = true;
            pushUserOnlyMsg("📸 Generating narrator image…");

            const sceneDesc = await buildSceneDescription();
            const suffix = payload ? " " + payload : "";
            const finalDesc = (sceneDesc || "a scene from the story") + suffix;
            const imgPrompt = createImagePrompt(finalDesc);

            const dataUrl = await generateImage(imgPrompt);
            state.generating = false;

            findAndRemoveLoadingMsg("Generating narrator image");

            if (!dataUrl) {
              pushUserOnlyMsg("❌ Image generation failed. Try again.");
              return;
            }

            // Narrator reply: image only, no extra narrative text.
            oc.thread.messages.push({
              author: "system",
              content: createImageHTML(dataUrl, `📖 ${finalDesc}`),
              hiddenFrom: ["ai"],
              expectsReply: false
            });
            console.log("[pcbw-imgCommsPack] /image narrator message injected.");
            break;
          }
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
          findAndRemoveLoadingMsg("Generating scene image");
          pushUserOnlyMsg("❌ Could not extract scene description — try again after more messages.");
          return;
        }

        const prompt = createImagePrompt(sceneDesc);
        const dataUrl = await generateImage(prompt);
        state.generating = false;

        findAndRemoveLoadingMsg("Generating scene image");

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
          findAndRemoveLoadingMsg("Generating character POV image");
          pushUserOnlyMsg("❌ Could not extract scene description — try again after more messages.");
          return;
        }

        const prompt = createImagePrompt(
          sceneDesc,
          "first-person point of view, seen through the character's eyes, "
        );
        const dataUrl = await generateImage(prompt);
        state.generating = false;

        findAndRemoveLoadingMsg("Generating character POV image");

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

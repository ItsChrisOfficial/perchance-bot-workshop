/**
 * Snippet: ui-comms-image-controls
 *
 * Purpose:
 *   Adds four interaction controls to a Perchance character chat bot:
 *
 *   1. /hidden <text>  slash command
 *      Removes the user message and injects a system message with
 *      hiddenFrom: ["user"] and expectsReply: false — AI-only context
 *      injection without the user seeing the injected text.
 *
 *   2. "📸 Scene Image" shortcut button  (mid-action)
 *      Generates a scene image from current conversation context
 *      BEFORE the AI writes its next response. The image appears
 *      between the user's action and the AI's reply (mid-action),
 *      unlike post-action generation that runs after the AI message.
 *
 *   3. "👁️ Char POV" shortcut button
 *      Generates the same type of scene image but described from
 *      the character's first-person point of view (what the character
 *      themselves sees through their eyes).
 *
 *   4. Communication mode toggle shortcut button
 *      Switches oc.character.reminderMessage between two modes:
 *        text/call  — we are communicating via text or phone call
 *        face-to-face — we are speaking in person
 *      The button label reflects the mode you will switch TO,
 *      matching the UX convention used by transforms-mode-switcher.
 *
 * Shortcut buttons managed (owns the full shortcutButtons array):
 *   🗣️ <char name>  →  /ai           (preserved existing trigger)
 *   📸 Scene Image  →  /img-scene    (mid-action scene image)
 *   👁️ Char POV     →  /img-pov      (character POV image)
 *   📱 Text/Call    →  /toggle-comm  (or 🗣️ Face to Face, depending on state)
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented), oc.thread.messages
 *   splice/push (documented), oc.character.reminderMessage (documented,
 *   writable), oc.thread.shortcutButtons (documented, writable),
 *   oc.getInstructCompletion() (documented LLM helper), and
 *   oc.textToImage() (documented image API). State persisted in
 *   oc.thread.customData under a namespaced key.
 *
 * Customization points:
 *   - REMINDER_TEXT: reminder text for text/call mode.
 *   - REMINDER_F2F: reminder text for face-to-face mode.
 *   - EXTRACT_INSTRUCTION: LLM prompt used to extract the scene image prompt.
 *   - POV_INSTRUCTION: LLM prompt used to extract the character POV image prompt.
 *   - PROMPT_PREFIX / PROMPT_SUFFIX: prepended/appended to every image prompt.
 *
 * Caveats:
 *   - Owns oc.thread.shortcutButtons — coordinate with other snippets
 *     that also write shortcutButtons (only one should own the array).
 *   - Owns oc.character.reminderMessage — coordinate with other reminder
 *     writers (reminderMessage is a single field; writes overwrite each other).
 *   - Image generation via oc.textToImage() adds 5–15 s latency per call
 *     and is rate-limited; always provides a user-visible fallback on error.
 *   - oc.getInstructCompletion() requires a network connection for prompt
 *     extraction; gracefully skips image generation on failure.
 *   - Mid-action image generation modifies the pending user message content
 *     to "/ai" before the handler returns so the AI still generates a reply.
 */
(async () => {
  if (window.__pcbw_commsImg_init) return;
  window.__pcbw_commsImg_init = true;

  // ─── Customization Points ──────────────────────────────────────────────
  const NAMESPACE = "__pcbw_commsImg";
  const DEFAULT_MODE = "text"; // "text" | "f2f"

  const REMINDER_TEXT =
    "We are communicating via text message or phone call. " +
    "Do not describe physical presence, gestures, or the environment around you. " +
    "Keep responses natural for an asynchronous text or voice conversation.";

  const REMINDER_F2F =
    "We are speaking face to face in person. " +
    "You may use physical gestures, facial expressions, and references to " +
    "the shared environment around us. Describe your body language naturally.";

  const AI_TRIGGER = "/ai";          // Content used to let the AI reply after a mid-action shortcut
  const RECENT_MESSAGE_COUNT = 4;    // How many recent messages to include in image prompt extraction
  const MAX_CHARS_PER_MESSAGE = 300; // Character limit per message when building the extraction context

  const PROMPT_PREFIX = "detailed digital painting, ";
  const PROMPT_SUFFIX = ", high quality, dramatic lighting, vivid colors";

  const EXTRACT_INSTRUCTION =
    "From the following roleplay excerpt, extract a concise visual scene description " +
    "suitable for an image generator. Include: characters present (appearance, not names), " +
    "setting/environment, lighting, mood, and key action or pose. " +
    "Output ONLY the scene description, 1–2 sentences max, no commentary.";

  const POV_INSTRUCTION =
    "From the following roleplay excerpt, describe what the viewpoint character " +
    "sees from their own first-person perspective. Include: what is directly in " +
    "their line of sight, the environment, any other characters visible, lighting " +
    "and mood. Write as a visual scene, not as dialogue. " +
    "Output ONLY the 1–2 sentence description, no commentary.";
  // ──────────────────────────────────────────────────────────────────────

  // ─── State init ───────────────────────────────────────────────────────
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { commMode: DEFAULT_MODE };
  }
  const state = oc.thread.customData[NAMESPACE];
  // ──────────────────────────────────────────────────────────────────────

  // ─── Re-entrancy lock ─────────────────────────────────────────────────
  // Prevents concurrent handler execution if messages are added rapidly
  // (e.g., during the 5–15 s image generation await).
  let _handling = false;
  // ──────────────────────────────────────────────────────────────────────

  // ─── Reminder helpers ─────────────────────────────────────────────────
  function applyCommMode(mode) {
    state.commMode = mode;
    oc.character.reminderMessage = mode === "f2f" ? REMINDER_F2F : REMINDER_TEXT;
    console.log("[pcbw-commsImg] Communication mode →", mode);
  }
  // ──────────────────────────────────────────────────────────────────────

  // ─── Shortcut button builder ──────────────────────────────────────────
  function buildButtons() {
    const toggleLabel =
      state.commMode === "text" ? "🗣️ Face to Face" : "📱 Text / Call";
    oc.thread.shortcutButtons = [
      {
        name: "🗣️ " + (oc.character.name || "{{char}}"),
        message: "/ai",
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      },
      {
        name: "📸 Scene Image",
        message: "/img-scene",
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      },
      {
        name: "👁️ Char POV",
        message: "/img-pov",
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      },
      {
        name: toggleLabel,
        message: "/toggle-comm",
        insertionType: "replace",
        autoSend: true,
        clearAfterSend: true
      }
    ];
  }
  // ──────────────────────────────────────────────────────────────────────

  // ─── Image generation helpers ─────────────────────────────────────────
  async function extractPrompt(instruction) {
    const recentText = oc.thread.messages
      .filter(m => m.author === "ai" || m.author === "user")
      .slice(-RECENT_MESSAGE_COUNT)
      .map(m => {
        // Strip all HTML tags (including unclosed ones) to get clean plain text
        const plain = (m.content || "")
          .replace(/</g, " ")
          .replace(/>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, MAX_CHARS_PER_MESSAGE);
        return "[" + m.author + "]: " + plain;
      })
      .join("\n\n");

    if (!recentText) return null;

    const extraction = await oc.getInstructCompletion({
      instruction: instruction + "\n\nText:\n" + recentText
    });
    const cleaned = extraction.trim();
    return cleaned.length >= 10 ? cleaned : null;
  }

  async function generateAndInsertImage(rawPrompt, label) {
    const fullPrompt = PROMPT_PREFIX + rawPrompt + PROMPT_SUFFIX;

    // Show a placeholder so the user knows generation is underway
    const placeholder = {
      content:
        "<em style=\"opacity:.65;font-family:sans-serif;font-size:.9em\">" +
        "🖼️ Generating " + label + "…</em>",
      author: "system",
      hiddenFrom: ["ai"],
      expectsReply: false
    };
    oc.thread.messages.push(placeholder);
    const placeholderIdx = oc.thread.messages.length - 1;

    try {
      const imageUrl = await oc.textToImage({ prompt: fullPrompt });
      const imgHtml =
        "<img src=\"" + imageUrl + "\" " +
        "style=\"max-width:100%;border-radius:6px;display:block;margin-top:4px\" " +
        "alt=\"" + label + "\" />";

      if (placeholderIdx >= 0) {
        oc.thread.messages[placeholderIdx].content = imgHtml;
      }
      console.log("[pcbw-commsImg]", label, "generated:", fullPrompt);
    } catch (err) {
      if (placeholderIdx >= 0) {
        oc.thread.messages[placeholderIdx].content =
          "⚠️ Image generation failed (" + label + "). Try again.";
      }
      console.error("[pcbw-commsImg] Image generation error (" + label + "):", err);
    }
  }
  // ──────────────────────────────────────────────────────────────────────

  // ─── Unified MessageAdded handler ────────────────────────────────────
  oc.thread.on("MessageAdded", async function () {
    if (_handling) return;
    _handling = true;
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "user") return;

      const content = (lastMsg.content || "").trim();

      // ── /hidden <text> ──────────────────────────────────────────────
      // Removes the user message and injects an AI-visible, user-hidden
      // system message with expectsReply: false.
      const HIDDEN_CMD = "/hidden ";
      if (content.startsWith(HIDDEN_CMD)) {
        const hiddenText = content.slice(HIDDEN_CMD.length).trim();
        const idx = oc.thread.messages.indexOf(lastMsg);
        if (idx >= 0) oc.thread.messages.splice(idx, 1);

        if (hiddenText) {
          oc.thread.messages.push({
            content: hiddenText,
            author: "system",
            hiddenFrom: ["user"],
            expectsReply: false
          });
          console.log("[pcbw-commsImg] /hidden injected");
        }
        return;
      }

      // ── /img-scene  (mid-action scene image) ────────────────────────
      // Generates a scene image BEFORE the AI's next response.
      // Converts the trigger into "/ai" so the AI still replies after
      // the image is inserted (mid-action, not post-action).
      if (content === "/img-scene") {
        lastMsg.content = AI_TRIGGER;
        try {
          const prompt = await extractPrompt(EXTRACT_INSTRUCTION);
          if (prompt) {
            await generateAndInsertImage(prompt, "scene image");
          }
        } catch (err) {
          console.error("[pcbw-commsImg] /img-scene extraction error:", err);
        }
        return;
      }

      // ── /img-pov  (character POV image, mid-action) ─────────────────
      // Same mid-action timing, but the prompt is built from the
      // character's first-person viewpoint rather than a scene overview.
      if (content === "/img-pov") {
        lastMsg.content = AI_TRIGGER;
        try {
          const prompt = await extractPrompt(POV_INSTRUCTION);
          if (prompt) {
            await generateAndInsertImage(
              "first-person point-of-view photograph, " + prompt,
              "character POV"
            );
          }
        } catch (err) {
          console.error("[pcbw-commsImg] /img-pov extraction error:", err);
        }
        return;
      }

      // ── /toggle-comm  (communication mode toggle) ───────────────────
      // Removes the trigger, flips the communication mode, rewrites
      // the reminder, rebuilds buttons, and notifies the user.
      if (content === "/toggle-comm") {
        const idx = oc.thread.messages.indexOf(lastMsg);
        if (idx >= 0) oc.thread.messages.splice(idx, 1);

        const newMode = state.commMode === "text" ? "f2f" : "text";
        applyCommMode(newMode);
        buildButtons();

        oc.thread.messages.push({
          content: newMode === "text"
            ? "📱 Switched to text / call communication mode."
            : "🗣️ Switched to face-to-face communication mode.",
          author: "system",
          hiddenFrom: ["ai"],
          expectsReply: false
        });
        return;
      }
    } catch (err) {
      console.error("[pcbw-commsImg] Handler error:", err);
    } finally {
      _handling = false;
    }
  });
  // ──────────────────────────────────────────────────────────────────────

  // ─── Init ─────────────────────────────────────────────────────────────
  applyCommMode(state.commMode);
  buildButtons();

  console.log(
    "[pcbw-commsImg] Comms & image controls loaded. " +
    "Mode:", state.commMode,
    "| Shortcuts:", oc.thread.shortcutButtons.map(b => b.name).join(", ")
  );
})();

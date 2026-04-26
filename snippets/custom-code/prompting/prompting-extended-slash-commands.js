/**
 * Snippet: prompting-extended-slash-commands
 *
 * Purpose:
 *   Adds four custom slash commands that extend the standard /ai, /user, /nar,
 *   and /image defaults without interfering with them. Only the four commands
 *   listed below are intercepted; everything else starting with "/" is passed
 *   through to native Perchance handling unchanged.
 *
 *   /hidden <text>
 *     Injects the supplied text as a system message with hiddenFrom:["user"]
 *     and expectsReply:false. The AI sees the note in its context window; the
 *     user never sees it in the chat display. Useful for silent lore drops,
 *     mood nudges, or invisible instruction updates.
 *
 *   /image-now
 *     Generates a scene image MID-ACTION — before the AI writes its next reply —
 *     rather than post-action. Extracts a third-person visual description from
 *     recent context via oc.getInstructCompletion(), calls oc.textToImage(),
 *     and inserts the result into the thread. The AI then responds naturally
 *     to the thread state (expectsReply:true on the image message).
 *
 *   /image-pov
 *     Same flow as /image-now but rewrites the prompt into the AI character's
 *     first-person point of view — what the character sees with their own eyes —
 *     rather than a third-person shot of the scene.
 *
 *   /toggle-comm
 *     Flips oc.character.reminderMessage between "text / call" (remote) and
 *     "face to face" communication modes. Persists the active mode in
 *     oc.thread.customData so it survives page refreshes. Also injects a
 *     hidden AI note so the model knows the mode changed immediately.
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented event), oc.thread.messages
 *   array mutation (documented), oc.getInstructCompletion() (documented LLM
 *   helper), oc.textToImage() (documented image helper), and
 *   oc.character.reminderMessage (documented writable field). Network is
 *   required only for the image and LLM calls; all other logic is offline-safe.
 *
 * Immediate behavior when pasted:
 *   - Applies the persisted communication mode to reminderMessage on load.
 *   - Perchance routes ALL unrecognised "/" messages to the Narrator before
 *     MessageAdded fires; the message arrives with author:"narrator" and its
 *     content is the raw slash-command text the user typed (e.g. "/hidden …").
 *     The handler therefore accepts both author:"user" and author:"narrator"
 *     for messages whose content starts with "/".
 *   - The `{message}` parameter gives a direct reference to the added message
 *     (not `.at(-1)`, which can race). For commands we own, the handler calls
 *     `splice` with that reference to remove it before any async work begins,
 *     preventing the platform from scheduling an AI reply to the raw command text.
 *   - If the command is not in our dispatch table (e.g. /ai, /nar, /user,
 *     /image), the handler returns without touching the message so native
 *     Perchance processing works unchanged.
 *
 * Customization points:
 *   - COMM_REMINDERS: edit the "remote" and "face2face" reminder strings.
 *   - IMAGE_PROMPT_INSTRUCTION: tune the LLM prompt for third-person extraction.
 *   - IMAGE_POV_INSTRUCTION: tune the LLM prompt for first-person POV extraction.
 *   - IMAGE_STYLE_PREFIX / IMAGE_STYLE_SUFFIX: wrap generated prompts in
 *     style keywords (quality boosters, art style, etc.).
 *
 * Caveats:
 *   - oc.textToImage() is rate-limited and slow (5–15 s per call). A temporary
 *     placeholder message is inserted and removed around the call so the user
 *     knows generation is in progress.
 *   - /toggle-comm overwrites oc.character.reminderMessage entirely, and the
 *     persisted mode is also re-applied on every page load. Coordinate with
 *     other snippets that also write to that field — only one owner at a time.
 *   - Command messages are spliced from oc.thread.messages so the AI never
 *     sees raw "/command" text in its context window.
 *   - The image data URL is wrapped in <!--hidden-from-ai-start/end--> so the
 *     model does not receive the raw base64 string in its prompt.
 *
 * Companion file:
 *   extended-slash-commands-shortcuts.txt  — shortcut button definitions for
 *   all four defaults (/ai, /user, /nar, /image) plus the four new commands.
 *   Paste the contents into the Perchance shortcut buttons editor.
 */
(async () => {
  if (window.__pcbw_extSlash_init) return;
  window.__pcbw_extSlash_init = true;

  // ─── Customization Points ────────────────────────────────────────────

  const NAMESPACE = "__pcbw_extSlash";

  /** Reminder text for each communication mode. */
  const COMM_REMINDERS = {
    remote: [
      "Communication mode: TEXT / CALL.",
      "The characters are communicating remotely — via text messages, a phone call,",
      "or a similar digital channel. No shared physical space exists between them.",
      "Do not describe physical presence, touch, or in-person sensory details.",
      "Convey the conversation through text, audio cues, and digital context only.",
    ].join(" "),

    face2face: [
      "Communication mode: FACE TO FACE.",
      "The characters are meeting in person and sharing the same physical space.",
      "Physical presence, body language, facial expressions, environmental details,",
      "and real-time sensory descriptions are all appropriate and encouraged.",
      "Reflect the energy and immediacy of two people occupying the same room.",
    ].join(" "),
  };

  /** LLM instruction for extracting a third-person scene image prompt. */
  const IMAGE_PROMPT_INSTRUCTION =
    "From the conversation below, write a single concise visual scene description " +
    "suitable for an AI image generator. Include: visible characters (appearance, pose, " +
    "expression), setting and environment, mood and lighting, and the key ongoing action. " +
    "Output ONLY the description — 1 to 2 sentences, no extra commentary, no character names.";

  /** LLM instruction for extracting a first-person character-POV image prompt. */
  const IMAGE_POV_INSTRUCTION =
    "From the conversation below, write a first-person point-of-view image prompt that " +
    "describes exactly what the AI character is currently seeing with their own eyes. " +
    "Begin with 'First-person POV, looking at' and include: what occupies the foreground, " +
    "the background environment, mood, and lighting. " +
    "Output ONLY the prompt — 1 to 2 sentences, no extra commentary, no character names.";

  /** Style keywords prepended to every generated image prompt. */
  const IMAGE_STYLE_PREFIX = "detailed digital illustration, ";

  /** Style keywords appended to every generated image prompt. */
  const IMAGE_STYLE_SUFFIX = ", high quality, dramatic lighting, vivid colors";

  /** Maximum characters taken from each message for the LLM context block. */
  const MAX_CONTEXT_CHARS = 400;

  // ─── State Initialization ────────────────────────────────────────────

  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { commMode: "face2face" };
  }
  const state = oc.thread.customData[NAMESPACE];

  // Always apply the persisted communication mode on load so it survives
  // refreshes. This snippet owns reminderMessage when active; coordinate
  // with any other snippet that also writes to that field.
  oc.character.reminderMessage = COMM_REMINDERS[state.commMode] || COMM_REMINDERS.face2face;

  // ─── Internal Helpers ────────────────────────────────────────────────

  /**
   * Push a system message that is hidden from the AI and does not trigger
   * a reply. Used for user-facing confirmations and error feedback.
   */
  function pushUserNote(text) {
    oc.thread.messages.push({
      author:       "system",
      content:      text,
      hiddenFrom:   ["ai"],
      expectsReply: false,
    });
  }

  /**
   * Push a system message that is hidden from the user and does not trigger
   * a reply. Used for silent AI-only context injections.
   */
  function pushAiNote(text) {
    oc.thread.messages.push({
      author:       "system",
      content:      text,
      hiddenFrom:   ["user"],
      expectsReply: false,
    });
  }

  /**
   * Extract plain text from an HTML string using the browser DOM so that
   * all tags and comments are removed without fragile regex patterns.
   * The returned string is safe to pass to an LLM instruction.
   */
  function stripHtmlToText(html) {
    try {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || "";
    } catch (_) {
      // DOM unavailable — return empty string rather than risk incomplete
      // tag stripping in this plain-text extraction helper.
      return "";
    }
  }

  /**
   * Collect up to maxMessages recent messages that are visible to the AI,
   * strip HTML tags, and return a plain-text block for LLM context.
   */
  function buildContextBlock(maxMessages = 6) {
    return oc.thread.messages
      .filter(m => !m.hiddenFrom?.includes("ai"))
      .slice(-maxMessages)
      .map(m => {
        const name = m.name || m.author;
        const body = stripHtmlToText(m.content || "").slice(0, MAX_CONTEXT_CHARS);
        return `${name}: ${body}`;
      })
      .join("\n");
  }

  /**
   * Build a styled image prompt, call oc.textToImage(), and push the
   * resulting image into the thread.
   *
   * The image message is visible to the user via an <img> tag wrapped in
   * <!--hidden-from-ai-start/end--> so the model does not receive the raw
   * base64 data URL. A plain-text description IS pushed as a hidden AI note
   * so the model has context for what appears at this point in the scene.
   * expectsReply is set to true so the AI continues the narrative naturally.
   *
   * @param {string} rawPrompt - scene description from the LLM extraction call
   * @param {string} label     - short label shown in the placeholder, e.g. "🖼️ Scene"
   */
  async function generateAndInsertImage(rawPrompt, label) {
    const styledPrompt = IMAGE_STYLE_PREFIX + rawPrompt.trim() + IMAGE_STYLE_SUFFIX;

    // Record the insertion index so we can remove the placeholder reliably
    // even if the thread has been mutated by the time generation completes.
    const placeholderIdx = oc.thread.messages.length;
    const placeholder = {
      author:       "system",
      content:      `${label} *(generating image — please wait…)*`,
      hiddenFrom:   ["ai"],
      expectsReply: false,
    };
    oc.thread.messages.push(placeholder);

    let dataUrl;
    try {
      const result = await oc.textToImage({ prompt: styledPrompt });
      dataUrl = result.dataUrl;
    } catch (err) {
      console.error("[pcbw-extSlash] Image generation failed:", err);
      placeholder.content = `${label} *(image generation failed — the scene continues without an image)*`;
      return;
    }

    // Validate that oc.textToImage() returned a proper image data URL before
    // embedding it into HTML. Any unexpected value is treated as a failure.
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      console.error("[pcbw-extSlash] Unexpected dataUrl format from oc.textToImage()");
      placeholder.content = `${label} *(image generation returned an unexpected format — continuing without an image)*`;
      return;
    }

    // Remove the placeholder using the stored index first; fall back to
    // indexOf() in case messages were inserted before the placeholder index.
    const removeIdx =
      oc.thread.messages[placeholderIdx] === placeholder
        ? placeholderIdx
        : oc.thread.messages.indexOf(placeholder);
    if (removeIdx >= 0) oc.thread.messages.splice(removeIdx, 1);

    // Insert a hidden AI note with the text description so the model has
    // awareness of what the image represents in the scene.
    pushAiNote(`[A scene image was generated at this point in the story. Description: ${rawPrompt.trim()}]`);

    // Insert the image visible to the user (data URL hidden from AI via the
    // <!--hidden-from-ai--> wrapper so the raw base64 string does not enter
    // the LLM context window). dataUrl is validated above to be a data:image/
    // URL from oc.textToImage(), a trusted platform API.
    // expectsReply:true so the AI continues the scene after this message.
    oc.thread.messages.push({
      author:       "system",
      content:
        `<!--hidden-from-ai-start-->` +
        `<img src="${dataUrl}" alt="Generated scene" ` +
        `style="max-width:100%;border-radius:8px;margin:4px 0 8px;">` +
        `<!--hidden-from-ai-end-->`,
      hiddenFrom:   [],
      expectsReply: true,
    });
  }

  // ─── Command Handlers ────────────────────────────────────────────────

  /**
   * /hidden <text>
   *
   * The command message is already removed by the dispatcher before this
   * handler is called. Injects the supplied text as a system note visible
   * to the AI only (hiddenFrom:["user"], expectsReply:false), and confirms
   * the action to the user via a hidden-from-AI note.
   */
  async function handleHidden(args) {
    const text = args.join(" ").trim();
    if (!text) {
      pushUserNote(
        "❌ /hidden requires text. Usage: /hidden Your secret note here\n" +
        "The note will be visible to the AI but not shown in the chat."
      );
      return;
    }
    pushAiNote(text);
    pushUserNote("🔒 Hidden note injected (visible to the AI only, not shown in chat).");
  }

  /**
   * /image-now
   *
   * The command message is already removed by the dispatcher. Generates a
   * third-person scene image mid-action: extracts a visual description from
   * recent context, generates the image, and inserts it before the AI's
   * next reply so the image appears in the current action flow rather than
   * as a post-action annotation.
   */
  async function handleImageNow() {
    const context = buildContextBlock(6);

    let prompt;
    try {
      prompt = await oc.getInstructCompletion({
        instruction: IMAGE_PROMPT_INSTRUCTION + "\n\nConversation:\n" + context,
      });
    } catch (err) {
      console.error("[pcbw-extSlash] /image-now prompt extraction failed:", err);
      pushUserNote("❌ /image-now: could not extract a scene description. Try again.");
      return;
    }

    await generateAndInsertImage(prompt, "🖼️ Scene");
  }

  /**
   * /image-pov
   *
   * The command message is already removed by the dispatcher. Generates an
   * image from the AI character's first-person point of view: extracts a
   * POV description from recent context, generates the image, and inserts
   * it before the AI's next reply (same mid-action timing as /image-now).
   */
  async function handleImagePov() {
    const context = buildContextBlock(6);

    let prompt;
    try {
      prompt = await oc.getInstructCompletion({
        instruction: IMAGE_POV_INSTRUCTION + "\n\nConversation:\n" + context,
      });
    } catch (err) {
      console.error("[pcbw-extSlash] /image-pov prompt extraction failed:", err);
      pushUserNote("❌ /image-pov: could not extract a POV description. Try again.");
      return;
    }

    await generateAndInsertImage(prompt, "🖼️ POV");
  }

  /**
   * /toggle-comm
   *
   * The command message is already removed by the dispatcher. Toggles
   * oc.character.reminderMessage between "remote" (text / call) and
   * "face2face" (in-person) communication modes. Persists the new mode to
   * oc.thread.customData. Injects a hidden AI note so the model updates its
   * writing style immediately, and confirms the change to the user.
   */
  async function handleToggleComm() {
    const next = state.commMode === "face2face" ? "remote" : "face2face";
    state.commMode = next;
    oc.character.reminderMessage = COMM_REMINDERS[next];

    const label = next === "remote" ? "📱 Text / Call" : "🤝 Face to Face";

    pushAiNote(
      `[Scene context update: the communication mode has just changed to "${label}". ` +
      `Adjust your writing style to reflect this immediately in your next response.]`
    );
    pushUserNote(`🔄 Communication mode → **${label}**`);
    console.log(`[pcbw-extSlash] Communication mode: ${next}`);
  }

  // ─── Command Dispatch ────────────────────────────────────────────────

  const CUSTOM_COMMANDS = {
    "hidden":      handleHidden,
    "image-now":   handleImageNow,
    "image-pov":   handleImagePov,
    "toggle-comm": handleToggleComm,
  };

  oc.thread.on("MessageAdded", async function ({ message }) {
    try {
      const m = message;
      // Perchance routes all unrecognised "/" messages to the Narrator, so the
      // message arrives with author:"narrator" (not "user"). Accept both so that
      // custom commands work regardless of how the platform routes the input.
      if (!m || (m.author !== "user" && m.author !== "narrator")) return;

      const content = (m.content || "").trim();
      if (!content.startsWith("/")) return;

      // Parse: /command-name [optional args...]
      const parts   = content.slice(1).split(/\s+/);
      const cmdName = parts[0].toLowerCase();
      const args    = parts.slice(1);

      // Only intercept commands we own; silently pass everything else through
      // so native Perchance commands (/ai, /nar, /user, /image, etc.) work
      // without interference.
      const handler = CUSTOM_COMMANDS[cmdName];
      if (!handler) return;

      // Remove the command message immediately — before any async work — so the
      // platform cannot schedule an AI reply to the raw command text.
      // Use indexOf+splice with the direct message reference rather than pop()
      // so that removal is reliable even if the message is not the last one.
      const removeIdx = oc.thread.messages.indexOf(m);
      if (removeIdx >= 0) oc.thread.messages.splice(removeIdx, 1);

      await handler(args);
      console.log(`[pcbw-extSlash] Executed: /${cmdName}`);
    } catch (err) {
      console.error("[pcbw-extSlash] Unhandled error:", err);
    }
  });

  console.log(
    "[pcbw-extSlash] Extended slash commands loaded: " +
    "/hidden, /image-now, /image-pov, /toggle-comm"
  );
})();

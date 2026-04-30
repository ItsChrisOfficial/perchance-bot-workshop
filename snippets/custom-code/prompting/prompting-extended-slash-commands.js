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
 *     recent context via oc.getInstructCompletion() and inserts an
 *     <image>prompt</image> tag into the thread. The Perchance text-to-image
 *     plugin renders the tag and exposes quick-regeneration, prompt-editing, and
 *     multi-image generation UI automatically. The AI then responds naturally
 *     to the thread state (expectsReply:true on the image message).
 *
 *   /image-pov [character name]
 *     Same flow as /image-now but rewrites the prompt into the named character's
 *     first-person point of view — what that character sees with their own eyes.
 *     The character name is optional; if omitted the AI character is used.
 *     The name is matched case-insensitively against oc.character.name and
 *     oc.userCharacter.name (100% name-agnostic — no hardcoded names). The
 *     POV holder's own imagePromptTriggers are omitted from the image prompt
 *     (they cannot see themselves), while all other characters' triggers are
 *     included. Example: "/image-pov Dave" renders the scene through Dave's
 *     eyes; "/image-pov Lisa" renders it through Lisa's eyes.
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
 *   helper), oc.character.reminderMessage (documented writable field), and
 *   oc.character.imagePromptTriggers / oc.userCharacter.imagePromptTriggers
 *   (documented string fields for character-specific image appearance keywords).
 *   Images are inserted as <image>prompt</image> tags recognised by the
 *   Perchance text-to-image plugin, which handles rendering and provides
 *   quick-regeneration, prompt-editing, and multi-image generation UI without
 *   any extra code. Network is required only for the LLM context-extraction
 *   call; all other logic is offline-safe.
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
 *   - buildPovInstruction(povName): tune the LLM prompt template for first-person
 *     POV extraction (receives the resolved character's name at call time).
 *   - IMAGE_STYLE_PREFIX / IMAGE_STYLE_SUFFIX: wrap generated prompts in
 *     style keywords (quality boosters, art style, etc.).
 *   - IMAGE_NEGATIVE_PROMPT: comma-separated terms the image generator
 *     should avoid. Rendered as (negativePrompt:::…) inside the <image> tag.
 *
 * Caveats:
 *   - Images are inserted as <image>prompt</image> tags. The Perchance
 *     text-to-image plugin renders the tag and provides quick-regeneration,
 *     prompt-editing, and multi-image generation UI automatically. These
 *     features are NOT available when embedding a raw base64 data URL.
 *   - /image-now uses imagePromptTriggers from both oc.character and
 *     oc.userCharacter (third-person scene — both are visible). /image-pov
 *     resolves a POV character by name, excludes that character's own triggers
 *     (they cannot see themselves), and includes all other characters' triggers.
 *     If no name is supplied, oc.character is used as the default POV holder.
 *     Either field is safely skipped when empty, null, or absent.
 *   - /toggle-comm overwrites oc.character.reminderMessage entirely, and the
 *     persisted mode is also re-applied on every page load. Coordinate with
 *     other snippets that also write to that field — only one owner at a time.
 *   - Command messages are spliced from oc.thread.messages so the AI never
 *     sees raw "/command" text in its context window.
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
    "Output ONLY the description — 1 to 3 paragraphs, no extra commentary, no character names.";

  /**
   * Build a first-person POV LLM instruction for a named character.
   * Parameterizing the name lets the LLM orient itself to the correct
   * perspective regardless of who the user selects. No character names are
   * hardcoded here; the value is resolved at call time.
   *
   * @param {string} povName - display name of the character whose POV to use
   * @returns {string} complete instruction string ready for oc.getInstructCompletion
   */
  function buildPovInstruction(povName) {
    return (
      `From the conversation below, write a first-person point-of-view image prompt ` +
      `describing exactly what ${povName} is currently seeing with their own eyes. ` +
      `Begin with 'First-person POV, looking at' and include: what occupies the foreground, ` +
      `the background environment, mood, and lighting. ` +
      `Output ONLY the prompt — 1 to 3 paragraphs, no extra commentary, no character names.`
    );
  }

  /** Style keywords prepended to every generated image prompt. */
  const IMAGE_STYLE_PREFIX = oc.character.imagePromptPrefix ?? "";

  /** Style keywords appended to every generated image prompt. */
  const IMAGE_STYLE_SUFFIX = oc.character.imagePromptSuffix ?? "";

  /**
   * Negative prompt appended to every generated image inside the
   * (negativePrompt:::) block that the Perchance text-to-image plugin
   * recognises. Add or remove comma-separated terms to steer the image
   * generator away from common artifacts and unwanted styles.
   */
  const IMAGE_NEGATIVE_PROMPT = [
    "low quality", "worst quality", "blurry", "jpeg artifacts",
    "watermark", "text", "logo", "signature", "username",
    "deformed", "bad anatomy", "extra limbs", "disfigured",
    "out of frame", "cropped", "ugly", "error", "duplicate",
  ].join(", ");

  /** Maximum characters taken from each message for the LLM context block. */
  const MAX_CONTEXT_CHARS = 2500;

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
   * Collect imagePromptTriggers from each supplied character object (e.g.
   * oc.character, oc.userCharacter) and return them as a single
   * comma-separated string ready to insert into an image prompt.
   * Entries that are empty, null, or not a string are silently skipped.
   *
   * @param {object[]} characters - character objects to inspect
   * @returns {string} combined triggers, or "" if none are set
   */
  function collectImageTriggers(characters) {
    return characters
      .map(c => (c && typeof c.imagePromptTriggers === "string"
        ? c.imagePromptTriggers.trim()
        : ""))
      .filter(Boolean)
      .join(", ");
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
   * Build a styled image prompt and push an <image>prompt</image> tag into the
   * thread. The Perchance text-to-image plugin renders the tag and exposes
   * quick-regeneration, prompt-editing, and multi-image generation UI
   * automatically — none of which are available when embedding a raw base64
   * data URL.
   *
   * A negative prompt is appended using the (negativePrompt:::…) syntax
   * recognised by the plugin to steer generation away from common artifacts.
   * A plain-text description is also pushed as a hidden AI note so the model
   * has context for what appears at this point in the scene.
   * expectsReply is set to true so the AI continues the narrative naturally.
   *
   * @param {string} rawPrompt    - scene description from the LLM extraction call
   * @param {string} label        - short label used in the AI context note, e.g. "🖼️ Scene"
   * @param {string} [triggers]   - character imagePromptTriggers to append before
   *                                the style suffix (e.g. LoRA trigger words or
   *                                appearance keywords). Pass "" to omit.
   */
  function generateAndInsertImage(rawPrompt, label, triggers = "") {
    const triggerPart = triggers ? `, ${triggers}` : "";
    const styledPrompt = IMAGE_STYLE_PREFIX + rawPrompt.trim() + triggerPart + IMAGE_STYLE_SUFFIX;
    const negPart = IMAGE_NEGATIVE_PROMPT ? ` (negativePrompt::: ${IMAGE_NEGATIVE_PROMPT})` : "";

    // Insert a hidden AI note with the text description so the model has
    // awareness of what the image represents in the scene.
    pushAiNote(`[A scene image was generated at this point in the story. Description: ${rawPrompt.trim()}]`);

    // Use the Perchance text-to-image plugin's native <image> tag so the
    // platform renders the image and provides quick-regeneration,
    // prompt-editing, and multi-image generation UI out of the box.
    // The (negativePrompt:::) block tells the plugin what to avoid.
    // expectsReply:true so the AI continues the scene after this message.
    oc.thread.messages.push({
      author:       "system",
      content:      `<image>${styledPrompt}${negPart}</image>`,
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

    // Append imagePromptTriggers for both characters — third-person scene
    // images typically show both the AI character and the user character.
    const triggers = collectImageTriggers(
      [oc.character, oc.userCharacter].filter(Boolean)
    );
    generateAndInsertImage(prompt, "🖼️ Scene", triggers);
  }

  /**
   * /image-pov [character name]
   *
   * The command message is already removed by the dispatcher. Generates an
   * image from a specific character's first-person point of view.
   *
   * The optional [character name] argument is matched case-insensitively
   * against oc.character.name and oc.userCharacter.name. If omitted (or not
   * matched), oc.character is used as the default POV holder.
   *
   * The POV holder's own imagePromptTriggers are excluded from the image
   * prompt (they cannot see themselves unless reflected). All other known
   * characters' triggers are included as they are visible to the camera.
   *
   * @param {string[]} args - command arguments; first element is character name
   */
  async function handleImagePov(args) {
    // ── Resolve POV character ────────────────────────────────────────────
    const allChars = [oc.character, oc.userCharacter].filter(Boolean);
    const nameArg  = args.join(" ").trim();

    let povChar;
    if (nameArg) {
      const lower = nameArg.toLowerCase();
      povChar = allChars.find(c => c.name && c.name.trim().toLowerCase() === lower);
      if (!povChar) {
        const known = allChars.map(c => c.name || "(unnamed)").join(", ");
        pushUserNote(
          `❌ /image-pov: no character named "${nameArg}" found. ` +
          `Known names: ${known}. ` +
          `Falling back to the AI character's POV.`
        );
        povChar = oc.character;
      }
    } else {
      // No name supplied — default to the AI character (original behaviour).
      povChar = oc.character || allChars[0];
    }

    // ── Build trigger string ─────────────────────────────────────────────
    // The POV holder is the camera: they cannot see themselves, so their own
    // imagePromptTriggers are excluded. All other characters are visible.
    const visibleChars = allChars.filter(c => c !== povChar);
    const triggers = collectImageTriggers(visibleChars);

    // ── Extract POV description from context ────────────────────────────
    const povName   = (povChar.name || "Unknown Character").trim();
    const context   = buildContextBlock(6);
    const instruction = buildPovInstruction(povName);

    let prompt;
    try {
      prompt = await oc.getInstructCompletion({
        instruction: instruction + "\n\nConversation:\n" + context,
      });
    } catch (err) {
      console.error("[pcbw-extSlash] /image-pov prompt extraction failed:", err);
      pushUserNote("❌ /image-pov: could not extract a POV description. Try again.");
      return;
    }

    generateAndInsertImage(prompt, `🖼️ ${povName}'s POV`, triggers);
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

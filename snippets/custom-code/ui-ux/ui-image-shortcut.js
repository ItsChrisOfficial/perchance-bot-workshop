/**
 * Snippet: ui-image-shortcut
 *
 * Purpose:
 *   Standalone snippet that registers four shortcut buttons matching the
 *   Perchance default writing shortcuts plus an image generation button,
 *   and handles the /image slash command.
 *
 *   Shortcut buttons registered:
 *     🗣️ {{char}}   → /ai  <optional writing instruction>
 *     🗣️ {{user}}   → /user <optional writing instruction>
 *     🗣️ Narrator   → /nar  <optional writing instruction>
 *     🖼️ Image      → /image --num=3
 *
 *   /image [--num=N] behaviour:
 *     1. Removes the trigger message from the thread.
 *     2. Calls oc.getInstructCompletion() to extract a scene description
 *        from recent conversation context.  The extraction instruction asks
 *        for the result in <image>…</image> format; the tags are stripped
 *        before the prompt reaches oc.textToImage().
 *     3. Calls oc.textToImage() N times concurrently (default 1, max 6).
 *     4. Inserts all generated images as a single system message hidden
 *        from the AI.  A loading placeholder is shown while generation runs.
 *
 *   The /ai, /user, and /nar commands are handled natively by Perchance;
 *   this snippet only registers the buttons so they appear in the UI.
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented), oc.thread.messages
 *   splice/push (documented), oc.thread.shortcutButtons (documented,
 *   writable), oc.getInstructCompletion() (documented LLM helper), and
 *   oc.textToImage() (documented image API).
 *
 * Immediate behaviour when pasted:
 *   - Four shortcut buttons appear immediately.
 *   - Sending /image (or clicking the 🖼️ Image button) generates images
 *     from the current conversation context and inserts them inline.
 *   - Nothing interferes with /ai, /user, or /nar — Perchance handles those.
 *
 * Customization points:
 *   - DEFAULT_NUM: images generated when --num is not supplied.
 *   - MAX_NUM: ceiling on --num to prevent runaway generation.
 *   - RECENT_MESSAGE_COUNT / MAX_CHARS_PER_MESSAGE: context window size.
 *   - PROMPT_SUFFIX: appended to every image prompt for style/quality.
 *   - EXTRACT_INSTRUCTION: LLM prompt used to derive the image description.
 *
 * Caveats:
 *   - Owns oc.thread.shortcutButtons — coordinate with other snippets that
 *     also write shortcutButtons (only one should own the array).
 *   - oc.textToImage() adds 5–15 s latency per image and is rate-limited.
 *   - oc.getInstructCompletion() requires a network connection.
 *   - See ui-image-shortcut.txt for the companion shortcut-button text
 *     definitions (paste into the Perchance bot's shortcut buttons field).
 */
(async () => {
  if (window.__pcbw_imgShortcut_init) return;
  window.__pcbw_imgShortcut_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE             = "__pcbw_imgShortcut";
  const DEFAULT_NUM           = 1;   // images when --num is omitted
  const MAX_NUM               = 6;   // hard ceiling for --num
  const RECENT_MESSAGE_COUNT  = 6;   // messages included in extraction context
  const MAX_CHARS_PER_MESSAGE = 400; // characters per message in context

  const PROMPT_SUFFIX = ", high quality, vivid colors, dramatic lighting";

  const IMG_STYLE =
    "max-width:100%;border-radius:6px;display:block;" +
    "margin:4px 0;box-shadow:0 2px 8px rgba(0,0,0,.25)";

  const EXTRACT_INSTRUCTION =
    "From the following roleplay excerpt, generate a visual image description " +
    "that covers: the key action taking place, the setting and environment, " +
    "the clothing and appearance of every character present, fine visual details, " +
    "and the perspective or point of view of the scene. " +
    "Write between 1 and 3 verbose, descriptive paragraphs. " +
    "Your response MUST follow this exact format:\n" +
    "<image> 1-3 verbose paragraphs about the action, setting, clothing, " +
    "appearance, details, and perspective/point of view of the image</image>\n" +
    "Output ONLY the wrapped description. No commentary, no extra text.";
  // ─────────────────────────────────────────────────────────────────────

  // ─── Shortcut buttons ────────────────────────────────────────────────
  function buildButtons() {
    oc.thread.shortcutButtons = [
      {
        name: "🗣️ " + (oc.character.name || "{{char}}"),
        message: "/ai ",
        insertionType: "replace",
        autoSend: false,
        clearAfterSend: false
      },
      {
        name: "🗣️ {{user}}",
        message: "/user ",
        insertionType: "replace",
        autoSend: false,
        clearAfterSend: false
      },
      {
        name: "🗣️ Narrator",
        message: "/nar ",
        insertionType: "replace",
        autoSend: false,
        clearAfterSend: false
      },
      {
        name: "🖼️ Image",
        message: "/image --num=3",
        insertionType: "replace",
        autoSend: false,
        clearAfterSend: false
      }
    ];
  }
  // ─────────────────────────────────────────────────────────────────────

  // ─── Helpers ─────────────────────────────────────────────────────────
  function parseNum(content) {
    const m = content.match(/--num=(\d+)/);
    if (!m) return DEFAULT_NUM;
    return Math.min(Math.max(1, parseInt(m[1], 10)), MAX_NUM);
  }

  function buildContext() {
    return oc.thread.messages
      .filter(m => m.author === "ai" || m.author === "user")
      .slice(-RECENT_MESSAGE_COUNT)
      .map(m => {
        const plain = (m.content || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, MAX_CHARS_PER_MESSAGE);
        return "[" + m.author + "]: " + plain;
      })
      .join("\n\n");
  }

  async function extractPrompt() {
    const context = buildContext();
    if (!context) return null;
    const raw = await oc.getInstructCompletion({
      instruction: EXTRACT_INSTRUCTION + "\n\nText:\n" + context
    });
    const tagMatch = raw.trim().match(/<image>([\s\S]*?)<\/image>/i);
    const cleaned = tagMatch ? tagMatch[1].trim() : raw.trim();
    return cleaned.length >= 10 ? cleaned : null;
  }

  async function generateImages(num) {
    const label = num === 1 ? "image" : num + " images";
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
      const prompt = await extractPrompt();
      if (!prompt) {
        oc.thread.messages[placeholderIdx].content =
          "⚠️ Could not extract an image description from the conversation.";
        return;
      }

      const fullPrompt = prompt + PROMPT_SUFFIX;
      const urls = await Promise.all(
        Array.from({ length: num }, () => oc.textToImage({ prompt: fullPrompt }))
      );

      oc.thread.messages[placeholderIdx].content = urls
        .map(url =>
          "<img src=\"" + url + "\" " +
          "style=\"" + IMG_STYLE + "\" " +
          "alt=\"Generated scene\" />"
        )
        .join("\n");

      console.log("[pcbw-imgShortcut] Generated", num, "image(s).");
    } catch (err) {
      oc.thread.messages[placeholderIdx].content =
        "⚠️ Image generation failed. Please try again.";
      console.error("[pcbw-imgShortcut] Generation error:", err);
    }
  }
  // ─────────────────────────────────────────────────────────────────────

  // ─── MessageAdded handler ────────────────────────────────────────────
  let _handling = false;
  oc.thread.on("MessageAdded", async function () {
    if (_handling) return;
    _handling = true;
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "user") return;

      const content = (lastMsg.content || "").trim();
      if (!content.startsWith("/image")) return;

      // Remove the trigger message
      const idx = oc.thread.messages.indexOf(lastMsg);
      if (idx >= 0) oc.thread.messages.splice(idx, 1);

      const num = parseNum(content);
      await generateImages(num);
    } catch (err) {
      console.error("[pcbw-imgShortcut] Handler error:", err);
    } finally {
      _handling = false;
    }
  });
  // ─────────────────────────────────────────────────────────────────────

  // ─── Init ────────────────────────────────────────────────────────────
  buildButtons();
  console.log(
    "[pcbw-imgShortcut] Image shortcut loaded. Buttons:",
    oc.thread.shortcutButtons.map(b => b.name).join(", ")
  );
})();

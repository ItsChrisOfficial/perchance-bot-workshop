/**
 * Snippet: ai-response-image-tag-renderer
 *
 * Purpose:
 *   Watches every AI message for <image>…</image> blocks embedded by the
 *   character in its response. For each block found the inner text is used
 *   as a text-to-image prompt, a loading placeholder replaces the tag while
 *   generation runs, and the placeholder is swapped for a rendered <img>
 *   when the image is ready. Multiple <image> blocks in one message are
 *   processed concurrently.
 *
 * Expected AI output format (see companion .txt roleInstruction addon):
 *   <image> 1-3 verbose paragraphs about the action, setting, clothing,
 *   appearance, details, and perspective/point of view of the image</image>
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented), message content
 *   mutation (documented), and oc.textToImage() (documented image API).
 *   State guard on per-message customData prevents double-processing on
 *   re-renders or re-fires.
 *
 * Immediate behavior when pasted:
 *   - Replaces <image>…</image> in every AI message with a loading
 *     placeholder, then a live <img> once oc.textToImage() resolves.
 *   - Multiple blocks per message are processed in parallel.
 *   - Errors surface as an inline ⚠️ notice (never silently swallowed).
 *   - Nothing happens if no <image> tags are present.
 *
 * Customization points:
 *   - PROMPT_PREFIX / PROMPT_SUFFIX: strings prepended/appended to the
 *     extracted description before calling oc.textToImage().
 *   - IMG_STYLE: inline CSS applied to every generated <img> element.
 *
 * Caveats:
 *   - oc.textToImage() adds 5–15 s latency per call and is rate-limited.
 *   - Image generation requires a network connection.
 *   - Only processes messages whose author is "ai"; user/system messages
 *     are ignored.
 *   - If the AI omits the closing </image> tag the block will not match
 *     and nothing is rendered — instruct the AI to always close the tag.
 */
(async () => {
  if (window.__pcbw_imgTagRenderer_init) return;
  window.__pcbw_imgTagRenderer_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE   = "__pcbw_imgTagRenderer";
  const PROMPT_PREFIX = "";
  const PROMPT_SUFFIX = ", high quality, vivid colors, dramatic lighting";

  const IMG_STYLE =
    "max-width:100%;border-radius:6px;display:block;" +
    "margin:6px 0;box-shadow:0 2px 8px rgba(0,0,0,.25)";

  // Regex: matches <image> … </image> (case-insensitive, content may span lines)
  const IMAGE_TAG_RE = /<image>([\s\S]*?)<\/image>/gi;
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Build a stable placeholder token so we can swap it after generation
   * without touching other parts of the message content.
   */
  function placeholderToken(index) {
    return (
      `<span id="${NAMESPACE}-placeholder-${index}" ` +
      `style="display:inline-block;padding:4px 8px;border-radius:4px;` +
      `font-size:.85em;font-family:sans-serif;opacity:.65;">` +
      `🖼️ Generating image…</span>`
    );
  }

  /**
   * Replace a placeholder token with a finished <img> or error notice.
   */
  function swapPlaceholder(message, index, html) {
    const id = `${NAMESPACE}-placeholder-${index}`;
    // Build a self-closing replacement: swap the span by its id attribute
    message.content = message.content.replace(
      new RegExp(`<span id="${id}"[^>]*>[\\s\\S]*?</span>`),
      html
    );
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Guard: skip if already processed
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      const raw = lastMsg.content || "";
      if (!IMAGE_TAG_RE.test(raw)) return;

      // Mark as processed immediately to prevent double-runs
      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { at: new Date().toISOString() };

      // Collect all matches before replacing (reset lastIndex after .test())
      IMAGE_TAG_RE.lastIndex = 0;
      const matches = [];
      let m;
      while ((m = IMAGE_TAG_RE.exec(raw)) !== null) {
        matches.push({ full: m[0], description: m[1].trim(), index: matches.length });
      }

      if (!matches.length) return;

      // Step 1: replace every <image>…</image> block with a loading placeholder
      let replaced = raw;
      for (const match of matches) {
        replaced = replaced.replace(match.full, placeholderToken(match.index));
      }
      lastMsg.content = replaced;

      // Step 2: generate all images concurrently then swap placeholders
      await Promise.all(
        matches.map(async (match) => {
          const prompt = PROMPT_PREFIX + match.description + PROMPT_SUFFIX;
          try {
            const url = await oc.textToImage({ prompt });
            const imgHtml =
              `<img src="${url}" alt="Generated scene" style="${IMG_STYLE}" />`;
            swapPlaceholder(lastMsg, match.index, imgHtml);
            console.log(
              `[pcbw-imgTagRenderer] Image ${match.index + 1}/${matches.length} generated.`
            );
          } catch (err) {
            swapPlaceholder(
              lastMsg,
              match.index,
              `<span style="color:#c00;font-size:.85em;font-family:sans-serif;">` +
              `⚠️ Image generation failed — try again.</span>`
            );
            console.error(
              `[pcbw-imgTagRenderer] Error generating image ${match.index}:`, err
            );
          }
        })
      );
    } catch (err) {
      console.error("[pcbw-imgTagRenderer] Handler error:", err);
    }
  });

  console.log("[pcbw-imgTagRenderer] Image tag renderer loaded.");
})();

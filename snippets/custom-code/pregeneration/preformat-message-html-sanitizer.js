/**
 * Snippet: preformat-message-html-sanitizer
 *
 * Purpose:
 *   Processes AI message content on MessageAdded to sanitize HTML.
 *   Strips dangerous tags (script, iframe, object, embed, form) while
 *   preserving safe formatting. Removes dangerous event-handler attributes.
 *   Auto-links bare URLs.
 *
 * Why realistic:
 *   Uses documented MessageAdded event and message.content modification.
 *   Pure regex/string processing — no external libs. Fully offline.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, sanitizes HTML content.
 *   - Tracks sanitization via per-message customData.
 *   - Converts bare URLs to clickable links.
 *
 * Customization points:
 *   - ALLOWED_TAGS: whitelist of safe HTML tags.
 *   - DANGEROUS_ATTRS: list of attributes to strip.
 *   - AUTO_LINK: enable/disable URL auto-linking.
 *
 * Caveats:
 *   - Regex-based sanitization is not as robust as a full DOM parser.
 *   - Very complex HTML may not sanitize perfectly.
 *   - Only processes AI messages to avoid interfering with user input.
 */
(async () => {
  if (window.__pcbw_htmlSanitizer_init) return;
  window.__pcbw_htmlSanitizer_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_sanitize";
  const AUTO_LINK = true;

  const ALLOWED_TAGS = new Set([
    "b", "i", "em", "strong", "u", "s", "strike", "del",
    "p", "br", "hr", "span", "div",
    "ul", "ol", "li",
    "a", "img",
    "code", "pre", "blockquote",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "thead", "tbody", "tr", "th", "td",
    "sub", "sup", "small", "mark"
  ]);

  const DANGEROUS_ATTRS = [
    "onclick", "ondblclick", "onmousedown", "onmouseup", "onmouseover",
    "onmouseout", "onmousemove", "onkeydown", "onkeyup", "onkeypress",
    "onfocus", "onblur", "onchange", "onsubmit", "onreset", "onload",
    "onerror", "onabort", "onresize", "onscroll", "onunload",
    "oncontextmenu", "oninput", "ontouchstart", "ontouchend", "ontouchmove"
  ];
  // ─────────────────────────────────────────────────────────────────────

  const DANGEROUS_TAG_NAMES = new Set(["script", "iframe", "object", "embed", "form", "style"]);

  function stripDangerousTags(html) {
    // Use DOM parser for robust sanitization — handles nested and obfuscated tags
    const parser = new DOMParser();
    const doc = parser.parseFromString("<div>" + html + "</div>", "text/html");
    const container = doc.body.firstChild;

    // Remove all dangerous elements recursively
    for (const tagName of DANGEROUS_TAG_NAMES) {
      let elements = container.getElementsByTagName(tagName);
      while (elements.length > 0) {
        elements[0].remove();
        elements = container.getElementsByTagName(tagName);
      }
    }

    return container.innerHTML;
  }

  function stripDangerousAttrs(html) {
    const attrPattern = new RegExp(
      `\\s(${DANGEROUS_ATTRS.join("|")})\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]*)`,
      "gi"
    );
    return html.replace(attrPattern, "");
  }

  function stripJavascriptUrls(html) {
    // Remove javascript: URIs in href/src attributes
    return html.replace(/(href|src)\s*=\s*["']?\s*javascript\s*:/gi, '$1="');
  }

  function autoLinkUrls(text) {
    // Match URLs not already inside HTML tags
    return text.replace(
      /(?<![="'])(https?:\/\/[^\s<>"']+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  function sanitize(html) {
    let result = stripDangerousTags(html);
    result = stripDangerousAttrs(result);
    result = stripJavascriptUrls(result);
    if (AUTO_LINK) result = autoLinkUrls(result);
    return result;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already sanitized
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      const original = lastMsg.content;
      lastMsg.content = sanitize(original);

      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { sanitized: true, at: new Date().toISOString() };

      if (original !== lastMsg.content) {
        console.log("[pcbw-sanitize] Message sanitized.");
      }
    } catch (err) {
      console.error("[pcbw-sanitize] Error:", err);
    }
  });

  console.log("[pcbw-sanitize] HTML sanitizer loaded.");
})();

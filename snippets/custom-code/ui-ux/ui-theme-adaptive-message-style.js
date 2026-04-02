/**
 * Snippet: ui-theme-adaptive-message-style
 *
 * Purpose:
 *   Applies theme-aware CSS styling to messages via MessageAdded handler.
 *   Supports different styles per author type (ai, user, system).
 *   Uses light-dark() for automatic dark/light mode adaptation.
 *
 * Why realistic:
 *   Uses documented message.wrapperStyle property and MessageAdded event.
 *   No frameworks, pure CSS applied per-message. Fully offline.
 *
 * Immediate behavior when pasted:
 *   - On every new message, applies per-author CSS via wrapperStyle.
 *   - AI messages get accent styling; user/system get different treatment.
 *
 * Customization points:
 *   - STYLES: per-author CSS strings.
 *   - COMMON_STYLE: CSS applied to all messages regardless of author.
 *
 * Caveats:
 *   - Appends to existing wrapperStyle; may conflict with other snippets
 *     that also set wrapperStyle.
 */
(async () => {
  if (window.__pcbw_themeStyle_init) return;
  window.__pcbw_themeStyle_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const COMMON_STYLE = "font-family: 'Georgia', serif; line-height: 1.65;";

  const STYLES = {
    ai: [
      "border-left: 3px solid light-dark(#5C6BC0, #7986CB);",
      "padding-left: 10px;",
      "color: light-dark(#263238, #CFD8DC);",
      "background: light-dark(rgba(92,107,192,.06), rgba(121,134,203,.08));",
      "border-radius: 0 6px 6px 0;"
    ].join(" "),

    user: [
      "border-left: 3px solid light-dark(#66BB6A, #388E3C);",
      "padding-left: 10px;",
      "color: light-dark(#1B5E20, #A5D6A7);",
      "background: light-dark(rgba(102,187,106,.06), rgba(56,142,60,.08));",
      "border-radius: 0 6px 6px 0;"
    ].join(" "),

    system: [
      "border-left: 3px solid light-dark(#BDBDBD, #616161);",
      "padding-left: 10px;",
      "color: light-dark(#616161, #9E9E9E);",
      "font-style: italic;",
      "font-size: 0.92em;"
    ].join(" ")
  };
  // ─────────────────────────────────────────────────────────────────────

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg) return;

      const authorStyle = STYLES[lastMsg.author] || "";
      const combined = COMMON_STYLE + " " + authorStyle;
      lastMsg.wrapperStyle = (lastMsg.wrapperStyle || "") + combined;
    } catch (err) {
      console.error("[pcbw-themeStyle] Error:", err);
    }
  });

  console.log("[pcbw-themeStyle] Theme-adaptive message styling loaded.");
})();

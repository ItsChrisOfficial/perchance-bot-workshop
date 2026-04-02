# Styling Recipes

Practical, copy-ready CSS recipes for Perchance AI Character Chat `messageWrapperStyle`, iframe UI panels, and customCode-driven styling.

Every recipe is tested against the `light-dark()` CSS function that Perchance supports for theme awareness.

---

## How to use this document

1. Find a recipe that matches the visual feel you want.
2. Copy the CSS/style string into the appropriate location:
   - **Message styles** → `messageWrapperStyle` field in the character row, or set at runtime via `msg.wrapperStyle`
   - **Iframe UI panels** → `document.body.innerHTML` style blocks inside customCode
   - **Per-message overrides** → `wrapperStyle` property on individual message objects
3. Adjust colors using `light-dark(lightValue, darkValue)` to stay theme-safe.
4. Test in both light and dark modes before shipping.

**Related docs:**
- `docs/EXPORT_FIELD_REFERENCE.md` — field locations for `messageWrapperStyle` and `wrapperStyle`
- `docs/COMMON_FAILURE_MODES.md` — FM-14 (wrapperStyle conflicts), FM-18 (CSS theme clashes)
- `snippets/custom-code/ui-ux/ui-theme-adaptive-message-style.js` — programmatic per-author styling

---

## Message Wrapper Style Recipes

### Recipe 1: Clean Minimal

**Vibe:** Quiet, professional, no distractions.  
**Where to apply:** `messageWrapperStyle` on character row or `msg.wrapperStyle`.  
```css
font-family: system-ui, -apple-system, sans-serif;
font-size: 0.95rem;
line-height: 1.6;
color: light-dark(#2d2d2d, #d4d4d4);
```
**Caveats:** Very plain — may feel sterile for roleplay bots. Best for utility/assistant bots.

### Recipe 2: Soft Parchment

**Vibe:** Warm, book-like, cozy for narrative bots.  
**Where to apply:** `messageWrapperStyle`.  
```css
font-family: 'Georgia', 'Times New Roman', serif;
color: light-dark(#3b2f2f, #d5cfc4);
background: light-dark(rgba(245, 235, 220, 0.3), rgba(60, 50, 40, 0.3));
border-left: 3px solid light-dark(#c4a77d, #8a7050);
padding: 0.6rem 1rem;
border-radius: 4px;
```
**Caveats:** Serif fonts render differently across browsers. Test on mobile.

### Recipe 3: Dark Noir

**Vibe:** Moody, dramatic, suited to thriller/mystery bots.  
**Where to apply:** `messageWrapperStyle`.  
```css
font-family: 'Courier New', monospace;
color: light-dark(#1a1a2e, #c8c8e0);
background: light-dark(rgba(26, 26, 46, 0.08), rgba(200, 200, 224, 0.06));
border: 1px solid light-dark(rgba(26, 26, 46, 0.2), rgba(200, 200, 224, 0.15));
padding: 0.5rem 0.8rem;
border-radius: 2px;
letter-spacing: 0.02em;
```
**Caveats:** Monospace fonts increase line width — may cause horizontal scroll on narrow mobile screens.

### Recipe 4: Neon Accent

**Vibe:** Cyberpunk, sci-fi, high-tech feel.  
**Where to apply:** `messageWrapperStyle`.  
```css
font-family: 'Segoe UI', system-ui, sans-serif;
color: light-dark(#0d1117, #e0e0ff);
border-left: 3px solid light-dark(#6366f1, #818cf8);
background: light-dark(rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.08));
padding: 0.5rem 1rem;
border-radius: 6px;
```
**Caveats:** Bright accent colors can be tiring in long conversations. Consider a muted variant for long-session bots.

### Recipe 5: Nature / Earthy

**Vibe:** Calm, grounded, outdoors/nature theme.  
**Where to apply:** `messageWrapperStyle`.  
```css
font-family: system-ui, sans-serif;
color: light-dark(#2d3b2d, #c8d8c8);
background: light-dark(rgba(76, 120, 76, 0.06), rgba(120, 180, 120, 0.06));
border-left: 3px solid light-dark(#5a8f5a, #6aaa6a);
padding: 0.5rem 1rem;
border-radius: 4px;
```
**Caveats:** Green tones can look muddy on low-contrast displays. Test on cheap monitors/phones.

### Recipe 6: System Message — Subtle

**Vibe:** Non-intrusive system notices that don't compete with conversation.  
**Where to apply:** `wrapperStyle` on system message objects.  
```css
font-size: 0.82rem;
font-style: italic;
color: light-dark(#888, #777);
text-align: center;
padding: 0.3rem 0;
opacity: 0.8;
```
**Caveats:** Very small text may be hard to read for accessibility-sensitive users.

### Recipe 7: AI Highlight — Soft Glow

**Vibe:** Subtly distinguish AI messages from user messages.  
**Where to apply:** `wrapperStyle` on AI messages only (set in `MessageAdded` handler).  
```css
background: light-dark(rgba(59, 130, 246, 0.04), rgba(96, 165, 250, 0.06));
border-radius: 8px;
padding: 0.6rem 1rem;
```
**Caveats:** If combined with `ui-theme-adaptive-message-style.js`, only one should set `wrapperStyle`. See FM-14.

### Recipe 8: User Message — Outlined

**Vibe:** Give user messages a distinct bordered look without color fill.  
**Where to apply:** `wrapperStyle` on user messages.  
```css
border: 1px solid light-dark(#ddd, #444);
border-radius: 12px;
padding: 0.5rem 1rem;
margin: 0.2rem 0;
```
**Caveats:** Borders add visual weight — don't combine with Recipe 7's background on the same message.

### Recipe 9: Roleplay Action Emphasis

**Vibe:** Make *action text* stand out with italic weight and muted color.  
**Where to apply:** `messageWrapperStyle` for roleplay-heavy bots.  
```css
font-family: 'Georgia', serif;
line-height: 1.7;
color: light-dark(#333, #ccc);
```
Combine with `preformat-roleplay-layout-normalizer.js` which wraps `*action*` text in `<em>` tags, then add:
```css
em { color: light-dark(#666, #999); }
```
**Caveats:** Only works if the normalizer snippet processes messages first. Load order matters.

### Recipe 10: Compact Utility

**Vibe:** Dense, information-first, minimal visual chrome. Good for helper/tool bots.  
**Where to apply:** `messageWrapperStyle`.  
```css
font-family: system-ui, sans-serif;
font-size: 0.88rem;
line-height: 1.5;
color: light-dark(#333, #ccc);
padding: 0.3rem 0;
```
**Caveats:** May feel cramped for long narrative responses. Better for short Q&A bots.

---

## Panel & Iframe UI Styling Recipes

### Recipe 11: Floating Panel — Glass Effect

**Vibe:** Modern frosted-glass look for floating panels.  
**Where to apply:** CSS inside `document.body.innerHTML` in customCode, targeting the panel created by `ui-floating-panel-shell.js`.  
```css
.pcbw-floating-panel {
  background: light-dark(rgba(255, 255, 255, 0.85), rgba(30, 30, 30, 0.85));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  box-shadow: 0 4px 24px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.3));
  padding: 1rem;
  color: light-dark(#222, #e0e0e0);
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
}
```
**Caveats:** `backdrop-filter` not supported in all browsers. Falls back to solid background gracefully.

### Recipe 12: Side Panel — Dark Sidebar

**Vibe:** IDE-like dark sidebar for settings or debug info.  
**Where to apply:** CSS for `ui-slideout-side-panel.js` panel element.  
```css
.pcbw-side-panel {
  background: light-dark(#f5f5f5, #1e1e1e);
  border-left: 1px solid light-dark(#ddd, #333);
  color: light-dark(#333, #d4d4d4);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 0.8rem;
}
```
**Caveats:** Monospace font uses more horizontal space. Set `overflow-x: auto` on content area.

### Recipe 13: Bottom Drawer — Soft Sheet

**Vibe:** iOS-style bottom sheet with rounded top corners.  
**Where to apply:** CSS for `ui-bottom-drawer.js` element.  
```css
.pcbw-bottom-drawer {
  background: light-dark(#ffffff, #1a1a1a);
  border-top: 1px solid light-dark(#e0e0e0, #333);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 16px light-dark(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.25));
  padding: 1rem 1rem 2rem;
  color: light-dark(#222, #ddd);
  font-family: system-ui, sans-serif;
}
.pcbw-bottom-drawer .pcbw-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: light-dark(#ccc, #555);
  margin: 0 auto 0.8rem;
}
```
**Caveats:** Padding at bottom prevents content from being hidden behind phone navigation bars.

### Recipe 14: Modal Overlay — Centered Card

**Vibe:** Clean modal card with dimmed backdrop.  
**Where to apply:** CSS for `ui-modal-dialog-shell.js`.  
```css
.pcbw-modal-overlay {
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pcbw-modal-card {
  background: light-dark(#fff, #242424);
  border: 1px solid light-dark(#e0e0e0, #3a3a3a);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  color: light-dark(#222, #e0e0e0);
  font-family: system-ui, sans-serif;
}
```
**Caveats:** Use `width: 90%` with `max-width` for mobile responsiveness. Don't use fixed pixel widths.

### Recipe 15: Toolbar — Minimal Icon Strip

**Vibe:** Thin horizontal toolbar for quick-action buttons.  
**Where to apply:** CSS for `ui-toolbar-button-cluster.js`.  
```css
.pcbw-toolbar {
  display: flex;
  gap: 0.4rem;
  padding: 0.3rem 0.5rem;
  background: light-dark(rgba(245, 245, 245, 0.9), rgba(30, 30, 30, 0.9));
  border-radius: 8px;
  border: 1px solid light-dark(#e0e0e0, #3a3a3a);
}
.pcbw-toolbar button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  color: light-dark(#555, #aaa);
  font-size: 1.1rem;
  transition: background 0.15s;
}
.pcbw-toolbar button:hover {
  background: light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.08));
}
```
**Caveats:** Emoji-based icons are cross-platform but may render differently. Test on Windows/Mac/mobile.

---

## Debug & Development UI Recipes

### Recipe 16: Debug Console — Terminal Look

**Vibe:** Developer-facing terminal console for `ui-debug-console-panel.js`.  
**Where to apply:** CSS in customCode iframe.  
```css
.pcbw-debug-console {
  background: light-dark(#1e1e1e, #0d0d0d);
  color: light-dark(#4ec9b0, #4ec9b0);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  padding: 0.6rem;
  overflow-y: auto;
  max-height: 300px;
  border: 1px solid light-dark(#333, #222);
  border-radius: 4px;
}
.pcbw-debug-console .pcbw-log-error {
  color: #f44747;
}
.pcbw-debug-console .pcbw-log-warn {
  color: #cca700;
}
.pcbw-debug-console .pcbw-log-info {
  color: light-dark(#4ec9b0, #6abfb0);
}
```
**Caveats:** Always dark background regardless of theme — terminal convention. Use scrollable container to avoid layout overflow.

### Recipe 17: State Inspector — Key-Value Table

**Vibe:** Quick-glance state debugging panel showing customData contents.  
**Where to apply:** CSS for a debug panel showing `oc.thread.customData`.  
```css
.pcbw-state-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Consolas', monospace;
  font-size: 0.8rem;
}
.pcbw-state-table th {
  text-align: left;
  padding: 0.3rem 0.5rem;
  border-bottom: 2px solid light-dark(#ddd, #444);
  color: light-dark(#666, #999);
  font-weight: 600;
}
.pcbw-state-table td {
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid light-dark(#eee, #333);
  color: light-dark(#333, #ccc);
}
.pcbw-state-table td:first-child {
  color: light-dark(#0066cc, #6699ff);
  white-space: nowrap;
}
```
**Caveats:** Long values will stretch the table. Add `word-break: break-all` on value cells for safety.

---

## CSS Filter Recipes

### Recipe 18: Scene Background — Moody Filter

**Vibe:** Apply atmospheric filter to scene background image for mood.  
**Where to apply:** Set via `oc.character.scene.background` CSS or runtime style manipulation in customCode.  
```css
filter: brightness(0.7) contrast(1.1) saturate(0.8);
```
Use cases:
- Night scene: `filter: brightness(0.4) contrast(1.2) saturate(0.6);`
- Dream/fantasy: `filter: brightness(1.1) contrast(0.9) saturate(1.3) hue-rotate(15deg);`
- Noir: `filter: grayscale(0.6) contrast(1.3) brightness(0.8);`

**Caveats:** CSS filters on backgrounds can affect performance on mobile. `transforms-scene-transition-engine.js` supports filter changes per scene — coordinate there.

### Recipe 19: Avatar Filter — Emotion Tint

**Vibe:** Tint avatar image to reflect character mood without changing the image file.  
**Where to apply:** Runtime style on avatar image element, used alongside `transforms-avatar-expression-router.js`.  
```css
/* Angry */
filter: saturate(1.4) hue-rotate(-10deg) brightness(0.9);

/* Sad */
filter: saturate(0.5) brightness(0.85);

/* Happy */
filter: saturate(1.2) brightness(1.1);

/* Neutral */
filter: none;
```
**Caveats:** Better to use different avatar images if available. Filters are a fallback when only one image exists.

---

## Toast & Notification Recipes

### Recipe 20: Toast — Success / Warning / Error

**Vibe:** Contextual toast notifications for `ui-toast-notifications.js`.  
**Where to apply:** CSS classes added to toast elements.  
```css
.pcbw-toast {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  max-width: 320px;
}
.pcbw-toast-success {
  background: light-dark(#ecfdf5, #064e3b);
  color: light-dark(#065f46, #a7f3d0);
  border-left: 3px solid light-dark(#10b981, #34d399);
}
.pcbw-toast-warning {
  background: light-dark(#fffbeb, #78350f);
  color: light-dark(#92400e, #fde68a);
  border-left: 3px solid light-dark(#f59e0b, #fbbf24);
}
.pcbw-toast-error {
  background: light-dark(#fef2f2, #7f1d1d);
  color: light-dark(#991b1b, #fca5a5);
  border-left: 3px solid light-dark(#ef4444, #f87171);
}
```
**Caveats:** Keep toast messages short (1–2 lines). Long text breaks the visual pattern.

### Recipe 21: Progress Bar — Themed

**Vibe:** Loading indicator for `ui-progress-bar.js` during Pyodide load or asset prewarming.  
**Where to apply:** CSS for progress bar element.  
```css
.pcbw-progress-track {
  width: 100%;
  height: 6px;
  background: light-dark(#e5e7eb, #374151);
  border-radius: 3px;
  overflow: hidden;
}
.pcbw-progress-fill {
  height: 100%;
  background: light-dark(#3b82f6, #60a5fa);
  border-radius: 3px;
  transition: width 0.3s ease;
}
```
**Caveats:** Transition duration should be shorter than the update interval to avoid visual lag.

### Recipe 22: Tabbed Panel — Underline Tabs

**Vibe:** Simple underlined tab navigation for `ui-tabbed-panel.js`.  
**Where to apply:** CSS for tab container.  
```css
.pcbw-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid light-dark(#e0e0e0, #3a3a3a);
}
.pcbw-tab {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  background: none;
  color: light-dark(#666, #999);
  font-size: 0.85rem;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.pcbw-tab:hover {
  color: light-dark(#333, #ddd);
}
.pcbw-tab.active {
  color: light-dark(#111, #fff);
  border-bottom-color: light-dark(#3b82f6, #60a5fa);
}
```
**Caveats:** Keep tab labels short. More than 5 tabs should use a scrollable container.

---

## Styling Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Hardcoded `color: #333` without `light-dark()` | Invisible text in dark mode | Always use `light-dark(lightVal, darkVal)` |
| Fixed `width: 400px` on panels | Breaks on mobile screens | Use `max-width: 400px; width: 90%` |
| `!important` on every property | Makes composition impossible; other snippets can't override | Use specificity or scoped class names instead |
| Inline styles on every message in a loop | Performance drag; hard to maintain | Set `messageWrapperStyle` once or use CSS classes |
| Setting `body` styles in iframe | Conflicts with Perchance host styling | Scope all styles under `pcbw-` prefixed classes |
| Using `vh`/`vw` units in iframe | Iframe viewport ≠ page viewport; unexpected sizing | Use `%`, `rem`, or `px` relative to iframe |
| `position: fixed` in iframe panels | Fixed positioning behaves relative to iframe, not page | Use `position: absolute` relative to iframe container |
| Using `@import` for external fonts | Blocks rendering; adds network dependency | Stick to system fonts or embed font-face inline |
| `overflow: hidden` on scrollable panels | Content disappears below fold; no scroll | Use `overflow-y: auto` |
| Targeting elements by tag name without class | Styles leak to unrelated elements in iframe | Always target `pcbw-` prefixed classes |

---

## Compatibility Notes

1. **`light-dark()` support:** All modern browsers (Chrome 123+, Firefox 120+, Safari 17.4+). For very old browsers, the first value in `light-dark()` is used. This is acceptable for Perchance which targets modern browsers.

2. **`backdrop-filter`:** Not supported in Firefox before version 103. Falls back gracefully to solid background.

3. **System fonts:** `system-ui, -apple-system, sans-serif` renders the OS native font. This is the safest cross-platform choice.

4. **Iframe CSS isolation:** Styles inside the customCode iframe do not leak to the host page, and host styles do not leak in. This means you must provide all needed styles in the iframe.

5. **`messageWrapperStyle` scope:** Applied to each message wrapper div. Supports any valid inline CSS. Cannot use pseudo-elements (`:before`, `:after`) — those require a `<style>` block in the iframe.

6. **Mobile considerations:** Test on 360px-wide screens (common Android). Avoid horizontal overflow. Use `rem` for font sizes so they scale with user preferences.

7. **Performance:** Avoid CSS animations on elements that update every `StreamingMessage` event. Use `will-change` sparingly. Prefer `transform` and `opacity` for animations — they are GPU-accelerated.

8. **Snippet compatibility:** If using `ui-theme-adaptive-message-style.js` or `transforms-runtime-theme-shift.js`, those snippets own `wrapperStyle`. Do not also set `messageWrapperStyle` in the character row — the snippet's runtime value will override it. Choose one approach.

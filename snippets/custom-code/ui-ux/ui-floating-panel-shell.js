/**
 * Snippet: ui-floating-panel-shell
 *
 * Purpose:
 *   A draggable, resizable floating panel rendered in the iframe DOM.
 *   Provides a title bar with close button, a scrollable content area,
 *   and a public API for show/hide/setContent/setTitle.
 *
 * Why realistic:
 *   Uses only iframe-local DOM, CSS, and mouse/touch events. No external
 *   frameworks. Panel state (position, visibility) persisted in customData.
 *
 * Immediate behavior when pasted:
 *   - Renders a floating panel with default help text.
 *   - Panel is draggable via its title bar.
 *   - Exposes window.__pcbw_floatingPanel API.
 *
 * Customization points:
 *   - PANEL_WIDTH, PANEL_HEIGHT: default dimensions.
 *   - DEFAULT_TITLE, DEFAULT_CONTENT: initial text.
 *   - CSS colors use light-dark() for theme awareness.
 *
 * Caveats:
 *   - Panel lives inside the iframe; call oc.window.show() to make iframe visible.
 *   - Drag coordinates are iframe-relative.
 */
(() => {
  if (window.__pcbw_floatingPanel_init) return;
  window.__pcbw_floatingPanel_init = true;

  const NAMESPACE = "__pcbw_floatPanel";
  const PANEL_WIDTH = 320;
  const PANEL_HEIGHT = 260;
  const DEFAULT_TITLE = "Panel";
  const DEFAULT_CONTENT = "<p style='margin:8px;font-family:sans-serif;font-size:13px;'>Use <code>__pcbw_floatingPanel.setContent(html)</code> to populate this panel.</p>";

  // Restore persisted state
  if (!oc.thread.customData) oc.thread.customData = {};
  const saved = oc.thread.customData[NAMESPACE] || {};

  // ─── Styles ──────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #pcbw-fp-wrapper {
      position: fixed; z-index: 10000;
      width: ${PANEL_WIDTH}px; min-height: ${PANEL_HEIGHT}px;
      top: ${saved.top || 60}px; left: ${saved.left || 60}px;
      background: light-dark(#fff, #1e1e1e);
      color: light-dark(#222, #ddd);
      border: 1px solid light-dark(#ccc, #444);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.25);
      font-family: sans-serif;
      display: ${saved.visible === false ? "none" : "flex"};
      flex-direction: column;
      overflow: hidden;
      resize: both;
    }
    #pcbw-fp-titlebar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 10px; cursor: grab;
      background: light-dark(#f0f0f0, #2a2a2a);
      border-bottom: 1px solid light-dark(#ddd, #444);
      user-select: none; font-size: 13px; font-weight: 600;
    }
    #pcbw-fp-titlebar:active { cursor: grabbing; }
    #pcbw-fp-close {
      background: none; border: none; cursor: pointer;
      font-size: 16px; color: light-dark(#888, #aaa);
      line-height: 1; padding: 0 2px;
    }
    #pcbw-fp-close:hover { color: light-dark(#c00, #f55); }
    #pcbw-fp-body {
      flex: 1; overflow-y: auto; padding: 0;
      font-size: 13px;
    }
  `;
  document.head.appendChild(style);

  // ─── DOM ─────────────────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.id = "pcbw-fp-wrapper";

  const titlebar = document.createElement("div");
  titlebar.id = "pcbw-fp-titlebar";
  const titleSpan = document.createElement("span");
  titleSpan.id = "pcbw-fp-title";
  titleSpan.textContent = saved.title || DEFAULT_TITLE;
  const closeBtn = document.createElement("button");
  closeBtn.id = "pcbw-fp-close";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => api.hide());
  titlebar.appendChild(titleSpan);
  titlebar.appendChild(closeBtn);

  const body = document.createElement("div");
  body.id = "pcbw-fp-body";
  body.innerHTML = DEFAULT_CONTENT;

  wrapper.appendChild(titlebar);
  wrapper.appendChild(body);
  document.body.appendChild(wrapper);

  // ─── Drag Logic ──────────────────────────────────────────────────────
  let dragging = false, offsetX = 0, offsetY = 0;

  function onDragStart(e) {
    dragging = true;
    const ev = e.touches ? e.touches[0] : e;
    const rect = wrapper.getBoundingClientRect();
    offsetX = ev.clientX - rect.left;
    offsetY = ev.clientY - rect.top;
    e.preventDefault();
  }
  function onDragMove(e) {
    if (!dragging) return;
    const ev = e.touches ? e.touches[0] : e;
    wrapper.style.left = (ev.clientX - offsetX) + "px";
    wrapper.style.top = (ev.clientY - offsetY) + "px";
  }
  function onDragEnd() {
    if (!dragging) return;
    dragging = false;
    persist();
  }

  titlebar.addEventListener("mousedown", onDragStart);
  titlebar.addEventListener("touchstart", onDragStart, { passive: false });
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("touchmove", onDragMove, { passive: false });
  document.addEventListener("mouseup", onDragEnd);
  document.addEventListener("touchend", onDragEnd);

  // ─── Persistence ─────────────────────────────────────────────────────
  function persist() {
    oc.thread.customData[NAMESPACE] = {
      top: parseInt(wrapper.style.top) || 60,
      left: parseInt(wrapper.style.left) || 60,
      visible: wrapper.style.display !== "none",
      title: titleSpan.textContent
    };
  }

  // ─── Public API ──────────────────────────────────────────────────────
  const api = {
    show() { wrapper.style.display = "flex"; persist(); },
    hide() { wrapper.style.display = "none"; persist(); },
    toggle() { wrapper.style.display === "none" ? api.show() : api.hide(); },
    setContent(html) { body.innerHTML = html; },
    setTitle(text) { titleSpan.textContent = text; persist(); },
    getElement() { return wrapper; }
  };

  window.__pcbw_floatingPanel = api;
  console.log("[pcbw-fp] Floating panel loaded.");
})();

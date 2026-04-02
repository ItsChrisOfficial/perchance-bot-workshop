/**
 * Snippet: ui-slideout-side-panel
 *
 * Purpose:
 *   A panel that slides in from the right side of the iframe with smooth
 *   CSS transition. Includes toggle tab, close button, scrollable content.
 *
 * Why realistic:
 *   Pure iframe-local DOM/CSS. No frameworks. Theme-aware. Persists open/closed
 *   state in oc.thread.customData.
 *
 * Immediate behavior when pasted:
 *   - Renders a small toggle tab on the right edge of the iframe.
 *   - Clicking the tab slides the panel in/out.
 *   - Exposes window.__pcbw_sidePanel API.
 *
 * Customization points:
 *   - PANEL_WIDTH: panel width in px.
 *   - TOGGLE_LABEL: text on the toggle tab.
 *
 * Caveats:
 *   - Panel is inside the iframe; oc.window.show() must be called first.
 */
(() => {
  if (window.__pcbw_sidePanel_init) return;
  window.__pcbw_sidePanel_init = true;

  const NAMESPACE = "__pcbw_sidePanel";
  const PANEL_WIDTH = 280;
  const TOGGLE_LABEL = "☰";

  if (!oc.thread.customData) oc.thread.customData = {};
  const saved = oc.thread.customData[NAMESPACE] || {};
  let isOpen = saved.open || false;

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-sp-panel {
      position: fixed; top: 0; right: 0; z-index: 10050;
      width: ${PANEL_WIDTH}px; height: 100%;
      background: light-dark(#fff, #1e1e1e);
      color: light-dark(#222, #ddd);
      border-left: 1px solid light-dark(#ccc, #444);
      box-shadow: -3px 0 12px rgba(0,0,0,.2);
      transform: translateX(${isOpen ? "0" : PANEL_WIDTH + "px"});
      transition: transform .3s ease;
      display: flex; flex-direction: column;
      font-family: sans-serif;
    }
    #pcbw-sp-panel.pcbw-sp-open { transform: translateX(0); }
    #pcbw-sp-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 12px;
      border-bottom: 1px solid light-dark(#eee, #333);
      font-weight: 600; font-size: 14px;
    }
    #pcbw-sp-header button {
      background: none; border: none; cursor: pointer;
      font-size: 18px; color: light-dark(#888, #aaa); padding: 0;
    }
    #pcbw-sp-header button:hover { color: light-dark(#c00, #f55); }
    #pcbw-sp-body {
      flex: 1; overflow-y: auto; padding: 10px 12px; font-size: 13px;
    }
    #pcbw-sp-toggle {
      position: fixed; top: 50%; right: 0; z-index: 10049;
      transform: translateY(-50%);
      width: 28px; height: 40px; border: none; cursor: pointer;
      background: light-dark(#e0e0e0, #333);
      color: light-dark(#444, #ccc);
      border-radius: 6px 0 0 6px;
      font-size: 16px; display: flex; align-items: center; justify-content: center;
      box-shadow: -2px 0 6px rgba(0,0,0,.1);
      transition: right .3s ease;
    }
    #pcbw-sp-toggle.pcbw-sp-shifted { right: ${PANEL_WIDTH}px; }
  `;
  document.head.appendChild(style);

  // DOM
  const panel = document.createElement("div");
  panel.id = "pcbw-sp-panel";
  if (isOpen) panel.classList.add("pcbw-sp-open");

  const header = document.createElement("div");
  header.id = "pcbw-sp-header";
  const titleEl = document.createElement("span");
  titleEl.textContent = "Side Panel";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => api.close());
  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  const body = document.createElement("div");
  body.id = "pcbw-sp-body";
  body.innerHTML = "<p>Use <code>__pcbw_sidePanel.setContent(html)</code> to fill this panel.</p>";

  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  const toggle = document.createElement("button");
  toggle.id = "pcbw-sp-toggle";
  toggle.textContent = TOGGLE_LABEL;
  if (isOpen) toggle.classList.add("pcbw-sp-shifted");
  toggle.addEventListener("click", () => api.toggle());
  document.body.appendChild(toggle);

  function persist() {
    oc.thread.customData[NAMESPACE] = { open: isOpen };
  }

  const api = {
    open() {
      isOpen = true;
      panel.classList.add("pcbw-sp-open");
      toggle.classList.add("pcbw-sp-shifted");
      persist();
    },
    close() {
      isOpen = false;
      panel.classList.remove("pcbw-sp-open");
      toggle.classList.remove("pcbw-sp-shifted");
      persist();
    },
    toggle() { isOpen ? api.close() : api.open(); },
    setContent(html) { body.innerHTML = html; },
    setTitle(text) { titleEl.textContent = text; },
    isOpen() { return isOpen; }
  };

  window.__pcbw_sidePanel = api;
  console.log("[pcbw-sp] Slideout side panel loaded.");
})();

/**
 * Snippet: ui-toolbar-button-cluster
 *
 * Purpose:
 *   A fixed toolbar with configurable icon buttons. Each button has an emoji
 *   icon, tooltip, and click handler. Toolbar can be shown/hidden and buttons
 *   can be added/removed at runtime.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS. No frameworks. Theme-aware. Buttons trigger callbacks
 *   that can interact with oc.* APIs.
 *
 * Immediate behavior when pasted:
 *   - Renders a horizontal toolbar at the top of the iframe with demo buttons.
 *   - Exposes window.__pcbw_toolbar API.
 *
 * Customization points:
 *   - TOOLBAR_POSITION: "top" or "bottom".
 *   - BUTTONS: initial array of { id, icon, tooltip, onClick }.
 *
 * Caveats:
 *   - Requires oc.window.show() for the iframe to be visible.
 *   - Button callbacks run in the iframe context.
 */
(() => {
  if (window.__pcbw_toolbar_init) return;
  window.__pcbw_toolbar_init = true;

  const TOOLBAR_POSITION = "top"; // "top" or "bottom"

  const BUTTONS = [
    { id: "tb-info", icon: "ℹ️", tooltip: "Info", onClick: () => console.log("[toolbar] Info clicked") },
    { id: "tb-refresh", icon: "🔄", tooltip: "Refresh", onClick: () => console.log("[toolbar] Refresh clicked") },
    { id: "tb-settings", icon: "⚙️", tooltip: "Settings", onClick: () => console.log("[toolbar] Settings clicked") }
  ];

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-toolbar {
      position: fixed; ${TOOLBAR_POSITION}: 0; left: 0; right: 0;
      z-index: 10070;
      display: flex; align-items: center; gap: 4px;
      padding: 4px 8px;
      background: light-dark(#f5f5f5, #252525);
      border-${TOOLBAR_POSITION === "top" ? "bottom" : "top"}: 1px solid light-dark(#ddd, #444);
      font-family: sans-serif;
      box-shadow: 0 2px 6px rgba(0,0,0,.1);
    }
    .pcbw-tb-btn {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border: none; cursor: pointer;
      background: light-dark(#e8e8e8, #333);
      border-radius: 6px; font-size: 16px;
      transition: background .15s;
      position: relative;
    }
    .pcbw-tb-btn:hover {
      background: light-dark(#d0d0d0, #444);
    }
    .pcbw-tb-btn[title]::after {
      content: attr(title);
      position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%);
      padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;
      background: light-dark(#333, #eee); color: light-dark(#fff, #222);
      opacity: 0; pointer-events: none; transition: opacity .2s;
    }
    .pcbw-tb-btn:hover[title]::after { opacity: 1; }
    .pcbw-tb-btn.pcbw-tb-active {
      background: light-dark(#bbdefb, #1565c0);
    }
  `;
  document.head.appendChild(style);

  const toolbar = document.createElement("div");
  toolbar.id = "pcbw-toolbar";
  document.body.appendChild(toolbar);

  const buttonMap = new Map();

  function renderButton(config) {
    const btn = document.createElement("button");
    btn.className = "pcbw-tb-btn";
    btn.setAttribute("title", config.tooltip || "");
    btn.textContent = config.icon || "•";
    btn.dataset.pcbwId = config.id;
    btn.addEventListener("click", () => {
      if (typeof config.onClick === "function") config.onClick();
    });
    buttonMap.set(config.id, { el: btn, config });
    toolbar.appendChild(btn);
    return btn;
  }

  // Render initial buttons
  for (const b of BUTTONS) renderButton(b);

  const api = {
    addButton(config) {
      if (!config.id) config.id = "tb-" + Date.now();
      if (buttonMap.has(config.id)) return;
      renderButton(config);
    },
    removeButton(id) {
      const entry = buttonMap.get(id);
      if (entry) { entry.el.remove(); buttonMap.delete(id); }
    },
    setActive(id, active) {
      const entry = buttonMap.get(id);
      if (entry) {
        entry.el.classList.toggle("pcbw-tb-active", !!active);
      }
    },
    show() { toolbar.style.display = "flex"; },
    hide() { toolbar.style.display = "none"; }
  };

  window.__pcbw_toolbar = api;
  console.log("[pcbw-toolbar] Toolbar loaded with", BUTTONS.length, "buttons.");
})();

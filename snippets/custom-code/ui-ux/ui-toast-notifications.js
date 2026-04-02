/**
 * Snippet: ui-toast-notifications
 *
 * Purpose:
 *   Auto-dismissing toast notification system. Toasts appear at the top-right,
 *   stack vertically, and support info/success/warning/error types with
 *   appropriate colors and icons.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS with setTimeout for auto-dismiss. No frameworks.
 *   Theme-aware. No network dependencies.
 *
 * Immediate behavior when pasted:
 *   - Exposes window.__pcbw_toast.show(message, type, duration) API.
 *   - Shows a demo toast on load to confirm it's working.
 *
 * Customization points:
 *   - DEFAULT_DURATION: auto-dismiss time in ms.
 *   - MAX_TOASTS: maximum visible toasts before oldest is removed.
 *   - TYPES: color/icon config per toast type.
 *
 * Caveats:
 *   - Toasts are in the iframe; oc.window.show() required to see them.
 *   - High-frequency toasts may stack and obscure the iframe.
 */
(() => {
  if (window.__pcbw_toast_init) return;
  window.__pcbw_toast_init = true;

  const DEFAULT_DURATION = 3000;
  const MAX_TOASTS = 5;

  const TYPES = {
    info:    { icon: "ℹ️", bg: "light-dark(#E3F2FD, #1A237E)", fg: "light-dark(#1565C0, #82B1FF)" },
    success: { icon: "✅", bg: "light-dark(#E8F5E9, #1B5E20)", fg: "light-dark(#2E7D32, #69F0AE)" },
    warning: { icon: "⚠️", bg: "light-dark(#FFF8E1, #E65100)", fg: "light-dark(#E65100, #FFE082)" },
    error:   { icon: "❌", bg: "light-dark(#FFEBEE, #B71C1C)", fg: "light-dark(#C62828, #EF9A9A)" }
  };

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-toast-container {
      position: fixed; top: 10px; right: 10px; z-index: 10200;
      display: flex; flex-direction: column; gap: 6px;
      pointer-events: none; font-family: sans-serif;
    }
    .pcbw-toast {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 8px;
      font-size: 13px; min-width: 200px; max-width: 320px;
      box-shadow: 0 3px 10px rgba(0,0,0,.2);
      pointer-events: auto; cursor: pointer;
      animation: pcbw-toast-in .25s ease;
      transition: opacity .25s, transform .25s;
    }
    .pcbw-toast.pcbw-toast-out {
      opacity: 0; transform: translateX(30px);
    }
    @keyframes pcbw-toast-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "pcbw-toast-container";
  document.body.appendChild(container);

  const activeToasts = [];

  function removeToast(el) {
    el.classList.add("pcbw-toast-out");
    setTimeout(() => {
      el.remove();
      const idx = activeToasts.indexOf(el);
      if (idx >= 0) activeToasts.splice(idx, 1);
    }, 260);
  }

  const api = {
    /**
     * Show a toast notification.
     * @param {string} message  - Text to display
     * @param {string} type     - "info"|"success"|"warning"|"error"
     * @param {number} duration - Auto-dismiss ms (0 = no auto-dismiss)
     */
    show(message, type, duration) {
      type = type || "info";
      duration = duration !== undefined ? duration : DEFAULT_DURATION;
      const conf = TYPES[type] || TYPES.info;

      const toast = document.createElement("div");
      toast.className = "pcbw-toast";
      toast.style.background = conf.bg;
      toast.style.color = conf.fg;
      toast.innerHTML = `<span>${conf.icon}</span><span>${message}</span>`;
      toast.addEventListener("click", () => removeToast(toast));

      container.appendChild(toast);
      activeToasts.push(toast);

      // Enforce max
      while (activeToasts.length > MAX_TOASTS) {
        removeToast(activeToasts[0]);
      }

      if (duration > 0) {
        setTimeout(() => {
          if (toast.parentNode) removeToast(toast);
        }, duration);
      }

      return toast;
    }
  };

  window.__pcbw_toast = api;

  // Demo toast
  api.show("Toast notifications ready.", "info", 2500);
  console.log("[pcbw-toast] Toast notification system loaded.");
})();

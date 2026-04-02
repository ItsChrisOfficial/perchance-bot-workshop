/**
 * Snippet: ui-modal-dialog-shell
 *
 * Purpose:
 *   A centered modal dialog with semi-transparent backdrop overlay.
 *   Supports configurable title, body, and action buttons. Backdrop click
 *   closes the modal. Provides a public API for programmatic use.
 *
 * Why realistic:
 *   Pure iframe-local DOM/CSS. No frameworks. Theme-aware via light-dark().
 *   Suitable for confirmations, settings, or any in-chat modal interaction.
 *
 * Immediate behavior when pasted:
 *   - Exposes window.__pcbw_modal.show({title, body, buttons}) API.
 *   - No modal visible until .show() is called.
 *
 * Customization points:
 *   - MODAL_MAX_WIDTH: max width in px.
 *   - Button objects: { label, onClick, primary }.
 *   - CSS colors use light-dark() for theme awareness.
 *
 * Caveats:
 *   - Modal is inside the iframe; oc.window.show() must be called first.
 *   - Only one modal at a time (new .show() replaces previous).
 */
(() => {
  if (window.__pcbw_modal_init) return;
  window.__pcbw_modal_init = true;

  const MODAL_MAX_WIDTH = 400;

  // ─── Styles ──────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #pcbw-modal-backdrop {
      position: fixed; inset: 0; z-index: 10100;
      background: rgba(0,0,0,.45);
      display: none; align-items: center; justify-content: center;
    }
    #pcbw-modal-backdrop.pcbw-modal-open { display: flex; }
    #pcbw-modal-box {
      background: light-dark(#fff, #1e1e1e);
      color: light-dark(#222, #ddd);
      border: 1px solid light-dark(#ccc, #444);
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,.35);
      width: 90%; max-width: ${MODAL_MAX_WIDTH}px;
      font-family: sans-serif; overflow: hidden;
    }
    #pcbw-modal-header {
      padding: 12px 16px; font-size: 15px; font-weight: 700;
      border-bottom: 1px solid light-dark(#eee, #333);
      display: flex; justify-content: space-between; align-items: center;
    }
    #pcbw-modal-header button {
      background: none; border: none; cursor: pointer;
      font-size: 18px; color: light-dark(#888, #aaa); padding: 0;
    }
    #pcbw-modal-header button:hover { color: light-dark(#c00, #f55); }
    #pcbw-modal-body {
      padding: 14px 16px; font-size: 13px; line-height: 1.5;
    }
    #pcbw-modal-footer {
      padding: 10px 16px; display: flex; gap: 8px; justify-content: flex-end;
      border-top: 1px solid light-dark(#eee, #333);
    }
    .pcbw-modal-btn {
      padding: 6px 16px; border-radius: 6px; cursor: pointer;
      font-size: 13px; font-family: sans-serif; border: 1px solid light-dark(#ccc, #555);
      background: light-dark(#f5f5f5, #333); color: light-dark(#222, #ddd);
    }
    .pcbw-modal-btn:hover { opacity: .85; }
    .pcbw-modal-btn-primary {
      background: light-dark(#1976D2, #42A5F5); color: #fff; border-color: transparent;
    }
  `;
  document.head.appendChild(style);

  // ─── DOM ─────────────────────────────────────────────────────────────
  const backdrop = document.createElement("div");
  backdrop.id = "pcbw-modal-backdrop";

  const box = document.createElement("div");
  box.id = "pcbw-modal-box";

  const header = document.createElement("div");
  header.id = "pcbw-modal-header";
  const titleEl = document.createElement("span");
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => api.close());
  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  const bodyEl = document.createElement("div");
  bodyEl.id = "pcbw-modal-body";

  const footer = document.createElement("div");
  footer.id = "pcbw-modal-footer";

  box.appendChild(header);
  box.appendChild(bodyEl);
  box.appendChild(footer);
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);

  // Close on backdrop click
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) api.close();
  });

  // ─── Public API ──────────────────────────────────────────────────────
  const api = {
    /**
     * Show a modal dialog.
     * @param {Object} opts
     * @param {string} opts.title    - Dialog title
     * @param {string} opts.body     - HTML body content
     * @param {Array}  opts.buttons  - Array of { label, onClick, primary }
     */
    show(opts = {}) {
      titleEl.textContent = opts.title || "Dialog";
      bodyEl.innerHTML = opts.body || "";

      footer.innerHTML = "";
      const buttons = opts.buttons || [{ label: "OK", primary: true }];
      for (const btn of buttons) {
        const el = document.createElement("button");
        el.className = "pcbw-modal-btn" + (btn.primary ? " pcbw-modal-btn-primary" : "");
        el.textContent = btn.label || "OK";
        el.addEventListener("click", () => {
          if (typeof btn.onClick === "function") btn.onClick();
          api.close();
        });
        footer.appendChild(el);
      }

      backdrop.classList.add("pcbw-modal-open");
    },

    close() {
      backdrop.classList.remove("pcbw-modal-open");
    },

    isOpen() {
      return backdrop.classList.contains("pcbw-modal-open");
    }
  };

  window.__pcbw_modal = api;
  console.log("[pcbw-modal] Modal dialog shell loaded.");
})();

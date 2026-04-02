/**
 * Snippet: ui-confirmation-dialog
 *
 * Purpose:
 *   A specialized Yes/No confirmation dialog. Returns a promise resolving
 *   to true/false. Supports customizable question text and button labels.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS with promise-based API. No frameworks. Theme-aware.
 *   Blocks further interaction via backdrop overlay.
 *
 * Immediate behavior when pasted:
 *   - Exposes window.__pcbw_confirm.ask(question, onYes, onNo) API.
 *   - Also supports: await __pcbw_confirm.askAsync(question) → true/false.
 *   - No dialog visible until .ask() is called.
 *
 * Customization points:
 *   - YES_LABEL, NO_LABEL: button text.
 *   - Colors via light-dark() for theme awareness.
 *
 * Caveats:
 *   - Only one confirmation at a time.
 *   - Requires oc.window.show() for iframe visibility.
 */
(() => {
  if (window.__pcbw_confirm_init) return;
  window.__pcbw_confirm_init = true;

  const YES_LABEL = "Yes";
  const NO_LABEL = "No";

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-confirm-backdrop {
      position: fixed; inset: 0; z-index: 10150;
      background: rgba(0,0,0,.45);
      display: none; align-items: center; justify-content: center;
    }
    #pcbw-confirm-backdrop.pcbw-confirm-open { display: flex; }
    #pcbw-confirm-box {
      background: light-dark(#fff, #1e1e1e);
      color: light-dark(#222, #ddd);
      border: 1px solid light-dark(#ccc, #444);
      border-radius: 10px;
      box-shadow: 0 6px 24px rgba(0,0,0,.3);
      width: 90%; max-width: 360px;
      font-family: sans-serif; overflow: hidden;
    }
    #pcbw-confirm-question {
      padding: 20px 18px 12px; font-size: 14px; line-height: 1.5;
      text-align: center;
    }
    #pcbw-confirm-actions {
      display: flex; gap: 8px; justify-content: center;
      padding: 12px 18px 18px;
    }
    .pcbw-confirm-btn {
      padding: 8px 24px; border-radius: 6px; cursor: pointer;
      font-size: 13px; font-family: sans-serif;
      border: 1px solid light-dark(#ccc, #555);
      background: light-dark(#f5f5f5, #333);
      color: light-dark(#222, #ddd);
      min-width: 70px;
    }
    .pcbw-confirm-btn:hover { opacity: .85; }
    .pcbw-confirm-btn-yes {
      background: light-dark(#1976D2, #42A5F5);
      color: #fff; border-color: transparent;
    }
    .pcbw-confirm-btn-no {
      background: light-dark(#e0e0e0, #444);
    }
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement("div");
  backdrop.id = "pcbw-confirm-backdrop";

  const box = document.createElement("div");
  box.id = "pcbw-confirm-box";

  const questionEl = document.createElement("div");
  questionEl.id = "pcbw-confirm-question";

  const actions = document.createElement("div");
  actions.id = "pcbw-confirm-actions";

  const yesBtn = document.createElement("button");
  yesBtn.className = "pcbw-confirm-btn pcbw-confirm-btn-yes";
  yesBtn.textContent = YES_LABEL;

  const noBtn = document.createElement("button");
  noBtn.className = "pcbw-confirm-btn pcbw-confirm-btn-no";
  noBtn.textContent = NO_LABEL;

  actions.appendChild(yesBtn);
  actions.appendChild(noBtn);
  box.appendChild(questionEl);
  box.appendChild(actions);
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);

  let pendingResolve = null;

  function close(result) {
    backdrop.classList.remove("pcbw-confirm-open");
    if (pendingResolve) {
      pendingResolve(result);
      pendingResolve = null;
    }
  }

  yesBtn.addEventListener("click", () => close(true));
  noBtn.addEventListener("click", () => close(false));
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close(false);
  });

  const api = {
    /**
     * Show a confirmation dialog with callbacks.
     * @param {string}   question - The question to display
     * @param {Function} onYes    - Called if user clicks Yes
     * @param {Function} onNo     - Called if user clicks No
     */
    ask(question, onYes, onNo) {
      api.askAsync(question).then(result => {
        if (result && typeof onYes === "function") onYes();
        if (!result && typeof onNo === "function") onNo();
      });
    },

    /**
     * Show a confirmation dialog and return a promise.
     * @param {string} question - The question to display
     * @returns {Promise<boolean>}
     */
    askAsync(question) {
      questionEl.textContent = question || "Are you sure?";
      backdrop.classList.add("pcbw-confirm-open");
      yesBtn.focus();
      return new Promise(resolve => { pendingResolve = resolve; });
    }
  };

  window.__pcbw_confirm = api;
  console.log("[pcbw-confirm] Confirmation dialog loaded.");
})();

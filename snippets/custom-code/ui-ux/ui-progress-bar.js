/**
 * Snippet: ui-progress-bar
 *
 * Purpose:
 *   An animated progress/loading bar component with percentage fill, label,
 *   and indeterminate (pulsing) mode for unknown-duration operations.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS animations. No frameworks. Theme-aware.
 *   Useful for showing preloading status, LLM processing, etc.
 *
 * Immediate behavior when pasted:
 *   - Exposes window.__pcbw_progress API.
 *   - Progress bar is hidden until .show() or .setProgress() is called.
 *
 * Customization points:
 *   - BAR_COLOR: fill color.
 *   - BAR_HEIGHT: height in px.
 *
 * Caveats:
 *   - Requires oc.window.show() for iframe visibility.
 *   - Indeterminate mode runs a CSS animation until stopped.
 */
(() => {
  if (window.__pcbw_progress_init) return;
  window.__pcbw_progress_init = true;

  const BAR_HEIGHT = 6;

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-progress-wrapper {
      position: fixed; top: 0; left: 0; right: 0; z-index: 10300;
      display: none; flex-direction: column;
      font-family: sans-serif;
    }
    #pcbw-progress-track {
      width: 100%; height: ${BAR_HEIGHT}px;
      background: light-dark(#e0e0e0, #333);
      overflow: hidden;
    }
    #pcbw-progress-fill {
      height: 100%; width: 0%;
      background: light-dark(#1976D2, #42A5F5);
      transition: width .3s ease;
    }
    #pcbw-progress-fill.pcbw-progress-indeterminate {
      width: 30%;
      animation: pcbw-progress-pulse 1.5s ease-in-out infinite;
    }
    @keyframes pcbw-progress-pulse {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }
    #pcbw-progress-label {
      text-align: center; font-size: 11px; padding: 2px 0;
      color: light-dark(#555, #aaa);
      background: light-dark(#f9f9f9, #1a1a1a);
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.id = "pcbw-progress-wrapper";

  const track = document.createElement("div");
  track.id = "pcbw-progress-track";
  const fill = document.createElement("div");
  fill.id = "pcbw-progress-fill";
  track.appendChild(fill);

  const labelEl = document.createElement("div");
  labelEl.id = "pcbw-progress-label";

  wrapper.appendChild(track);
  wrapper.appendChild(labelEl);
  document.body.appendChild(wrapper);

  const api = {
    show(label) {
      wrapper.style.display = "flex";
      labelEl.textContent = label || "";
    },
    hide() {
      wrapper.style.display = "none";
      fill.classList.remove("pcbw-progress-indeterminate");
      fill.style.width = "0%";
      labelEl.textContent = "";
    },
    setProgress(percent, label) {
      fill.classList.remove("pcbw-progress-indeterminate");
      const clamped = Math.max(0, Math.min(100, percent));
      fill.style.width = clamped + "%";
      labelEl.textContent = label || (clamped + "%");
      wrapper.style.display = "flex";
    },
    setIndeterminate(label) {
      fill.style.width = "";
      fill.classList.add("pcbw-progress-indeterminate");
      labelEl.textContent = label || "Loading…";
      wrapper.style.display = "flex";
    }
  };

  window.__pcbw_progress = api;
  console.log("[pcbw-progress] Progress bar loaded.");
})();

/**
 * Snippet: ui-debug-console-panel
 *
 * Purpose:
 *   An in-iframe debug console that intercepts console.log/warn/error
 *   and displays entries in a collapsible panel with timestamps,
 *   color-coding, filtering, and a clear button.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS. Overrides console methods within the iframe scope.
 *   No frameworks. Theme-aware. Useful during customCode development.
 *
 * Immediate behavior when pasted:
 *   - Renders a collapsible panel at the bottom of the iframe.
 *   - Intercepts console.log, console.warn, console.error.
 *   - Displays captured entries with timestamps.
 *   - Exposes window.__pcbw_debug API.
 *
 * Customization points:
 *   - PANEL_HEIGHT: default panel height.
 *   - MAX_ENTRIES: maximum log entries before oldest are pruned.
 *   - START_COLLAPSED: whether the panel starts collapsed.
 *
 * Caveats:
 *   - Overrides console.log/warn/error in the iframe context only.
 *   - Original console methods are preserved and still called.
 *   - Heavy logging may impact performance.
 */
(() => {
  if (window.__pcbw_debug_init) return;
  window.__pcbw_debug_init = true;

  const PANEL_HEIGHT = 200;
  const MAX_ENTRIES = 200;
  const START_COLLAPSED = true;

  const LEVEL_COLORS = {
    log:   { bg: "transparent", fg: "light-dark(#333, #ccc)", icon: "📝" },
    warn:  { bg: "light-dark(#FFF8E1, rgba(255,152,0,.1))", fg: "light-dark(#E65100, #FFB74D)", icon: "⚠️" },
    error: { bg: "light-dark(#FFEBEE, rgba(244,67,54,.1))", fg: "light-dark(#C62828, #EF9A9A)", icon: "❌" }
  };

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-debug-panel {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 10400;
      font-family: 'Courier New', monospace;
      background: light-dark(#fafafa, #1a1a1a);
      border-top: 1px solid light-dark(#ccc, #444);
      display: flex; flex-direction: column;
      transition: height .2s ease;
    }
    #pcbw-debug-panel.pcbw-debug-collapsed { height: 28px !important; }
    #pcbw-debug-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 4px 8px; height: 28px; min-height: 28px;
      background: light-dark(#e8e8e8, #252525);
      border-bottom: 1px solid light-dark(#ddd, #444);
      cursor: pointer; user-select: none;
      font-family: sans-serif; font-size: 12px;
      color: light-dark(#555, #aaa);
    }
    #pcbw-debug-header span { font-weight: 600; }
    #pcbw-debug-actions { display: flex; gap: 6px; }
    #pcbw-debug-actions button {
      background: none; border: none; cursor: pointer;
      font-size: 12px; color: light-dark(#888, #aaa);
      font-family: sans-serif;
    }
    #pcbw-debug-actions button:hover { color: light-dark(#222, #fff); }
    #pcbw-debug-log {
      flex: 1; overflow-y: auto; padding: 4px 0; font-size: 11px;
    }
    .pcbw-debug-entry {
      padding: 2px 8px; display: flex; gap: 6px; align-items: flex-start;
      border-bottom: 1px solid light-dark(#f0f0f0, #2a2a2a);
    }
    .pcbw-debug-time { color: light-dark(#999, #666); min-width: 70px; }
    .pcbw-debug-msg { word-break: break-word; flex: 1; }
    #pcbw-debug-filter {
      display: flex; gap: 4px; align-items: center;
    }
    #pcbw-debug-filter label {
      font-size: 11px; cursor: pointer;
      color: light-dark(#666, #999);
    }
    #pcbw-debug-filter input { margin-right: 2px; }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "pcbw-debug-panel";
  panel.style.height = PANEL_HEIGHT + "px";
  if (START_COLLAPSED) panel.classList.add("pcbw-debug-collapsed");

  const header = document.createElement("div");
  header.id = "pcbw-debug-header";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = "🐛 Debug Console";

  const actionsDiv = document.createElement("div");
  actionsDiv.id = "pcbw-debug-actions";

  const filterDiv = document.createElement("div");
  filterDiv.id = "pcbw-debug-filter";

  const filters = { log: true, warn: true, error: true };
  for (const level of ["log", "warn", "error"]) {
    const lbl = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.addEventListener("change", () => {
      filters[level] = cb.checked;
      refreshDisplay();
    });
    lbl.appendChild(cb);
    lbl.appendChild(document.createTextNode(level));
    filterDiv.appendChild(lbl);
  }

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🗑 Clear";
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    entries.length = 0;
    refreshDisplay();
  });

  actionsDiv.appendChild(filterDiv);
  actionsDiv.appendChild(clearBtn);

  header.appendChild(titleSpan);
  header.appendChild(actionsDiv);
  header.addEventListener("click", () => {
    panel.classList.toggle("pcbw-debug-collapsed");
  });

  const logArea = document.createElement("div");
  logArea.id = "pcbw-debug-log";

  panel.appendChild(header);
  panel.appendChild(logArea);
  document.body.appendChild(panel);

  const entries = [];

  function addEntry(level, args) {
    const msg = Array.from(args).map(a => {
      if (typeof a === "object") {
        try { return JSON.stringify(a, null, 1); } catch { return String(a); }
      }
      return String(a);
    }).join(" ");

    const entry = {
      level,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      message: msg
    };
    entries.push(entry);
    if (entries.length > MAX_ENTRIES) entries.shift();
    appendEntryDOM(entry);
  }

  function appendEntryDOM(entry) {
    if (!filters[entry.level]) return;
    const conf = LEVEL_COLORS[entry.level] || LEVEL_COLORS.log;
    const el = document.createElement("div");
    el.className = "pcbw-debug-entry";
    el.style.background = conf.bg;
    el.style.color = conf.fg;
    el.innerHTML =
      `<span class="pcbw-debug-time">${entry.time}</span>` +
      `<span>${conf.icon}</span>` +
      `<span class="pcbw-debug-msg">${escapeHtml(entry.message)}</span>`;
    logArea.appendChild(el);
    logArea.scrollTop = logArea.scrollHeight;
  }

  function refreshDisplay() {
    logArea.innerHTML = "";
    for (const e of entries) appendEntryDOM(e);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ─── Intercept Console Methods ───────────────────────────────────────
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  console.log = function () {
    origLog.apply(console, arguments);
    addEntry("log", arguments);
  };
  console.warn = function () {
    origWarn.apply(console, arguments);
    addEntry("warn", arguments);
  };
  console.error = function () {
    origError.apply(console, arguments);
    addEntry("error", arguments);
  };

  // ─── Public API ──────────────────────────────────────────────────────
  const api = {
    log(msg) { console.log(msg); },
    warn(msg) { console.warn(msg); },
    error(msg) { console.error(msg); },
    clear() { entries.length = 0; refreshDisplay(); },
    show() { panel.classList.remove("pcbw-debug-collapsed"); },
    hide() { panel.classList.add("pcbw-debug-collapsed"); }
  };

  window.__pcbw_debug = api;
  console.log("[pcbw-debug] Debug console panel loaded.");
})();

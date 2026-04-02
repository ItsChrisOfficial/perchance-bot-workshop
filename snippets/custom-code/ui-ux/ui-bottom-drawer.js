/**
 * Snippet: ui-bottom-drawer
 *
 * Purpose:
 *   A pull-up drawer from the bottom of the iframe with snap-to positions
 *   (collapsed, half, full). Smooth CSS transitions, scrollable content area.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS with touch/mouse events. No frameworks. Theme-aware.
 *   Persists drawer position in customData.
 *
 * Immediate behavior when pasted:
 *   - Renders a bottom drawer with a drag handle.
 *   - Clicking the handle cycles through collapsed → half → full → collapsed.
 *   - Exposes window.__pcbw_drawer API.
 *
 * Customization points:
 *   - HALF_HEIGHT, FULL_HEIGHT: snap positions in vh.
 *   - COLLAPSED_HEIGHT: collapsed handle height in px.
 *
 * Caveats:
 *   - Requires oc.window.show() for the iframe to be visible.
 */
(() => {
  if (window.__pcbw_drawer_init) return;
  window.__pcbw_drawer_init = true;

  const NAMESPACE = "__pcbw_drawer";
  const COLLAPSED_HEIGHT = 36;
  const HALF_HEIGHT = 45; // vh
  const FULL_HEIGHT = 90; // vh

  if (!oc.thread.customData) oc.thread.customData = {};
  const saved = oc.thread.customData[NAMESPACE] || {};
  let position = saved.position || "collapsed"; // collapsed | half | full

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-drawer {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 10060;
      background: light-dark(#fff, #1e1e1e);
      color: light-dark(#222, #ddd);
      border-top: 1px solid light-dark(#ccc, #444);
      border-radius: 14px 14px 0 0;
      box-shadow: 0 -4px 16px rgba(0,0,0,.2);
      transition: height .3s ease;
      display: flex; flex-direction: column;
      font-family: sans-serif;
      overflow: hidden;
    }
    #pcbw-drawer-handle {
      display: flex; align-items: center; justify-content: center;
      height: ${COLLAPSED_HEIGHT}px; min-height: ${COLLAPSED_HEIGHT}px;
      cursor: pointer; user-select: none;
    }
    #pcbw-drawer-handle-bar {
      width: 40px; height: 4px; border-radius: 2px;
      background: light-dark(#bbb, #666);
    }
    #pcbw-drawer-body {
      flex: 1; overflow-y: auto; padding: 8px 14px; font-size: 13px;
    }
  `;
  document.head.appendChild(style);

  const drawer = document.createElement("div");
  drawer.id = "pcbw-drawer";

  const handle = document.createElement("div");
  handle.id = "pcbw-drawer-handle";
  const handleBar = document.createElement("div");
  handleBar.id = "pcbw-drawer-handle-bar";
  handle.appendChild(handleBar);

  const body = document.createElement("div");
  body.id = "pcbw-drawer-body";
  body.innerHTML = "<p>Use <code>__pcbw_drawer.setContent(html)</code> to fill this drawer.</p>";

  drawer.appendChild(handle);
  drawer.appendChild(body);
  document.body.appendChild(drawer);

  function applyPosition(pos) {
    position = pos;
    switch (pos) {
      case "collapsed":
        drawer.style.height = COLLAPSED_HEIGHT + "px";
        break;
      case "half":
        drawer.style.height = HALF_HEIGHT + "vh";
        break;
      case "full":
        drawer.style.height = FULL_HEIGHT + "vh";
        break;
    }
    oc.thread.customData[NAMESPACE] = { position };
  }

  // Cycle through positions on handle click
  handle.addEventListener("click", () => {
    const cycle = { collapsed: "half", half: "full", full: "collapsed" };
    applyPosition(cycle[position] || "collapsed");
  });

  applyPosition(position);

  const api = {
    open() { applyPosition("half"); },
    close() { applyPosition("collapsed"); },
    setHeight(pos) {
      if (["collapsed", "half", "full"].includes(pos)) applyPosition(pos);
    },
    setContent(html) { body.innerHTML = html; },
    getPosition() { return position; }
  };

  window.__pcbw_drawer = api;
  console.log("[pcbw-drawer] Bottom drawer loaded. Position:", position);
})();

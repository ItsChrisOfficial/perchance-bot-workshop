/**
 * Snippet: ui-tabbed-panel
 *
 * Purpose:
 *   A tabbed content panel with configurable tabs. Clicking a tab switches
 *   the visible content area. Active tab is persisted in customData.
 *
 * Why realistic:
 *   Pure iframe DOM/CSS. No frameworks. Theme-aware. Tabs defined as
 *   configurable array, addable/removable at runtime.
 *
 * Immediate behavior when pasted:
 *   - Renders a tabbed panel with default demo tabs.
 *   - Exposes window.__pcbw_tabs API.
 *
 * Customization points:
 *   - TABS: array of { id, label, content } objects.
 *   - Panel visibility can be toggled.
 *
 * Caveats:
 *   - Requires oc.window.show() for iframe visibility.
 */
(() => {
  if (window.__pcbw_tabs_init) return;
  window.__pcbw_tabs_init = true;

  const NAMESPACE = "__pcbw_tabs";

  const TABS = [
    { id: "tab-info", label: "Info", content: "<p style='margin:10px;font-size:13px;'>Information tab content.</p>" },
    { id: "tab-notes", label: "Notes", content: "<p style='margin:10px;font-size:13px;'>Notes tab content.</p>" },
    { id: "tab-settings", label: "Settings", content: "<p style='margin:10px;font-size:13px;'>Settings tab content.</p>" }
  ];

  if (!oc.thread.customData) oc.thread.customData = {};
  const saved = oc.thread.customData[NAMESPACE] || {};
  let activeTabId = saved.activeTab || (TABS[0] && TABS[0].id);

  const style = document.createElement("style");
  style.textContent = `
    #pcbw-tabs-wrapper {
      position: fixed; top: 40px; left: 20px; z-index: 10080;
      width: 320px; min-height: 200px;
      background: light-dark(#fff, #1e1e1e);
      border: 1px solid light-dark(#ccc, #444);
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0,0,0,.2);
      font-family: sans-serif;
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    #pcbw-tabs-bar {
      display: flex; border-bottom: 1px solid light-dark(#ddd, #444);
      background: light-dark(#fafafa, #252525);
    }
    .pcbw-tab-btn {
      flex: 1; padding: 8px 0; border: none; cursor: pointer;
      background: transparent; font-size: 12px; font-family: sans-serif;
      color: light-dark(#666, #999);
      border-bottom: 2px solid transparent;
      transition: all .15s;
    }
    .pcbw-tab-btn:hover { color: light-dark(#222, #ddd); }
    .pcbw-tab-btn.pcbw-tab-active {
      color: light-dark(#1976D2, #64B5F6);
      border-bottom-color: light-dark(#1976D2, #64B5F6);
      font-weight: 600;
    }
    #pcbw-tabs-content {
      flex: 1; overflow-y: auto; font-size: 13px;
      color: light-dark(#222, #ddd);
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.id = "pcbw-tabs-wrapper";
  wrapper.style.display = "none"; // Hidden until show() is called

  const tabBar = document.createElement("div");
  tabBar.id = "pcbw-tabs-bar";

  const contentArea = document.createElement("div");
  contentArea.id = "pcbw-tabs-content";

  wrapper.appendChild(tabBar);
  wrapper.appendChild(contentArea);
  document.body.appendChild(wrapper);

  const tabRegistry = new Map();

  function renderTabs() {
    tabBar.innerHTML = "";
    for (const [id, tab] of tabRegistry) {
      const btn = document.createElement("button");
      btn.className = "pcbw-tab-btn" + (id === activeTabId ? " pcbw-tab-active" : "");
      btn.textContent = tab.label;
      btn.addEventListener("click", () => api.selectTab(id));
      tabBar.appendChild(btn);
    }
    const active = tabRegistry.get(activeTabId);
    contentArea.innerHTML = active ? active.content : "";
  }

  function persist() {
    oc.thread.customData[NAMESPACE] = { activeTab: activeTabId };
  }

  // Register initial tabs
  for (const t of TABS) {
    tabRegistry.set(t.id, { label: t.label, content: t.content });
  }

  renderTabs();

  const api = {
    addTab(config) {
      if (!config.id) config.id = "tab-" + Date.now();
      tabRegistry.set(config.id, { label: config.label || "Tab", content: config.content || "" });
      renderTabs();
    },
    removeTab(id) {
      tabRegistry.delete(id);
      if (activeTabId === id) {
        const first = tabRegistry.keys().next().value;
        activeTabId = first || "";
      }
      renderTabs();
      persist();
    },
    selectTab(id) {
      if (!tabRegistry.has(id)) return;
      activeTabId = id;
      renderTabs();
      persist();
    },
    setTabContent(id, html) {
      const tab = tabRegistry.get(id);
      if (tab) { tab.content = html; if (id === activeTabId) contentArea.innerHTML = html; }
    },
    show() { wrapper.style.display = "flex"; },
    hide() { wrapper.style.display = "none"; }
  };

  window.__pcbw_tabs = api;
  console.log("[pcbw-tabs] Tabbed panel loaded.");
})();

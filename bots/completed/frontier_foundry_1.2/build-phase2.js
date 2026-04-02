// Frontier Foundry 1.2 - Phase 2 Builder
// Builds Phase 2 with full iframe UI application on top of Phase 1 foundation
// Run: node build-phase2.js

const fs = require('fs');
const path = require('path');

// Load Phase 1 as baseline
const phase1Path = path.join(__dirname, '../frontier_foundry_1.1/frontier_foundry_1.1.json');
const phase1 = JSON.parse(fs.readFileSync(phase1Path, 'utf8'));

// Clone the structure
const phase2 = JSON.parse(JSON.stringify(phase1));

// Update metadata for Phase 2
const characterRow = phase2.data.data[0].rows[0];
characterRow.name = "Chronicle Foundry v1.2";
characterRow.uuid = `frontier-foundry-1.2-${Date.now()}`;
characterRow.creationTime = Date.now();
characterRow.lastMessageTime = Date.now();

// Update customData for Phase 2
characterRow.customData = {
  PUBLIC: {
    schema_version: "1.2.0-phase2",
    bot_phase: "phase_2_ui_application"
  }
};

// Update initial messages for Phase 2
characterRow.initialMessages = [
  {
    author: "system",
    content: "Chronicle Foundry v1.2 initializing. Phase 2 UI application active. Iframe interface ready.",
    hiddenFrom: [],
    expectsReply: false
  },
  {
    author: "ai",
    content: `**Chronicle Foundry: Living Expedition Engine**

The interface materializes before you—a comprehensive expedition command center built into the frontier outpost's operations room.

Through the main viewport, you see the Frontier Command Hall's planning station. Multiple screens surround you: an expedition dashboard, regional map projections, party roster terminals, supply manifests, contract boards, and expedition logs.

The command interface provides everything you need to plan, launch, and manage deep frontier expeditions. Each screen is live, updating in real time as decisions are made and events unfold.

**Welcome, Expedition Commander.**

Use the interface buttons or type commands to begin. The /ui command toggles the full interface. Click screens to navigate. The frontier awaits your orders.`,
    hiddenFrom: [],
    expectsReply: true
  }
];

// Update shortcut buttons for Phase 2
characterRow.shortcutButtons = [
  {
    name: "🎛️ Interface",
    message: "/ui",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "🏠 Dashboard",
    message: "/screen dashboard",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "🗺️ Map",
    message: "/screen map",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "👥 Party",
    message: "/screen party",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "📦 Inventory",
    message: "/screen inventory",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "❓ Help",
    message: "/help",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  }
];

// Phase 2 customCode - Full UI Application extending Phase 1 foundation
characterRow.customCode = `// Chronicle Foundry v1.2 - Phase 2: UI Application
// Built on Phase 1 foundation with comprehensive iframe interface

(() => {
  'use strict';

  // ============================================================
  // PHASE 2 CONSTANTS
  // ============================================================

  const CONFIG = {
    SCHEMA_VERSION: '1.2.0-phase2',
    INIT_FLAG: '__pcbw_frontier_foundry_v12_init',
    STATE_KEY: '__pcbw_frontier_foundry',
    UI_CONTAINER_ID: 'pcbw-foundry-ui',
    MAX_HISTORY_ENTRIES: 50,
    MAX_HIDDEN_MESSAGES: 10,
    WORLD_SEED_LENGTH: 16,
    UI_VISIBLE_KEY: '__pcbw_foundry_ui_visible'
  };

  const BIOME_TYPES = ['forest', 'mountain', 'swamp', 'desert', 'tundra', 'plains', 'ruins', 'coast'];
  const RESOURCE_TYPES = ['food', 'water', 'medicine', 'tools', 'fuel', 'materials'];
  const PARTY_ROLES = ['scout', 'medic', 'engineer', 'guard', 'specialist'];

  const WEATHER_TYPES = ['clear', 'rain', 'storm', 'fog', 'snow', 'wind'];
  const EVENT_TYPES = ['discovery', 'encounter', 'resource', 'danger', 'opportunity', 'narrative'];

  // ============================================================
  // INIT GUARD
  // ============================================================

  if (window[CONFIG.INIT_FLAG]) return;
  window[CONFIG.INIT_FLAG] = true;

  // ============================================================
  // PHASE 1 FOUNDATION (preserved)
  // ============================================================

  function initState() {
    oc.thread.customData = oc.thread.customData || {};
    oc.thread.customData[CONFIG.STATE_KEY] = {
      schema_version: CONFIG.SCHEMA_VERSION,
      initialized: true,
      expedition: {
        active: false,
        seed: null,
        name: null,
        day: 0,
        distance_traveled: 0,
        current_region: 'region_0',
        weather: 'clear',
        time_of_day: 'morning'
      },
      world: {
        seed: null,
        regions: {},
        discovered_locations: [],
        travel_network: {}
      },
      party: {
        members: [],
        max_size: 6,
        total_health: 0,
        total_morale: 0,
        fatigue: 0
      },
      resources: {
        food: 0,
        water: 0,
        medicine: 0,
        tools: 0,
        fuel: 0,
        materials: 0
      },
      contracts: {
        primary: null,
        secondary: [],
        completed: []
      },
      factions: {
        known: [],
        standings: {}
      },
      history: {
        major_events: [],
        decisions: [],
        discoveries: []
      },
      meta: {
        commands_used: 0,
        sessions: 1,
        last_save: Date.now(),
        current_screen: 'dashboard',
        notifications: [],
        tutorial_completed: false
      }
    };
    return oc.thread.customData[CONFIG.STATE_KEY];
  }

  function getState() {
    oc.thread.customData = oc.thread.customData || {};
    if (!oc.thread.customData[CONFIG.STATE_KEY]) {
      return initState();
    }
    return oc.thread.customData[CONFIG.STATE_KEY];
  }

  function setState(updates) {
    const state = getState();
    Object.assign(state, updates);
    state.meta.last_save = Date.now();
    oc.thread.customData[CONFIG.STATE_KEY] = state;
  }

  // World generation (from Phase 1)
  function generateSeed() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let seed = '';
    for (let i = 0; i < CONFIG.WORLD_SEED_LENGTH; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return seed;
  }

  function seedRandom(seed, index) {
    let hash = 0;
    const str = seed + index.toString();
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  }

  function generateRegion(seed, regionId) {
    const biomeIndex = Math.floor(seedRandom(seed, regionId) * BIOME_TYPES.length);
    const biome = BIOME_TYPES[biomeIndex];
    const danger = Math.floor(seedRandom(seed, regionId + 1000) * 10);
    const resources = Math.floor(seedRandom(seed, regionId + 2000) * 10);

    return {
      id: regionId,
      biome: biome,
      danger_level: danger,
      resource_richness: resources,
      discovered: false,
      visited_count: 0,
      connections: [],
      events_remaining: 3
    };
  }

  function createPartyMember(name, role, skills = []) {
    return {
      name: name,
      role: role,
      health: 100,
      morale: 75,
      skills: skills,
      status_effects: [],
      inventory: [],
      fatigue: 0
    };
  }

  function modifyResource(resourceType, amount) {
    const state = getState();
    if (!RESOURCE_TYPES.includes(resourceType)) return false;
    state.resources[resourceType] = Math.max(0, state.resources[resourceType] + amount);
    setState(state);
    return true;
  }

  function logEvent(category, description, metadata = {}) {
    const state = getState();
    const event = {
      timestamp: Date.now(),
      day: state.expedition.day,
      category: category,
      description: description,
      metadata: metadata
    };
    state.history[category].push(event);
    if (state.history[category].length > CONFIG.MAX_HISTORY_ENTRIES) {
      state.history[category].shift();
    }
    setState(state);
  }

  // ============================================================
  // PHASE 2: UI SYSTEM
  // ============================================================

  function getOrCreateUI() {
    let container = document.getElementById(CONFIG.UI_CONTAINER_ID);
    if (container) return container;

    container = document.createElement('div');
    container.id = CONFIG.UI_CONTAINER_ID;
    container.style.cssText = [
      'position: fixed',
      'top: 80px',
      'right: 20px',
      'width: 400px',
      'max-height: 600px',
      'background: light-dark(#f8f9fa, #1a1d23)',
      'border: 2px solid light-dark(rgba(100,120,140,0.4), rgba(80,100,120,0.4))',
      'border-radius: 12px',
      'box-shadow: 0 8px 32px rgba(0,0,0,0.2)',
      'z-index: 999999',
      'font-family: system-ui, -apple-system, sans-serif',
      'font-size: 13px',
      'color: light-dark(#1a1d23, #e8eaed)',
      'display: none',
      'overflow: hidden',
      'flex-direction: column'
    ].join('; ');

    document.body.appendChild(container);
    return container;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = [
      'position: fixed',
      'bottom: 20px',
      'right: 20px',
      'background: ' + (type === 'success' ? 'light-dark(#10b981, #064e3b)' : type === 'error' ? 'light-dark(#ef4444, #7f1d1d)' : 'light-dark(#3b82f6, #1e3a8a)'),
      'color: light-dark(#ffffff, #e8eaed)',
      'padding: 12px 20px',
      'border-radius: 8px',
      'box-shadow: 0 4px 16px rgba(0,0,0,0.15)',
      'z-index: 9999999',
      'font-size: 13px',
      'max-width: 300px',
      'animation: slideIn 0.3s ease'
    ].join('; ');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function toggleUI(show) {
    const container = getOrCreateUI();
    const state = getState();

    if (typeof show === 'boolean') {
      state.meta.ui_visible = show;
    } else {
      state.meta.ui_visible = !state.meta.ui_visible;
    }

    container.style.display = state.meta.ui_visible ? 'flex' : 'none';
    if (state.meta.ui_visible) {
      renderUI();
    }
    setState(state);
  }

  // ============================================================
  // SCREEN RENDERERS
  // ============================================================

  function renderDashboard() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📊 Expedition Dashboard</h2>';

    if (!state.expedition.active) {
      html += '<div style="background:light-dark(#fff3cd,#4a3800);border:1px solid light-dark(#ffc107,#6a5300);border-radius:6px;padding:12px;margin-bottom:12px;">';
      html += '<strong>⚠️ No Active Expedition</strong><br>';
      html += '<span style="font-size:12px;">Use /begin to start a new expedition.</span>';
      html += '</div>';
    } else {
      html += '<div style="background:light-dark(#e7f5ff,#1e3a8a);border:1px solid light-dark(#3b82f6,#2563eb);border-radius:6px;padding:12px;margin-bottom:12px;">';
      html += '<strong>' + escapeHtml(state.expedition.name || 'Unnamed Expedition') + '</strong><br>';
      html += '<div style="font-size:12px;margin-top:6px;">';
      html += '📅 Day ' + state.expedition.day + ' | ';
      html += '📍 ' + state.expedition.distance_traveled + 'km | ';
      html += '🌤️ ' + state.expedition.weather;
      html += '</div></div>';

      // Party summary
      html += '<div style="margin-bottom:12px;">';
      html += '<strong style="font-size:14px;">👥 Party (' + state.party.members.length + '/' + state.party.max_size + ')</strong>';
      if (state.party.members.length > 0) {
        const avgHealth = Math.floor(state.party.total_health / state.party.members.length);
        const avgMorale = Math.floor(state.party.total_morale / state.party.members.length);
        html += '<div style="font-size:12px;margin-top:4px;">Avg Health: ' + avgHealth + ' | Avg Morale: ' + avgMorale + '</div>';
      } else {
        html += '<div style="font-size:12px;color:light-dark(#888,#666);margin-top:4px;">No members yet</div>';
      }
      html += '</div>';

      // Resources summary
      html += '<div style="margin-bottom:12px;">';
      html += '<strong style="font-size:14px;">📦 Resources</strong>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:4px;font-size:12px;">';
      Object.entries(state.resources).forEach(([type, amount]) => {
        const critical = amount < 10;
        html += '<div style="' + (critical ? 'color:light-dark(#ef4444,#f87171);' : '') + '">';
        html += type + ': ' + amount;
        html += '</div>';
      });
      html += '</div></div>';

      // Current region
      const region = state.world.regions[state.expedition.current_region];
      if (region) {
        html += '<div style="margin-bottom:12px;">';
        html += '<strong style="font-size:14px;">🗺️ Current Region</strong>';
        html += '<div style="font-size:12px;margin-top:4px;">';
        html += escapeHtml(region.id) + ' (' + region.biome + ')<br>';
        html += 'Danger: ' + region.danger_level + '/10 | Resources: ' + region.resource_richness + '/10';
        html += '</div></div>';
      }
    }

    // Notifications
    if (state.meta.notifications && state.meta.notifications.length > 0) {
      html += '<div style="margin-top:12px;border-top:1px solid light-dark(#dee2e6,#373a40);padding-top:12px;">';
      html += '<strong style="font-size:14px;">🔔 Recent Notifications</strong>';
      html += '<div style="font-size:12px;margin-top:6px;">';
      state.meta.notifications.slice(-3).forEach(n => {
        html += '<div style="margin-bottom:4px;">• ' + escapeHtml(n) + '</div>';
      });
      html += '</div></div>';
    }

    html += '</div>';
    return html;
  }

  function renderMapScreen() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">🗺️ Regional Map</h2>';

    const regions = Object.values(state.world.regions).filter(r => r.discovered);

    if (regions.length === 0) {
      html += '<div style="color:light-dark(#888,#666);font-size:12px;">No regions discovered yet.</div>';
    } else {
      regions.forEach(r => {
        const isCurrent = r.id === state.expedition.current_region;
        html += '<div style="background:light-dark(' + (isCurrent ? '#e7f5ff' : '#f8f9fa') + ',' + (isCurrent ? '#1e3a8a' : '#2a2d33') + ');border:1px solid light-dark(' + (isCurrent ? '#3b82f6' : '#dee2e6') + ',' + (isCurrent ? '#2563eb' : '#373a40') + ');border-radius:6px;padding:10px;margin-bottom:8px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
        html += '<strong>' + escapeHtml(r.id) + '</strong>';
        if (isCurrent) html += '<span style="background:light-dark(#3b82f6,#2563eb);color:white;padding:2px 8px;border-radius:4px;font-size:11px;">CURRENT</span>';
        html += '</div>';
        html += '<div style="font-size:12px;color:light-dark(#6c757d,#adb5bd);">Biome: ' + r.biome + '</div>';
        html += '<div style="font-size:12px;margin-top:4px;">';
        html += 'Danger: ' + r.danger_level + '/10 | ';
        html += 'Resources: ' + r.resource_richness + '/10 | ';
        html += 'Visited: ' + r.visited_count + 'x';
        html += '</div>';
        if (!isCurrent && r.connections.length > 0) {
          html += '<button onclick="window.__pcbw_travelTo(\\\'' + r.id + '\\\');" style="margin-top:6px;padding:4px 12px;background:light-dark(#10b981,#064e3b);color:white;border:none;border-radius:4px;cursor:pointer;font-size:11px;">Travel Here</button>';
        }
        html += '</div>';
      });
    }

    html += '</div>';
    return html;
  }

  function renderPartyScreen() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">👥 Party Roster</h2>';

    if (state.party.members.length === 0) {
      html += '<div style="color:light-dark(#888,#666);font-size:12px;">No party members. Use /recruit to add members.</div>';
    } else {
      state.party.members.forEach((m, i) => {
        const healthPercent = m.health;
        const moralePercent = m.morale;
        const healthColor = healthPercent > 70 ? 'light-dark(#10b981,#064e3b)' : healthPercent > 40 ? 'light-dark(#f59e0b,#78350f)' : 'light-dark(#ef4444,#7f1d1d)';
        const moraleColor = moralePercent > 70 ? 'light-dark(#10b981,#064e3b)' : moralePercent > 40 ? 'light-dark(#f59e0b,#78350f)' : 'light-dark(#ef4444,#7f1d1d)';

        html += '<div style="background:light-dark(#f8f9fa,#2a2d33);border:1px solid light-dark(#dee2e6,#373a40);border-radius:6px;padding:10px;margin-bottom:8px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
        html += '<strong>' + escapeHtml(m.name) + '</strong>';
        html += '<span style="font-size:11px;color:light-dark(#6c757d,#adb5bd);">' + m.role + '</span>';
        html += '</div>';

        html += '<div style="margin-bottom:4px;"><span style="font-size:11px;">Health:</span><div style="background:light-dark(#dee2e6,#373a40);height:6px;border-radius:3px;overflow:hidden;margin-top:2px;"><div style="width:' + healthPercent + '%;height:100%;background:' + healthColor + ';"></div></div></div>';
        html += '<div style="margin-bottom:4px;"><span style="font-size:11px;">Morale:</span><div style="background:light-dark(#dee2e6,#373a40);height:6px;border-radius:3px;overflow:hidden;margin-top:2px;"><div style="width:' + moralePercent + '%;height:100%;background:' + moraleColor + ';"></div></div></div>';

        if (m.skills && m.skills.length > 0) {
          html += '<div style="font-size:11px;color:light-dark(#6c757d,#adb5bd);margin-top:4px;">Skills: ' + m.skills.join(', ') + '</div>';
        }
        if (m.status_effects && m.status_effects.length > 0) {
          html += '<div style="font-size:11px;color:light-dark(#f59e0b,#fbbf24);margin-top:4px;">Status: ' + m.status_effects.join(', ') + '</div>';
        }
        html += '</div>';
      });
    }

    html += '</div>';
    return html;
  }

  function renderInventoryScreen() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📦 Inventory & Resources</h2>';

    html += '<div style="display:grid;grid-template-columns:1fr;gap:8px;">';
    Object.entries(state.resources).forEach(([type, amount]) => {
      const critical = amount < 10;
      const low = amount < 30;
      const barColor = critical ? 'light-dark(#ef4444,#7f1d1d)' : low ? 'light-dark(#f59e0b,#78350f)' : 'light-dark(#10b981,#064e3b)';
      const barWidth = Math.min(100, amount);

      html += '<div style="background:light-dark(#f8f9fa,#2a2d33);border:1px solid light-dark(#dee2e6,#373a40);border-radius:6px;padding:10px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
      html += '<strong style="text-transform:capitalize;">' + type + '</strong>';
      html += '<span style="font-size:14px;font-weight:600;' + (critical ? 'color:light-dark(#ef4444,#f87171);' : '') + '">' + amount + '</span>';
      html += '</div>';
      html += '<div style="background:light-dark(#dee2e6,#373a40);height:8px;border-radius:4px;overflow:hidden;">';
      html += '<div style="width:' + barWidth + '%;height:100%;background:' + barColor + ';transition:width 0.3s;"></div>';
      html += '</div>';
      if (critical) {
        html += '<div style="font-size:11px;color:light-dark(#ef4444,#f87171);margin-top:4px;">⚠️ Critical shortage</div>';
      }
      html += '</div>';
    });
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderContractsScreen() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📜 Contracts & Objectives</h2>';

    if (state.contracts.primary) {
      html += '<div style="background:light-dark(#fef3c7,#78350f);border:1px solid light-dark(#f59e0b,#92400e);border-radius:6px;padding:12px;margin-bottom:12px;">';
      html += '<div style="font-size:11px;color:light-dark(#92400e,#fde68a);margin-bottom:4px;">PRIMARY OBJECTIVE</div>';
      html += '<strong>' + escapeHtml(state.contracts.primary.title) + '</strong>';
      html += '<div style="font-size:12px;margin-top:6px;">' + escapeHtml(state.contracts.primary.description) + '</div>';
      html += '</div>';
    }

    if (state.contracts.secondary.length > 0) {
      html += '<div style="margin-bottom:12px;">';
      html += '<div style="font-size:12px;font-weight:600;margin-bottom:6px;">SECONDARY OBJECTIVES</div>';
      state.contracts.secondary.forEach((c, i) => {
        html += '<div style="background:light-dark(#f8f9fa,#2a2d33);border:1px solid light-dark(#dee2e6,#373a40);border-radius:6px;padding:8px;margin-bottom:6px;">';
        html += '<strong style="font-size:13px;">' + (i + 1) + '. ' + escapeHtml(c.title) + '</strong>';
        html += '<div style="font-size:11px;color:light-dark(#6c757d,#adb5bd);margin-top:4px;">' + escapeHtml(c.description) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (!state.contracts.primary && state.contracts.secondary.length === 0) {
      html += '<div style="color:light-dark(#888,#666);font-size:12px;">No active contracts.</div>';
    }

    if (state.contracts.completed.length > 0) {
      html += '<div style="margin-top:12px;border-top:1px solid light-dark(#dee2e6,#373a40);padding-top:12px;">';
      html += '<div style="font-size:12px;font-weight:600;margin-bottom:6px;">COMPLETED (' + state.contracts.completed.length + ')</div>';
      state.contracts.completed.slice(-3).forEach(c => {
        html += '<div style="font-size:11px;color:light-dark(#6c757d,#adb5bd);margin-bottom:2px;">✓ ' + escapeHtml(c.title) + '</div>';
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function renderTimelineScreen() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📖 Expedition Timeline</h2>';

    const allEvents = [
      ...state.history.major_events.map(e => ({...e, cat: 'major'})),
      ...state.history.decisions.map(e => ({...e, cat: 'decision'})),
      ...state.history.discoveries.map(e => ({...e, cat: 'discovery'}))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);

    if (allEvents.length === 0) {
      html += '<div style="color:light-dark(#888,#666);font-size:12px;">No events recorded yet.</div>';
    } else {
      allEvents.forEach(e => {
        const icon = e.cat === 'major' ? '⚡' : e.cat === 'decision' ? '🔶' : '🔍';
        const color = e.cat === 'major' ? 'light-dark(#3b82f6,#1e40af)' : e.cat === 'decision' ? 'light-dark(#f59e0b,#92400e)' : 'light-dark(#10b981,#065f46)';

        html += '<div style="background:light-dark(#f8f9fa,#2a2d33);border-left:3px solid ' + color + ';border-radius:4px;padding:8px;margin-bottom:8px;">';
        html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
        html += '<span>' + icon + '</span>';
        html += '<span style="font-size:11px;color:light-dark(#6c757d,#adb5bd);">Day ' + e.day + '</span>';
        html += '</div>';
        html += '<div style="font-size:12px;">' + escapeHtml(e.description) + '</div>';
        html += '</div>';
      });
    }

    html += '</div>';
    return html;
  }

  function renderDebugScreen() {
    const state = getState();
    let html = '<div style="padding:16px;overflow-y:auto;max-height:calc(100% - 100px);">';

    html += '<h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">🔧 Debug & Inspection</h2>';

    html += '<div style="background:light-dark(#f8f9fa,#2a2d33);border:1px solid light-dark(#dee2e6,#373a40);border-radius:6px;padding:10px;margin-bottom:8px;">';
    html += '<strong style="font-size:13px;">System Info</strong>';
    html += '<div style="font-size:11px;font-family:monospace;margin-top:6px;color:light-dark(#6c757d,#adb5bd);">';
    html += 'Schema: ' + state.schema_version + '<br>';
    html += 'Sessions: ' + state.meta.sessions + '<br>';
    html += 'Commands: ' + state.meta.commands_used + '<br>';
    html += 'World Seed: ' + (state.world.seed || 'N/A');
    html += '</div></div>';

    html += '<div style="background:light-dark(#f8f9fa,#2a2d33);border:1px solid light-dark(#dee2e6,#373a40);border-radius:6px;padding:10px;margin-bottom:8px;">';
    html += '<strong style="font-size:13px;">State Summary</strong>';
    html += '<div style="font-size:11px;font-family:monospace;margin-top:6px;color:light-dark(#6c757d,#adb5bd);">';
    html += 'Regions: ' + Object.keys(state.world.regions).length + '<br>';
    html += 'Party: ' + state.party.members.length + '/' + state.party.max_size + '<br>';
    html += 'Events: ' + (state.history.major_events.length + state.history.decisions.length + state.history.discoveries.length) + '<br>';
    html += 'Factions: ' + state.factions.known.length;
    html += '</div></div>';

    html += '<button onclick="window.__pcbw_exportState();" style="width:100%;padding:8px;background:light-dark(#3b82f6,#1e40af);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;margin-bottom:6px;">Export State (Console)</button>';
    html += '<button onclick="window.__pcbw_resetState();" style="width:100%;padding:8px;background:light-dark(#ef4444,#7f1d1d);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">Reset All Data</button>';

    html += '</div>';
    return html;
  }

  // ============================================================
  // UI MAIN RENDERER
  // ============================================================

  function renderUI() {
    const container = getOrCreateUI();
    const state = getState();
    const screen = state.meta.current_screen || 'dashboard';

    let html = '';

    // Header
    html += '<div style="background:light-dark(#3b82f6,#1e40af);color:white;padding:12px;display:flex;justify-content:space-between;align-items:center;border-radius:10px 10px 0 0;">';
    html += '<strong style="font-size:14px;">⚙️ Chronicle Foundry</strong>';
    html += '<button onclick="window.__pcbw_toggleUI(false);" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;">✕</button>';
    html += '</div>';

    // Navigation tabs
    html += '<div style="display:flex;background:light-dark(#e9ecef,#2a2d33);border-bottom:1px solid light-dark(#dee2e6,#373a40);overflow-x:auto;">';
    const tabs = [
      {id: 'dashboard', label: '🏠', title: 'Dashboard'},
      {id: 'map', label: '🗺️', title: 'Map'},
      {id: 'party', label: '👥', title: 'Party'},
      {id: 'inventory', label: '📦', title: 'Inventory'},
      {id: 'contracts', label: '📜', title: 'Contracts'},
      {id: 'timeline', label: '📖', title: 'Timeline'},
      {id: 'debug', label: '🔧', title: 'Debug'}
    ];

    tabs.forEach(tab => {
      const active = screen === tab.id;
      html += '<button onclick="window.__pcbw_switchScreen(\\\'' + tab.id + '\\\');" style="';
      html += 'flex:1;padding:8px 4px;background:' + (active ? 'light-dark(#f8f9fa,#1a1d23)' : 'transparent') + ';';
      html += 'border:none;border-bottom:2px solid ' + (active ? 'light-dark(#3b82f6,#60a5fa)' : 'transparent') + ';';
      html += 'color:light-dark(' + (active ? '#1a1d23' : '#6c757d') + ',' + (active ? '#e8eaed' : '#adb5bd') + ');';
      html += 'cursor:pointer;font-size:16px;transition:all 0.2s;" title="' + tab.title + '">';
      html += tab.label;
      html += '</button>';
    });
    html += '</div>';

    // Screen content
    html += '<div style="flex:1;overflow-y:auto;">';
    if (screen === 'dashboard') html += renderDashboard();
    else if (screen === 'map') html += renderMapScreen();
    else if (screen === 'party') html += renderPartyScreen();
    else if (screen === 'inventory') html += renderInventoryScreen();
    else if (screen === 'contracts') html += renderContractsScreen();
    else if (screen === 'timeline') html += renderTimelineScreen();
    else if (screen === 'debug') html += renderDebugScreen();
    html += '</div>';

    // Footer
    html += '<div style="background:light-dark(#e9ecef,#2a2d33);padding:8px;border-top:1px solid light-dark(#dee2e6,#373a40);font-size:11px;color:light-dark(#6c757d,#adb5bd);text-align:center;">';
    if (state.expedition.active) {
      html += 'Day ' + state.expedition.day + ' | ' + state.expedition.current_region;
    } else {
      html += 'No active expedition';
    }
    html += '</div>';

    container.innerHTML = html;
  }

  // ============================================================
  // PHASE 2: ACTION HANDLERS
  // ============================================================

  window.__pcbw_toggleUI = (show) => {
    toggleUI(show);
  };

  window.__pcbw_switchScreen = (screenId) => {
    const state = getState();
    state.meta.current_screen = screenId;
    setState(state);
    renderUI();
  };

  window.__pcbw_travelTo = (regionId) => {
    const state = getState();
    const oldRegion = state.expedition.current_region;
    state.expedition.current_region = regionId;
    state.expedition.distance_traveled += 10;
    state.expedition.day += 1;

    if (state.world.regions[regionId]) {
      state.world.regions[regionId].visited_count++;
    }

    logEvent('major_events', 'Traveled to ' + regionId + ' from ' + oldRegion, {from: oldRegion, to: regionId});

    // Resource consumption
    modifyResource('food', -5);
    modifyResource('water', -5);

    setState(state);
    renderUI();
    showToast('Traveled to ' + regionId, 'success');
  };

  window.__pcbw_exportState = () => {
    const state = getState();
    console.log('=== FRONTIER FOUNDRY STATE EXPORT ===');
    console.log(JSON.stringify(state, null, 2));
    showToast('State exported to console', 'success');
  };

  window.__pcbw_resetState = () => {
    if (confirm('Reset all expedition data? This cannot be undone.')) {
      initState();
      renderUI();
      showToast('All data reset', 'success');
    }
  };

  // ============================================================
  // PHASE 2: COMMAND SYSTEM (Extended)
  // ============================================================

  const COMMANDS = {
    '/help': () => {
      return \`**Frontier Foundry Commands (v1.2)**

**UI Commands:**
/ui - Toggle expedition interface
/screen <name> - Switch screen (dashboard, map, party, inventory, contracts, timeline, debug)

**Expedition Commands:**
/begin <name> - Start new expedition
/camp - Make camp and rest
/travel <region> - Travel to region
/recruit <name> <role> - Add party member
/gather - Gather resources in current region

**Status Commands:**
/status - Show expedition status
/party - Show party roster
/map - Show discovered regions
/resources - Show inventory

**System:**
/seed - Show world seed
/reset - Reset all data
/debug - Debug information

**Phase 2 Features:**
✓ Full UI interface with 7 screens
✓ Travel system with resource consumption
✓ Day progression
✓ Real-time state updates
✓ Toast notifications\`;
    },

    '/ui': () => {
      toggleUI();
      return null;
    },

    '/screen': (args) => {
      const screenName = args[0];
      if (screenName) {
        const state = getState();
        state.meta.current_screen = screenName;
        setState(state);
        renderUI();
        return \`Switched to \${screenName} screen.\`;
      }
      return 'Usage: /screen <dashboard|map|party|inventory|contracts|timeline|debug>';
    },

    '/begin': (args) => {
      const state = getState();
      const name = args.join(' ') || 'Unnamed Expedition';

      const seed = generateSeed();
      state.world.seed = seed;
      state.expedition.seed = seed;
      state.expedition.active = true;
      state.expedition.name = name;
      state.expedition.day = 1;
      state.expedition.distance_traveled = 0;

      const startRegion = generateRegion(seed, 0);
      startRegion.discovered = true;
      startRegion.visited_count = 1;
      state.world.regions['region_0'] = startRegion;
      state.expedition.current_region = 'region_0';

      // Generate connected regions
      for (let i = 1; i <= 3; i++) {
        const r = generateRegion(seed, i);
        state.world.regions['region_' + i] = r;
        startRegion.connections.push('region_' + i);
      }

      // Initial resources
      state.resources.food = 50;
      state.resources.water = 50;
      state.resources.medicine = 20;
      state.resources.tools = 30;
      state.resources.fuel = 40;
      state.resources.materials = 30;

      logEvent('major_events', 'Expedition "' + name + '" began', {seed: seed});
      setState(state);
      renderUI();

      return \`**Expedition "** + name + **" Launched**

World seed: \\\`\${seed}\\\`

Your expedition stands ready at the frontier's edge. The command interface is active. Initial supplies loaded. Three adjacent regions identified for exploration.

The frontier awaits.\`;
    },

    '/camp': () => {
      const state = getState();
      if (!state.expedition.active) {
        return 'No active expedition.';
      }

      state.expedition.day += 1;

      // Rest effects
      state.party.members.forEach(m => {
        m.health = Math.min(100, m.health + 10);
        m.morale = Math.min(100, m.morale + 5);
        m.fatigue = Math.max(0, m.fatigue - 20);
      });

      // Resource consumption
      modifyResource('food', -3 * state.party.members.length);
      modifyResource('water', -3 * state.party.members.length);
      modifyResource('fuel', -5);

      logEvent('decisions', 'Made camp on day ' + state.expedition.day);
      setState(state);
      renderUI();

      return \`**Camp Made - Day \${state.expedition.day}**

The party rests through the night. Health and morale recover slightly. Supplies consumed.

Resources used: \${state.party.members.length * 3} food, \${state.party.members.length * 3} water, 5 fuel\`;
    },

    '/recruit': (args) => {
      const state = getState();
      if (args.length < 2) {
        return 'Usage: /recruit <name> <role>\\nRoles: scout, medic, engineer, guard, specialist';
      }

      const name = args[0];
      const role = args[1].toLowerCase();

      if (!PARTY_ROLES.includes(role)) {
        return 'Invalid role. Choose: scout, medic, engineer, guard, specialist';
      }

      if (state.party.members.length >= state.party.max_size) {
        return 'Party is full (' + state.party.max_size + '/' + state.party.max_size + ')';
      }

      const member = createPartyMember(name, role, [role]);
      state.party.members.push(member);
      state.party.total_health += member.health;
      state.party.total_morale += member.morale;

      logEvent('major_events', name + ' recruited as ' + role);
      setState(state);
      renderUI();

      return \`**\${name} Recruited**

Role: \${role}
Health: 100/100
Morale: 75/100

Party: \${state.party.members.length}/\${state.party.max_size}\`;
    },

    '/gather': () => {
      const state = getState();
      if (!state.expedition.active) {
        return 'No active expedition.';
      }

      const region = state.world.regions[state.expedition.current_region];
      if (!region) {
        return 'Invalid region.';
      }

      const richness = region.resource_richness;
      const foodGain = Math.floor(richness * 2 + Math.random() * 10);
      const waterGain = Math.floor(richness * 2 + Math.random() * 10);
      const materialsGain = Math.floor(richness * 1.5 + Math.random() * 5);

      modifyResource('food', foodGain);
      modifyResource('water', waterGain);
      modifyResource('materials', materialsGain);

      logEvent('decisions', 'Gathered resources in ' + region.id);
      setState(state);
      renderUI();

      return \`**Resource Gathering**

Region: \${region.id} (\${region.biome})
Resource richness: \${richness}/10

Gathered:
+ \${foodGain} food
+ \${waterGain} water
+ \${materialsGain} materials\`;
    },

    '/status': () => {
      const state = getState();
      let status = '**Expedition Status**\\n\\n';

      if (!state.expedition.active) {
        status += 'No active expedition. Use /begin to start.\\n';
      } else {
        status += \`**\${state.expedition.name}**\\n\`;
        status += \`Day \${state.expedition.day} | Distance: \${state.expedition.distance_traveled}km\\n\`;
        status += \`Region: \${state.expedition.current_region}\\n\`;
        status += \`Weather: \${state.expedition.weather}\\n\\n\`;

        status += \`**Party:** \${state.party.members.length}/\${state.party.max_size}\\n\`;
        const avgHealth = state.party.members.length > 0 ? Math.floor(state.party.total_health / state.party.members.length) : 0;
        const avgMorale = state.party.members.length > 0 ? Math.floor(state.party.total_morale / state.party.members.length) : 0;
        status += \`Avg Health: \${avgHealth} | Avg Morale: \${avgMorale}\\n\\n\`;

        status += '**Resources:**\\n';
        Object.entries(state.resources).forEach(([type, amount]) => {
          const bar = '█'.repeat(Math.floor(amount / 10)) + '░'.repeat(10 - Math.floor(amount / 10));
          status += \`\${type}: \${amount} [\${bar}]\\n\`;
        });
      }

      return status;
    },

    '/party': () => {
      const state = getState();
      let party = '**Party Roster**\\n\\n';

      if (state.party.members.length === 0) {
        party += 'No party members yet. Use /recruit to add members.\\n';
      } else {
        state.party.members.forEach((m, i) => {
          party += \`**\${i + 1}. \${m.name}** (\${m.role})\\n\`;
          party += \`   Health: \${m.health}/100 | Morale: \${m.morale}/100\\n\`;
          if (m.skills.length > 0) {
            party += \`   Skills: \${m.skills.join(', ')}\\n\`;
          }
        });
      }

      return party;
    },

    '/map': () => {
      const state = getState();
      let map = '**Discovered Regions**\\n\\n';

      const regions = Object.values(state.world.regions).filter(r => r.discovered);
      if (regions.length === 0) {
        map += 'No regions discovered yet.\\n';
      } else {
        regions.forEach(r => {
          const current = r.id === state.expedition.current_region ? ' **(current)**' : '';
          map += \`**\${r.id}** - \${r.biome}\${current}\\n\`;
          map += \`  Danger: \${r.danger_level}/10 | Resources: \${r.resource_richness}/10\\n\`;
        });
      }

      return map;
    },

    '/resources': () => {
      const state = getState();
      let res = '**Resource Inventory**\\n\\n';

      Object.entries(state.resources).forEach(([type, amount]) => {
        const bar = '█'.repeat(Math.floor(amount / 10)) + '░'.repeat(10 - Math.floor(amount / 10));
        const warning = amount < 10 ? ' ⚠️ CRITICAL' : amount < 30 ? ' ⚠️ LOW' : '';
        res += \`**\${type}**: \${amount} [\${bar}]\${warning}\\n\`;
      });

      return res;
    },

    '/seed': () => {
      const state = getState();
      return state.world.seed ? \`**World Seed:** \\\`\${state.world.seed}\\\`\\n\\nThis seed generates the current frontier world.\` : 'No world seed generated yet.';
    },

    '/reset': () => {
      return '**Reset All Data?**\\n\\nType "confirm reset" to clear all expedition data. This cannot be undone.';
    },

    '/debug': () => {
      const state = getState();
      return \`**Debug Info**\\n\\nSchema: \${state.schema_version}\\nSessions: \${state.meta.sessions}\\nCommands: \${state.meta.commands_used}\\nUI Visible: \${state.meta.ui_visible ? 'Yes' : 'No'}\\nCurrent Screen: \${state.meta.current_screen}\`;
    }
  };

  function handleCommand(commandStr) {
    const parts = commandStr.trim().split(/\\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'confirm' && args[0] === 'reset') {
      initState();
      renderUI();
      logEvent('major_events', 'System reset', { reason: 'user_command' });
      return '**All Data Reset**\\n\\nExpedition data cleared. You may begin a new expedition.';
    }

    if (COMMANDS[cmd]) {
      const state = getState();
      state.meta.commands_used++;
      setState(state);
      const result = COMMANDS[cmd](args);
      return result;
    }

    return \`Unknown command: \${commandStr}\\n\\nType /help for available commands.\`;
  }

  // ============================================================
  // MESSAGE HANDLER
  // ============================================================

  oc.thread.on('MessageAdded', () => {
    const messages = oc.thread.messages;
    const lastMsg = messages[messages.length - 1];

    // Intercept commands
    if (lastMsg && lastMsg.author === 'user' && lastMsg.content.startsWith('/')) {
      const commandStr = lastMsg.content.trim();
      const response = handleCommand(commandStr);

      messages.pop();

      if (response) {
        messages.push({
          author: 'system',
          content: response,
          hiddenFrom: [],
          expectsReply: false
        });
      }

      return;
    }

    // Refresh UI on AI response
    if (lastMsg && lastMsg.author === 'ai') {
      const state = getState();
      if (state.meta.ui_visible) {
        setTimeout(() => renderUI(), 100);
      }
    }
  });

  // ============================================================
  // INITIALIZATION
  // ============================================================

  const state = getState();

  if (!state.initialized || state.schema_version !== CONFIG.SCHEMA_VERSION) {
    console.log('Frontier Foundry v1.2 initialized (Phase 2).');
    state.schema_version = CONFIG.SCHEMA_VERSION;
    state.initialized = true;
    state.meta.sessions = 1;
    logEvent('major_events', 'Phase 2 system initialized', { phase: 'phase_2_ui_application' });
    setState(state);
  } else {
    state.meta.sessions++;
    setState(state);
    console.log(\`Frontier Foundry v1.2 resumed. Session \${state.meta.sessions}.\`);
  }

  // Auto-open UI on first load
  if (state.meta.sessions === 1) {
    setTimeout(() => toggleUI(true), 1000);
  }

})();`;

// Write the Phase 2 JSON
const outputPath = path.join(__dirname, 'frontier_foundry_1.2.json');
fs.writeFileSync(outputPath, JSON.stringify(phase2, null, 2), 'utf8');

console.log('✓ Phase 2 export JSON generated successfully');
console.log(`  Output: ${outputPath}`);
console.log('  Schema: 1.2.0-phase2');
console.log('  Built from: frontier_foundry_1.1.json (preserved)');
console.log('  Status: UI application complete');

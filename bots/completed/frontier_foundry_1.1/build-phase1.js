// Frontier Foundry 1.1 - Phase 1 Builder
// Programmatically builds the Phase 1 foundation export JSON
// Run: node build-phase1.js

const fs = require('fs');
const path = require('path');

// Load the minimal template
const templatePath = path.join(__dirname, '../../../bots/templates/perchance-empty-minimal.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

// Phase 1: Chronicle Foundry Living Expedition Engine - Foundation Pass

const characterRow = template.data.data[0].rows[0];

// Core identity
characterRow.name = "Chronicle Foundry v1.1";
characterRow.modelName = "openai-gpt-4o";
characterRow.temperature = 0.9;
characterRow.maxTokensPerMessage = 800;
characterRow.streamingResponse = true;

// Timestamps
const now = Date.now();
characterRow.creationTime = now;
characterRow.lastMessageTime = now;
characterRow.uuid = `frontier-foundry-1.1-${now}`;

// Role instruction - sets the world and style
characterRow.roleInstruction = `You are Chronicle Foundry, a living expedition management system embedded in a vast, procedurally coherent frontier world.

You are not a character. You are an engine that narrates expeditions, simulates world state, tracks resources, manages party members, enforces survival mechanics, and chronicles player choices.

## World Foundation
The Frontier is a massive unexplored region beyond known civilization. It contains diverse biomes (forest, mountain, swamp, desert, tundra, ruins), procedurally consistent geography, hidden resources, dynamic weather, and emergent dangers. Each location has a unique seed-derived identity that persists across visits.

## Your Core Responsibilities
1. Narrate expedition events in vivid second-person present tense
2. Maintain strict consistency with established world state
3. Track party status (health, morale, supplies, skills)
4. Simulate resource economics (scarcity, degradation, discovery)
5. Present meaningful survival choices with consequences
6. Chronicle all major decisions and outcomes to expedition history
7. Never break immersion; all mechanics operate through narrative

## Tone & Style
- Direct, atmospheric, present-tense narration
- No meta-commentary or "As an AI" disclaimers
- Choices presented as natural moments, not menus
- Failure states are narratively rich, not game-overs
- Discovery rewards curiosity; caution prevents disaster

## Response Structure (flexible)
1. Immediate situation (environment, party status, active threats/opportunities)
2. Available actions implied through narration
3. Resource/status changes integrated naturally
4. Expedition log updates when significant events occur

You adapt to user intent: if they want detailed mechanics, provide them; if they want pure narrative, embed mechanics invisibly.`;

// Reminder message - reinforced behavior
characterRow.reminderMessage = `Present tense. Second person. No meta-talk. Every choice has weight. Resources matter. The frontier is vast, dangerous, and real.`;

// Initial messages - set the stage
characterRow.initialMessages = [
  {
    author: "system",
    content: "Frontier Foundry initializing. Phase 1 foundation active. All core systems online.",
    hiddenFrom: [],
    expectsReply: false
  },
  {
    author: "ai",
    content: `**Expedition Initialization**

The Frontier Command Hall is quiet save for the crackling of the central brazier. Maps cover every wall—some accurate, most speculation. Your expedition charter lies on the oak table, unsigned.

Beyond the reinforced gates, the Frontier waits. No expedition has charted more than a hundred miles before supply failure, attrition, or worse forced retreat. Most never return.

Your objective: establish a forward outpost, chart viable routes, and return with proof the deep frontier is survivable.

**Expedition Status**
- Party: Not yet formed
- Supplies: Not yet procured
- Destination: Undecided
- World Seed: Awaiting generation

What is your first action?`,
    hiddenFrom: [],
    expectsReply: true
  }
];

// Shortcut buttons - Phase 1 baseline
characterRow.shortcutButtons = [
  {
    name: "📊 Status",
    message: "/status",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "🗺️ Map",
    message: "/map",
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

// CustomData - PUBLIC for share persistence
characterRow.customData = {
  PUBLIC: {
    schema_version: "1.1.0-phase1",
    bot_phase: "phase_1_foundation"
  }
};

// CustomCode - Phase 1 modular foundation
characterRow.customCode = `// Chronicle Foundry v1.1 - Phase 1 Foundation
// Modular expedition engine with persistence, world generation, and command system

(() => {
  'use strict';

  // ============================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================

  const CONFIG = {
    SCHEMA_VERSION: '1.1.0-phase1',
    INIT_FLAG: '__pcbw_frontier_foundry_init',
    STATE_KEY: '__pcbw_frontier_foundry',
    MAX_HISTORY_ENTRIES: 50,
    MAX_HIDDEN_MESSAGES: 10,
    WORLD_SEED_LENGTH: 16
  };

  const BIOME_TYPES = ['forest', 'mountain', 'swamp', 'desert', 'tundra', 'plains', 'ruins', 'coast'];
  const RESOURCE_TYPES = ['food', 'water', 'medicine', 'tools', 'fuel', 'materials'];
  const PARTY_ROLES = ['scout', 'medic', 'engineer', 'guard', 'specialist'];

  // ============================================================
  // INIT GUARD
  // ============================================================

  if (window[CONFIG.INIT_FLAG]) return;
  window[CONFIG.INIT_FLAG] = true;

  // ============================================================
  // STATE SCHEMA & DEFAULTS
  // ============================================================

  const DEFAULT_STATE = {
    schema_version: CONFIG.SCHEMA_VERSION,
    initialized: false,
    expedition: {
      active: false,
      seed: null,
      name: null,
      day: 0,
      distance_traveled: 0,
      current_region: null
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
      total_morale: 0
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
      sessions: 0,
      last_save: Date.now()
    }
  };

  // ============================================================
  // STORAGE HELPERS
  // ============================================================

  function initState() {
    oc.thread.customData[CONFIG.STATE_KEY] = JSON.parse(JSON.stringify(DEFAULT_STATE));
    oc.thread.customData[CONFIG.STATE_KEY].initialized = true;
    oc.thread.customData[CONFIG.STATE_KEY].meta.sessions = 1;
    return oc.thread.customData[CONFIG.STATE_KEY];
  }

  function getState() {
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

  function migrateState(state) {
    // Phase 1: No migration needed yet; foundation schema
    if (state.schema_version !== CONFIG.SCHEMA_VERSION) {
      console.warn('Schema version mismatch. Phase 1 does not support migration.');
    }
    return state;
  }

  // ============================================================
  // WORLD GENERATION
  // ============================================================

  function generateSeed() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let seed = '';
    for (let i = 0; i < CONFIG.WORLD_SEED_LENGTH; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return seed;
  }

  function seedRandom(seed, index) {
    // Simple deterministic PRNG from seed + index
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
      connections: []
    };
  }

  function initializeWorld() {
    const state = getState();
    const seed = generateSeed();
    state.world.seed = seed;
    state.expedition.seed = seed;

    // Generate starting region
    const startRegion = generateRegion(seed, 0);
    startRegion.discovered = true;
    startRegion.visited_count = 1;
    state.world.regions['region_0'] = startRegion;
    state.expedition.current_region = 'region_0';

    setState(state);
    return seed;
  }

  // ============================================================
  // PARTY MANAGEMENT
  // ============================================================

  function createPartyMember(name, role, skills = []) {
    return {
      name: name,
      role: role,
      health: 100,
      morale: 75,
      skills: skills,
      status_effects: [],
      inventory: []
    };
  }

  function addPartyMember(member) {
    const state = getState();
    if (state.party.members.length >= state.party.max_size) {
      return false;
    }
    state.party.members.push(member);
    updatePartyTotals(state);
    setState(state);
    return true;
  }

  function updatePartyTotals(state) {
    state.party.total_health = state.party.members.reduce((sum, m) => sum + m.health, 0);
    state.party.total_morale = state.party.members.reduce((sum, m) => sum + m.morale, 0);
  }

  // ============================================================
  // RESOURCE MANAGEMENT
  // ============================================================

  function modifyResource(resourceType, amount) {
    const state = getState();
    if (!RESOURCE_TYPES.includes(resourceType)) {
      console.warn('Unknown resource type:', resourceType);
      return false;
    }
    state.resources[resourceType] = Math.max(0, state.resources[resourceType] + amount);
    setState(state);
    return true;
  }

  function getResourceStatus() {
    const state = getState();
    return Object.entries(state.resources)
      .map(([type, amount]) => \`\${type}: \${amount}\`)
      .join(', ');
  }

  // ============================================================
  // HISTORY & EVENT LOG
  // ============================================================

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

    // Cap history size
    if (state.history[category].length > CONFIG.MAX_HISTORY_ENTRIES) {
      state.history[category].shift();
    }

    setState(state);
  }

  // ============================================================
  // CONTRACTS & OBJECTIVES
  // ============================================================

  function createContract(title, description, objectives) {
    return {
      id: 'contract_' + Date.now(),
      title: title,
      description: description,
      objectives: objectives,
      status: 'active',
      progress: {},
      rewards: {}
    };
  }

  // ============================================================
  // FACTION SYSTEM
  // ============================================================

  function registerFaction(factionId, name, initialStanding = 0) {
    const state = getState();
    if (!state.factions.known.includes(factionId)) {
      state.factions.known.push(factionId);
      state.factions.standings[factionId] = {
        name: name,
        standing: initialStanding,
        interactions: 0
      };
      setState(state);
    }
  }

  // ============================================================
  // HIDDEN SYSTEM CONTEXT BUILDER
  // ============================================================

  function injectHiddenContext(content) {
    const messages = oc.thread.messages;
    const hiddenCount = messages.filter(m =>
      m.author === 'system' && m.hiddenFrom && m.hiddenFrom.includes('user')
    ).length;

    if (hiddenCount >= CONFIG.MAX_HIDDEN_MESSAGES) {
      // Remove oldest hidden message
      const oldestIndex = messages.findIndex(m =>
        m.author === 'system' && m.hiddenFrom && m.hiddenFrom.includes('user')
      );
      if (oldestIndex >= 0) {
        messages.splice(oldestIndex, 1);
      }
    }

    messages.push({
      author: 'system',
      content: content,
      hiddenFrom: ['user'],
      expectsReply: false,
      customData: { injected: Date.now() }
    });
  }

  function buildStateContext() {
    const state = getState();
    let context = '**Current Expedition State**\\n';

    if (state.expedition.active) {
      context += \`Day \${state.expedition.day} | Distance: \${state.expedition.distance_traveled}km\\n\`;
      context += \`Region: \${state.expedition.current_region || 'Unknown'}\\n\`;
      context += \`Party: \${state.party.members.length}/\${state.party.max_size} members\\n\`;
      context += \`Resources: \${getResourceStatus()}\\n\`;
    } else {
      context += 'No active expedition.\\n';
    }

    return context;
  }

  // ============================================================
  // COMMAND PARSER
  // ============================================================

  const COMMANDS = {
    '/help': () => {
      return \`**Frontier Foundry Commands**

/status - Show full expedition status
/map - Display discovered regions
/party - List party members
/resources - Show resource inventory
/contracts - List active objectives
/reset - Reset expedition (confirmation required)
/seed - Display current world seed
/debug - Show technical state info (dev)

**Phase 1 Foundation**
Core systems: ✓ World generation, ✓ Persistence, ✓ Party/resources, ✓ Commands
Phase 2+ systems: UI panels, advanced travel, combat, crafting\`;
    },

    '/status': () => {
      const state = getState();
      let status = '**Expedition Status**\\n\\n';

      if (!state.expedition.active) {
        status += 'No active expedition. Begin by forming a party and choosing a destination.\\n';
      } else {
        status += \`**Expedition:** \${state.expedition.name || 'Unnamed'}\\n\`;
        status += \`**Day:** \${state.expedition.day}\\n\`;
        status += \`**Distance Traveled:** \${state.expedition.distance_traveled} km\\n\`;
        status += \`**Current Region:** \${state.expedition.current_region}\\n\\n\`;

        status += \`**Party:** \${state.party.members.length}/\${state.party.max_size}\\n\`;
        state.party.members.forEach(m => {
          status += \`  - \${m.name} (\${m.role}): HP \${m.health}, Morale \${m.morale}\\n\`;
        });

        status += \`\\n**Resources:**\\n\`;
        Object.entries(state.resources).forEach(([type, amount]) => {
          status += \`  - \${type}: \${amount}\\n\`;
        });
      }

      return status;
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
          map += \`  Danger: \${r.danger_level}/10, Resources: \${r.resource_richness}/10\\n\`;
          map += \`  Visited: \${r.visited_count} time(s)\\n\`;
        });
      }

      return map;
    },

    '/party': () => {
      const state = getState();
      let party = '**Party Roster**\\n\\n';

      if (state.party.members.length === 0) {
        party += 'No party members yet.\\n';
      } else {
        state.party.members.forEach((m, i) => {
          party += \`**\${i + 1}. \${m.name}** (\${m.role})\\n\`;
          party += \`   Health: \${m.health}/100, Morale: \${m.morale}/100\\n\`;
          if (m.skills.length > 0) {
            party += \`   Skills: \${m.skills.join(', ')}\\n\`;
          }
          if (m.status_effects.length > 0) {
            party += \`   Status: \${m.status_effects.join(', ')}\\n\`;
          }
        });
      }

      return party;
    },

    '/resources': () => {
      const state = getState();
      let res = '**Resource Inventory**\\n\\n';

      Object.entries(state.resources).forEach(([type, amount]) => {
        const bar = '█'.repeat(Math.floor(amount / 10)) + '░'.repeat(10 - Math.floor(amount / 10));
        res += \`**\${type}**: \${amount} [\${bar}]\\n\`;
      });

      return res;
    },

    '/contracts': () => {
      const state = getState();
      let contracts = '**Active Objectives**\\n\\n';

      if (state.contracts.primary) {
        contracts += \`**Primary:** \${state.contracts.primary.title}\\n\`;
        contracts += \`\${state.contracts.primary.description}\\n\\n\`;
      }

      if (state.contracts.secondary.length > 0) {
        contracts += '**Secondary:**\\n';
        state.contracts.secondary.forEach((c, i) => {
          contracts += \`\${i + 1}. \${c.title}\\n\`;
        });
      } else {
        contracts += 'No active contracts.\\n';
      }

      return contracts;
    },

    '/seed': () => {
      const state = getState();
      return state.world.seed
        ? \`**World Seed:** \\\`\${state.world.seed}\\\`\\n\\nThis seed generates the current frontier world. Save it to return to this world later.\`
        : 'No world seed generated yet.';
    },

    '/reset': () => {
      return '**Reset Expedition?**\\n\\nType "confirm reset" to clear all expedition data and start fresh. This cannot be undone.';
    },

    '/debug': () => {
      const state = getState();
      return \`**Debug Info**\\n\\n\${JSON.stringify(state.meta, null, 2)}\`;
    }
  };

  function handleCommand(commandStr) {
    const cmd = commandStr.trim().toLowerCase();

    if (cmd === 'confirm reset') {
      initState();
      logEvent('major_events', 'Expedition reset', { reason: 'user_command' });
      return '**Expedition Reset**\\n\\nAll data cleared. You may begin a new expedition.';
    }

    if (COMMANDS[cmd]) {
      const state = getState();
      state.meta.commands_used++;
      setState(state);
      return COMMANDS[cmd]();
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

      // Remove command message
      messages.pop();

      // Add system response
      messages.push({
        author: 'system',
        content: response,
        hiddenFrom: [],
        expectsReply: false
      });

      return;
    }

    // State sync on every AI message
    if (lastMsg && lastMsg.author === 'ai') {
      const state = getState();

      // Inject minimal state context for AI awareness
      if (state.expedition.active) {
        injectHiddenContext(buildStateContext());
      }
    }
  });

  // ============================================================
  // INITIALIZATION
  // ============================================================

  // Initialize state on first load
  const state = getState();

  if (!state.initialized) {
    console.log('Frontier Foundry Phase 1 initialized.');
    logEvent('major_events', 'System initialized', { phase: 'phase_1_foundation' });
  } else {
    state.meta.sessions++;
    setState(state);
    console.log(\`Frontier Foundry Phase 1 resumed. Session \${state.meta.sessions}.\`);
  }

})();`;

// Write the final JSON
const outputPath = path.join(__dirname, 'frontier_foundry_1.1.json');
fs.writeFileSync(outputPath, JSON.stringify(template, null, 2), 'utf8');

console.log('✓ Phase 1 export JSON generated successfully');
console.log(`  Output: ${outputPath}`);
console.log('  Schema: 1.1.0-phase1');
console.log('  Status: Foundation pass complete');

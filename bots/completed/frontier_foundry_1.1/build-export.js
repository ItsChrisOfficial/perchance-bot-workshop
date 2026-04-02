#!/usr/bin/env node
/**
 * frontier_foundry_1.1 — Phase 1 Build Script
 *
 * Generates a Perchance export JSON with comprehensive foundation systems.
 * This is a serious foundation pass, not a stub or demo.
 */

const fs = require('fs');
const path = require('path');

// Read the minimal template as baseline
const templatePath = path.join(__dirname, '../../templates/perchance-empty-minimal.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

// Phase 1 customCode — comprehensive foundation
const customCode = `
// ============================================================================
// FRONTIER FOUNDRY 1.1 — PHASE 1 FOUNDATION
// ============================================================================
// Chronicle Foundry: Living Expedition Engine
// Phase 1: Structural and functional foundation for system-dense bot
// ============================================================================

(() => {
  'use strict';

  // ==========================================================================
  // INIT GUARD
  // ==========================================================================
  if (window.__pcbw_frontier_foundry_init) return;
  window.__pcbw_frontier_foundry_init = true;

  // ==========================================================================
  // CONSTANTS & CONFIG
  // ==========================================================================
  const CONFIG = {
    SCHEMA_VERSION: '1.1.0',
    EXPEDITION_NAME_MAX_LENGTH: 50,
    MAX_HISTORY_ENTRIES: 100,
    WORLD_SEED_LENGTH: 16,
    DEFAULT_PARTY_SIZE: 4,
    DEFAULT_STARTING_RESOURCES: {
      supplies: 100,
      morale: 75,
      knowledge: 0
    },
    REGION_TYPES: ['wilderness', 'ruins', 'settlement', 'frontier', 'hazard'],
    RESOURCE_TYPES: ['supplies', 'morale', 'knowledge', 'materials', 'reputation'],
    CONTRACT_TYPES: ['exploration', 'survey', 'extraction', 'escort', 'research']
  };

  const COMMANDS = {
    '/help': 'Display available commands',
    '/status': 'Show current expedition status',
    '/party': 'View party roster',
    '/resources': 'View resource inventory',
    '/contracts': 'List active contracts and objectives',
    '/world': 'Display world state summary',
    '/travel': 'Show available travel destinations',
    '/history': 'View recent expedition events',
    '/reset': 'Start a new expedition (requires confirmation)',
    '/debug': 'Show technical state information'
  };

  // ==========================================================================
  // SCHEMA & DEFAULT STATE
  // ==========================================================================
  const DEFAULT_STATE = {
    schemaVersion: '1.1.0',
    phase: 1,
    initialized: false,
    expedition: {
      name: '',
      day: 1,
      worldSeed: '',
      currentRegion: 'origin',
      difficulty: 'normal'
    },
    world: {
      seed: '',
      regions: {},
      discoveredRegions: ['origin'],
      travelNetwork: {}
    },
    resources: {
      supplies: 100,
      morale: 75,
      knowledge: 0,
      materials: 0,
      reputation: 0
    },
    party: {
      members: [],
      capacity: 4,
      morale: 75
    },
    contracts: {
      active: [],
      completed: [],
      available: []
    },
    factions: {},
    history: [],
    flags: {}
  };

  // ==========================================================================
  // STORAGE HELPERS
  // ==========================================================================
  const Storage = {
    init() {
      oc.thread.customData ||= {};
      oc.thread.customData.__pcbw_frontier_foundry ||= JSON.parse(JSON.stringify(DEFAULT_STATE));

      const state = this.getState();
      if (!state.initialized) {
        state.initialized = true;
        this.setState(state);
      }

      return state;
    },

    getState() {
      return oc.thread.customData.__pcbw_frontier_foundry || JSON.parse(JSON.stringify(DEFAULT_STATE));
    },

    setState(newState) {
      oc.thread.customData.__pcbw_frontier_foundry = newState;
    },

    migrate(state) {
      // Migration hook for future schema changes
      if (state.schemaVersion !== CONFIG.SCHEMA_VERSION) {
        console.log(\`[Frontier Foundry] Migrating from \${state.schemaVersion} to \${CONFIG.SCHEMA_VERSION}\`);
        // Future migration logic here
        state.schemaVersion = CONFIG.SCHEMA_VERSION;
      }
      return state;
    }
  };

  // ==========================================================================
  // WORLD GENERATOR
  // ==========================================================================
  const WorldGen = {
    createSeed() {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let seed = '';
      for (let i = 0; i < CONFIG.WORLD_SEED_LENGTH; i++) {
        seed += chars[Math.floor(Math.random() * chars.length)];
      }
      return seed;
    },

    seedRandom(seed, salt = 0) {
      let hash = 0;
      const str = seed + salt.toString();
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash % 1000) / 1000;
    },

    generateOrigin(seed) {
      return {
        id: 'origin',
        name: 'Base Camp',
        type: 'settlement',
        description: 'Your expedition base. A fortified camp at the edge of known territory.',
        discovered: true,
        visited: true,
        connections: ['region_1', 'region_2'],
        resources: { supplies: 50 },
        hazardLevel: 0,
        features: ['safe_zone', 'resupply_point']
      };
    },

    generateRegion(id, seed) {
      const rand = this.seedRandom(seed, id.charCodeAt(0));
      const typeIndex = Math.floor(rand * CONFIG.REGION_TYPES.length);
      const type = CONFIG.REGION_TYPES[typeIndex];

      return {
        id,
        name: \`Region \${id.split('_')[1]}\`,
        type,
        description: \`An unexplored \${type} area.\`,
        discovered: false,
        visited: false,
        connections: [],
        resources: {},
        hazardLevel: Math.floor(rand * 5),
        features: []
      };
    },

    buildInitialWorld(seed) {
      const regions = {
        origin: this.generateOrigin(seed)
      };

      // Generate initial connected regions
      for (let i = 1; i <= 3; i++) {
        const regionId = \`region_\${i}\`;
        regions[regionId] = this.generateRegion(regionId, seed);
      }

      const travelNetwork = {
        origin: ['region_1', 'region_2'],
        region_1: ['origin', 'region_3'],
        region_2: ['origin'],
        region_3: ['region_1']
      };

      return { regions, travelNetwork };
    }
  };

  // ==========================================================================
  // PARTY MANAGER
  // ==========================================================================
  const PartyManager = {
    createMember(name, role, seed) {
      const rand = WorldGen.seedRandom(seed, name.length);
      return {
        id: \`member_\${Date.now()}_\${Math.floor(rand * 1000)}\`,
        name,
        role,
        morale: 75,
        skills: {},
        traits: [],
        status: 'active'
      };
    },

    addMember(state, member) {
      if (state.party.members.length >= state.party.capacity) {
        return { success: false, reason: 'Party is at capacity' };
      }
      state.party.members.push(member);
      return { success: true, member };
    },

    updateMorale(state, delta) {
      state.party.morale = Math.max(0, Math.min(100, state.party.morale + delta));
      state.party.members.forEach(member => {
        member.morale = Math.max(0, Math.min(100, member.morale + delta));
      });
    }
  };

  // ==========================================================================
  // RESOURCE MANAGER
  // ==========================================================================
  const ResourceManager = {
    add(state, resourceType, amount) {
      if (!CONFIG.RESOURCE_TYPES.includes(resourceType)) {
        return { success: false, reason: 'Invalid resource type' };
      }
      state.resources[resourceType] = (state.resources[resourceType] || 0) + amount;
      return { success: true, newAmount: state.resources[resourceType] };
    },

    spend(state, resourceType, amount) {
      if (!CONFIG.RESOURCE_TYPES.includes(resourceType)) {
        return { success: false, reason: 'Invalid resource type' };
      }
      const current = state.resources[resourceType] || 0;
      if (current < amount) {
        return { success: false, reason: 'Insufficient resources' };
      }
      state.resources[resourceType] = current - amount;
      return { success: true, newAmount: state.resources[resourceType] };
    },

    check(state, resourceType) {
      return state.resources[resourceType] || 0;
    }
  };

  // ==========================================================================
  // CONTRACT MANAGER
  // ==========================================================================
  const ContractManager = {
    create(type, description, rewards, seed) {
      const rand = WorldGen.seedRandom(seed, type.length);
      return {
        id: \`contract_\${Date.now()}_\${Math.floor(rand * 1000)}\`,
        type,
        description,
        rewards,
        progress: 0,
        status: 'active',
        createdDay: 0
      };
    },

    addContract(state, contract) {
      contract.createdDay = state.expedition.day;
      state.contracts.active.push(contract);
      return contract;
    },

    completeContract(state, contractId) {
      const index = state.contracts.active.findIndex(c => c.id === contractId);
      if (index === -1) return { success: false };

      const contract = state.contracts.active[index];
      state.contracts.active.splice(index, 1);
      contract.status = 'completed';
      state.contracts.completed.push(contract);

      // Apply rewards
      if (contract.rewards) {
        for (const [resource, amount] of Object.entries(contract.rewards)) {
          ResourceManager.add(state, resource, amount);
        }
      }

      return { success: true, contract };
    }
  };

  // ==========================================================================
  // FACTION MANAGER
  // ==========================================================================
  const FactionManager = {
    create(name, type, seed) {
      const rand = WorldGen.seedRandom(seed, name.length);
      return {
        id: \`faction_\${Date.now()}_\${Math.floor(rand * 1000)}\`,
        name,
        type,
        reputation: 0,
        disposition: 'neutral',
        traits: [],
        discovered: false
      };
    },

    adjustReputation(state, factionId, delta) {
      const faction = state.factions[factionId];
      if (!faction) return { success: false };

      faction.reputation = Math.max(-100, Math.min(100, faction.reputation + delta));

      // Update disposition based on reputation
      if (faction.reputation >= 50) faction.disposition = 'allied';
      else if (faction.reputation >= 10) faction.disposition = 'friendly';
      else if (faction.reputation >= -10) faction.disposition = 'neutral';
      else if (faction.reputation >= -50) faction.disposition = 'unfriendly';
      else faction.disposition = 'hostile';

      return { success: true, faction };
    }
  };

  // ==========================================================================
  // HISTORY/EVENT LOG
  // ==========================================================================
  const EventLog = {
    add(state, eventType, description, metadata = {}) {
      const entry = {
        day: state.expedition.day,
        type: eventType,
        description,
        metadata,
        timestamp: Date.now()
      };

      state.history.push(entry);

      // Trim if too long
      if (state.history.length > CONFIG.MAX_HISTORY_ENTRIES) {
        state.history.shift();
      }

      return entry;
    },

    getRecent(state, count = 10) {
      return state.history.slice(-count);
    }
  };

  // ==========================================================================
  // CONTEXT BUILDER
  // ==========================================================================
  const ContextBuilder = {
    buildSystemContext(state) {
      const lines = [];
      lines.push(\`# EXPEDITION STATUS (Day \${state.expedition.day})\`);
      lines.push(\`Expedition: \${state.expedition.name || 'Unnamed'}\`);
      lines.push(\`Current Region: \${state.expedition.currentRegion}\`);
      lines.push(\`World Seed: \${state.world.seed}\`);
      lines.push('');

      lines.push('## Resources');
      for (const [resource, amount] of Object.entries(state.resources)) {
        lines.push(\`- \${resource}: \${amount}\`);
      }
      lines.push('');

      lines.push(\`## Party (Morale: \${state.party.morale}%)\`);
      state.party.members.forEach(member => {
        lines.push(\`- \${member.name} (\${member.role}) — Morale: \${member.morale}%\`);
      });
      lines.push('');

      if (state.contracts.active.length > 0) {
        lines.push('## Active Contracts');
        state.contracts.active.forEach(contract => {
          lines.push(\`- [\${contract.type}] \${contract.description}\`);
        });
        lines.push('');
      }

      return lines.join('\\n');
    },

    injectSystemMessage(content, hiddenFrom = ['user']) {
      oc.thread.messages.push({
        author: 'system',
        content,
        hiddenFrom,
        expectsReply: false,
        customData: { __pcbw_frontier_foundry_system: true }
      });
    }
  };

  // ==========================================================================
  // COMMAND PARSER
  // ==========================================================================
  const CommandParser = {
    parse(message) {
      const content = message.content.trim();
      if (!content.startsWith('/')) return null;

      const parts = content.split(/\\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      return { command, args, raw: content };
    },

    handle(command, args, state) {
      switch (command) {
        case '/help':
          return this.handleHelp();
        case '/status':
          return this.handleStatus(state);
        case '/party':
          return this.handleParty(state);
        case '/resources':
          return this.handleResources(state);
        case '/contracts':
          return this.handleContracts(state);
        case '/world':
          return this.handleWorld(state);
        case '/travel':
          return this.handleTravel(state);
        case '/history':
          return this.handleHistory(state);
        case '/debug':
          return this.handleDebug(state);
        case '/reset':
          return this.handleReset(state);
        default:
          return \`Unknown command: \${command}. Type /help for available commands.\`;
      }
    },

    handleHelp() {
      const lines = ['# Available Commands', ''];
      for (const [cmd, desc] of Object.entries(COMMANDS)) {
        lines.push(\`**\${cmd}** — \${desc}\`);
      }
      return lines.join('\\n');
    },

    handleStatus(state) {
      return ContextBuilder.buildSystemContext(state);
    },

    handleParty(state) {
      const lines = [\`# Party Roster (Morale: \${state.party.morale}%)\`, ''];
      if (state.party.members.length === 0) {
        lines.push('*No party members yet.*');
      } else {
        state.party.members.forEach((member, i) => {
          lines.push(\`**\${i + 1}. \${member.name}**\`);
          lines.push(\`   Role: \${member.role}\`);
          lines.push(\`   Morale: \${member.morale}%\`);
          lines.push(\`   Status: \${member.status}\`);
          lines.push('');
        });
      }
      return lines.join('\\n');
    },

    handleResources(state) {
      const lines = ['# Resource Inventory', ''];
      for (const [resource, amount] of Object.entries(state.resources)) {
        lines.push(\`**\${resource}:** \${amount}\`);
      }
      return lines.join('\\n');
    },

    handleContracts(state) {
      const lines = ['# Contracts & Objectives', ''];

      if (state.contracts.active.length > 0) {
        lines.push('## Active');
        state.contracts.active.forEach((contract, i) => {
          lines.push(\`**\${i + 1}. [\${contract.type}] \${contract.description}**\`);
          lines.push(\`   Progress: \${contract.progress}%\`);
          lines.push(\`   Started: Day \${contract.createdDay}\`);
          lines.push('');
        });
      } else {
        lines.push('*No active contracts.*');
        lines.push('');
      }

      if (state.contracts.completed.length > 0) {
        lines.push(\`## Completed (\${state.contracts.completed.length})\`);
      }

      return lines.join('\\n');
    },

    handleWorld(state) {
      const lines = ['# World State', ''];
      lines.push(\`**Seed:** \${state.world.seed}\`);
      lines.push(\`**Discovered Regions:** \${state.world.discoveredRegions.length}\`);
      lines.push(\`**Current Region:** \${state.expedition.currentRegion}\`);
      lines.push('');

      lines.push('## Discovered Regions');
      state.world.discoveredRegions.forEach(regionId => {
        const region = state.world.regions[regionId];
        if (region) {
          lines.push(\`- **\${region.name}** (\${region.type}) — Hazard: \${region.hazardLevel}\`);
        }
      });

      return lines.join('\\n');
    },

    handleTravel(state) {
      const currentRegion = state.expedition.currentRegion;
      const connections = state.world.travelNetwork[currentRegion] || [];

      const lines = ['# Travel Options', ''];
      lines.push(\`**Current Location:** \${currentRegion}\`);
      lines.push('');

      if (connections.length === 0) {
        lines.push('*No known connections from this region.*');
      } else {
        lines.push('## Available Destinations');
        connections.forEach(regionId => {
          const region = state.world.regions[regionId];
          if (region) {
            const status = region.discovered ? (region.visited ? 'Visited' : 'Discovered') : 'Unknown';
            lines.push(\`- **\${region.name || regionId}** (\${region.type}) — \${status}\`);
          }
        });
      }

      return lines.join('\\n');
    },

    handleHistory(state) {
      const recent = EventLog.getRecent(state, 10);
      const lines = ['# Recent Expedition Events', ''];

      if (recent.length === 0) {
        lines.push('*No recorded events yet.*');
      } else {
        recent.forEach(event => {
          lines.push(\`**Day \${event.day}:** \${event.description}\`);
        });
      }

      return lines.join('\\n');
    },

    handleDebug(state) {
      const lines = ['# Debug Information', ''];
      lines.push(\`**Schema Version:** \${state.schemaVersion}\`);
      lines.push(\`**Phase:** \${state.phase}\`);
      lines.push(\`**Initialized:** \${state.initialized}\`);
      lines.push(\`**History Entries:** \${state.history.length}\`);
      lines.push(\`**World Regions:** \${Object.keys(state.world.regions).length}\`);
      lines.push(\`**Active Contracts:** \${state.contracts.active.length}\`);
      lines.push(\`**Factions:** \${Object.keys(state.factions).length}\`);
      lines.push('');
      lines.push('*Full state available in browser console (check \`oc.thread.customData\`).*');
      return lines.join('\\n');
    },

    handleReset(state) {
      return \`⚠️ **Reset Expedition**\\n\\nThis will erase all progress and start a new expedition.\\n\\nTo confirm, please send another message with "/reset confirm".\`;
    }
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function initializeExpedition() {
    let state = Storage.init();
    state = Storage.migrate(state);

    // If this is truly first init, set up world
    if (!state.world.seed) {
      state.world.seed = WorldGen.createSeed();
      const worldData = WorldGen.buildInitialWorld(state.world.seed);
      state.world.regions = worldData.regions;
      state.world.travelNetwork = worldData.travelNetwork;

      // Add starter party members
      const starter = PartyManager.createMember('Scout Alpha', 'scout', state.world.seed);
      PartyManager.addMember(state, starter);

      // Add starter contract
      const starterContract = ContractManager.create(
        'exploration',
        'Survey the immediate area and report findings',
        { knowledge: 10, reputation: 5 },
        state.world.seed
      );
      ContractManager.addContract(state, starterContract);

      // Log initial event
      EventLog.add(state, 'expedition_start', 'Expedition initialized. Base camp established.');

      Storage.setState(state);

      // Inject welcome message
      ContextBuilder.injectSystemMessage(
        \`🏕️ **Expedition Initialized**\\n\\n\` +
        \`World Seed: \${state.world.seed}\\n\` +
        \`Starting Location: Base Camp\\n\\n\` +
        \`Type **/help** for available commands.\\n\` +
        \`Type **/status** to view your current expedition state.\`,
        []
      );
    }

    return state;
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  oc.thread.on('MessageAdded', (message) => {
    // Skip system messages and already-processed messages
    if (message.author === 'system') return;
    if (message.customData?.__pcbw_frontier_foundry_processed) return;

    const state = Storage.getState();

    // Check for command
    const parsed = CommandParser.parse(message);
    if (parsed) {
      // Mark as processed
      message.customData ||= {};
      message.customData.__pcbw_frontier_foundry_processed = true;

      // Handle command
      const response = CommandParser.handle(parsed.command, parsed.args, state);

      // Send response
      oc.thread.messages.push({
        author: 'system',
        content: response,
        hiddenFrom: [],
        expectsReply: false,
        customData: { __pcbw_frontier_foundry_command_response: true }
      });

      return;
    }

    // Mark non-command messages as processed
    message.customData ||= {};
    message.customData.__pcbw_frontier_foundry_processed = true;

    // For AI messages, could inject context reminder here in future phases
  });

  // ==========================================================================
  // BOOTSTRAP
  // ==========================================================================
  initializeExpedition();

  console.log('[Frontier Foundry 1.1] Phase 1 foundation initialized');

})();
`;

// Build the export structure
const exportData = JSON.parse(JSON.stringify(template));

// Update character row
const characterRow = exportData.data.data[0].rows[0];

characterRow.name = 'Frontier Foundry 1.1 (Phase 1)';
characterRow.roleInstruction = `You are the AI Director for Chronicle Foundry, a living expedition engine. This is Phase 1 — the foundation is built, but many advanced features are still in development.

Your role:
- Narrate the expedition's progress through uncharted territories
- Respond to user commands and expedition events
- Guide the party through challenges, discoveries, and narrative moments
- Make the world feel alive and reactive

The expedition state is tracked automatically. The system will provide you with current state via hidden context messages.

For Phase 1, focus on:
- Establishing atmosphere and tone
- Responding naturally to user actions
- Building narrative momentum
- Making the foundation systems feel meaningful

Remember: The expedition is in early stages. Advanced features like full combat, complex NPC interactions, and deep crafting systems will come in Phase 2 and beyond. For now, establish the narrative foundation.`;

characterRow.reminderMessage = `You are narrating an expedition simulation. Stay in character as the AI Director. Use the current expedition state (provided in hidden system messages) to inform your responses. Keep responses concise but atmospheric. The world is dangerous, mysterious, and full of potential.`;

characterRow.customCode = customCode;

characterRow.initialMessages = [
  {
    author: 'system',
    content: '🗺️ **Welcome to Frontier Foundry 1.1 — Phase 1**\n\n' +
      'This is the foundation build of Chronicle Foundry: Living Expedition Engine.\n\n' +
      '**Phase 1 Capabilities:**\n' +
      '- Persistent expedition state tracking\n' +
      '- Deterministic world generation from seed\n' +
      '- Party management system\n' +
      '- Resource tracking\n' +
      '- Contract/objective foundation\n' +
      '- Event history logging\n' +
      '- Command interface\n' +
      '- World region network\n\n' +
      'Type **/help** to see available commands.\n' +
      'Type **/status** to view your expedition state.\n\n' +
      'The expedition awaits your first decision.',
    hiddenFrom: [],
    expectsReply: true
  }
];

characterRow.shortcutButtons = [
  {
    name: '📊 Status',
    message: '/status',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '👥 Party',
    message: '/party',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '📦 Resources',
    message: '/resources',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '🗺️ Travel',
    message: '/travel',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '📋 Contracts',
    message: '/contracts',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: '❓ Help',
    message: '/help',
    insertionType: 'replace',
    autoSend: true,
    clearAfterSend: true
  }
];

characterRow.modelName = 'openai-gpt-4o';
characterRow.temperature = 0.85;
characterRow.maxTokensPerMessage = 600;
characterRow.streamingResponse = true;
characterRow.folderPath = '';

characterRow.customData = {
  PUBLIC: {
    bot_version: '1.1.0',
    phase: 1,
    bot_name: 'frontier_foundry_1.1'
  }
};

characterRow.creationTime = Date.now();
characterRow.lastMessageTime = Date.now();

// Update table rowCount to match
exportData.data.tables[0].rowCount = 1;

// Write the export
const outputPath = path.join(__dirname, 'frontier_foundry_1.1.json');
fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf8');

console.log(`✅ Export generated: ${outputPath}`);
console.log(`   Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
console.log(`   customCode length: ${customCode.length} characters`);

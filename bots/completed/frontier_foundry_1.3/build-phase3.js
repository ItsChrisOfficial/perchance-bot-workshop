// Frontier Foundry 1.3 - Phase 3 Builder
// Final release build with all advanced systems hardened
// Run: node build-phase3.js

const fs = require('fs');
const path = require('path');

// Load Phase 2 as baseline
const phase2Path = path.join(__dirname, '../frontier_foundry_1.2/frontier_foundry_1.2.json');
const phase2 = JSON.parse(fs.readFileSync(phase2Path, 'utf8'));

// Clone the structure
const phase3 = JSON.parse(JSON.stringify(phase2));

// Update metadata for Phase 3
const characterRow = phase3.data.data[0].rows[0];
characterRow.name = "Chronicle Foundry v1.3 Final";
characterRow.uuid = `frontier-foundry-1.3-${Date.now()}`;
characterRow.creationTime = Date.now();
characterRow.lastMessageTime = Date.now();

// Update customData for Phase 3
characterRow.customData = {
  PUBLIC: {
    schema_version: "1.3.0-final",
    bot_phase: "phase_3_final_release",
    capabilities: [
      "full_ui_application",
      "advanced_party_npc_system",
      "relationship_dynamics",
      "faction_consequences",
      "contract_branching",
      "event_cooldown_system",
      "scene_orchestration",
      "ai_response_shaping",
      "image_prompt_workflow",
      "debug_inspection",
      "state_rollback",
      "action_gating",
      "save_restore"
    ]
  }
};

// Update roleInstruction with Phase 3 context
characterRow.roleInstruction = `You are Chronicle Foundry, a comprehensive expedition command system for deep frontier exploration missions.

You orchestrate narrative-driven expeditions where player decisions, party dynamics, faction relationships, environmental conditions, and resource scarcity create emergent stories.

# Core Design Philosophy

1. **Consequences Matter**: Every decision affects party morale, faction standing, resource availability, and future events.
2. **Relationships Drive Story**: Party members have traits, relationships, and conflicts that shape their effectiveness and loyalty.
3. **Systems Interact**: Weather affects travel, fatigue affects combat, faction standing affects contracts, reputation affects recruitment.
4. **Emergent Narrative**: Combine procedural events with authored scenes to create unique expedition stories.

# Your Responsibilities

- Orchestrate scene transitions based on expedition state
- React to player decisions with appropriate narrative consequences
- Present resource/party/faction state in natural narrative form
- Generate contextual events that respect cooldowns and world state
- Shape responses to match current scene tone (tense danger, quiet camp, discovery moment)
- Guide image generation with scene-appropriate prompts

# Response Patterns

**During Travel:**
- Describe terrain and weather effects
- Present encounters that test party skills
- Show fatigue building, resources depleting
- Offer meaningful choices with trade-offs

**During Camp:**
- Show party interactions and relationship dynamics
- Present rest decisions (push on vs recover)
- Reveal character development moments
- Allow for planning and preparation

**During Events:**
- Present clear stakes and consequences
- Show party member reactions based on traits
- Track event outcomes for future references
- Update faction standings when relevant

**During Contracts:**
- Present mission objectives with clarity
- Show progress through observable milestones
- Introduce complications that require adaptation
- Reward completion with tangible benefits

# Tone and Style

- **Grounded realism**: Expedition hardships feel real
- **Character-driven**: Party members have distinct voices
- **Atmospheric**: Weather, time of day, and setting create mood
- **Consequence-aware**: Past decisions echo in current situations
- **Discovery-focused**: The frontier holds secrets worth finding

# Technical Integration

The UI displays expedition state. Your responses should:
- Match current UI state (day, location, resources, party status)
- Reference UI changes naturally ("The map updates to show...")
- Acknowledge player actions from both commands and UI
- Provide narrative context for system state changes

Keep responses focused and scene-appropriate. Let the UI handle data display—you handle the story.`;

// Update reminderMessage with Phase 3 dynamic context
characterRow.reminderMessage = `Current expedition state context for response shaping:

**Scene Mode:** [Will be dynamically set by customCode]
**Weather/Time:** [Will be dynamically set]
**Party Condition:** [Will be dynamically set]
**Active Threats:** [Will be dynamically set]
**Faction Context:** [Will be dynamically set]

Shape your response to match the current scene mode. If in danger, be tense and urgent. If in camp, allow reflection and planning. If in discovery, convey wonder and caution.

Keep responses under 4 paragraphs unless the scene explicitly calls for deeper description.`;

// Update initialMessages for Phase 3
characterRow.initialMessages = [
  {
    author: "system",
    content: "Chronicle Foundry v1.3 Final initializing. All systems operational. Advanced expedition engine active.",
    hiddenFrom: [],
    expectsReply: false
  },
  {
    author: "ai",
    content: `**Chronicle Foundry: Living Expedition Engine**
**v1.3 Final Release**

The expedition command center materializes around you—a comprehensive interface built from years of frontier experience. Every system has been tested under pressure. Every tool has proven its worth.

**Seven operational screens** surround the central viewport:
- **Dashboard**: Expedition overview and critical alerts
- **Map**: Regional navigation and travel planning
- **Party**: Member roster with health, morale, skills, and relationships
- **Inventory**: Resource tracking with consumption forecasting
- **Contracts**: Mission objectives and faction standings
- **Timeline**: Event history and decision consequences
- **Debug**: State inspection and expedition management tools

**The engine is fully operational:**
- Party members develop relationships that affect performance
- Factions remember your decisions and react accordingly
- Events respect cooldowns and build on past encounters
- Weather and terrain create real travel challenges
- Resources pressure every decision
- Contracts branch based on your approach
- Save and restore your expedition at any point

**Welcome to the deep frontier, Commander.**

Use /help to see all commands. The interface opens automatically. Your first expedition awaits.

*The frontier is vast. Your choices will define your legend.*`,
    hiddenFrom: [],
    expectsReply: true
  }
];

// Update shortcut buttons for Phase 3
characterRow.shortcutButtons = [
  {
    name: "🎛️ Interface",
    message: "/ui",
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
    name: "⛺ Make Camp",
    message: "/camp",
    insertionType: "replace",
    autoSend: true,
    clearAfterSend: true
  },
  {
    name: "💾 Save",
    message: "/save",
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

// Set image prompt fields for Phase 3
characterRow.imagePromptPrefix = "High quality digital illustration, expedition scene, ";
characterRow.imagePromptSuffix = ", atmospheric frontier landscape, detailed character art, dramatic lighting, cinematic composition";
characterRow.imagePromptTriggers = ["describe the scene", "show me", "what does it look like", "paint a picture", "visualize", "illustrate"];

// Now build the comprehensive Phase 3 customCode
const phase3CustomCode = `// Chronicle Foundry v1.3 - Phase 3: Final Release
// Complete expedition engine with all advanced systems hardened

(() => {
  'use strict';

  // ============================================================
  // PHASE 3 CONSTANTS
  // ============================================================

  const CONFIG = {
    SCHEMA_VERSION: '1.3.0-final',
    INIT_FLAG: '__pcbw_frontier_foundry_v13_init',
    STATE_KEY: '__pcbw_frontier_foundry',
    UI_CONTAINER_ID: 'pcbw-foundry-ui',
    MAX_HISTORY_ENTRIES: 100,
    MAX_HIDDEN_MESSAGES: 15,
    WORLD_SEED_LENGTH: 16,
    UI_VISIBLE_KEY: '__pcbw_foundry_ui_visible',
    EVENT_COOLDOWN_TURNS: 3,
    RELATIONSHIP_IMPACT_THRESHOLD: 25,
    SAVE_SLOT_PREFIX: '__pcbw_foundry_save_'
  };

  const BIOME_TYPES = ['forest', 'mountain', 'swamp', 'desert', 'tundra', 'plains', 'ruins', 'coast', 'canyon', 'glacier'];
  const RESOURCE_TYPES = ['food', 'water', 'medicine', 'tools', 'fuel', 'materials'];
  const PARTY_ROLES = ['scout', 'medic', 'engineer', 'guard', 'specialist', 'diplomat', 'researcher'];
  const WEATHER_TYPES = ['clear', 'rain', 'storm', 'fog', 'snow', 'wind', 'heat', 'cold'];
  const EVENT_TYPES = ['discovery', 'encounter', 'resource', 'danger', 'opportunity', 'narrative', 'faction', 'relationship'];
  const SCENE_MODES = ['travel', 'camp', 'combat', 'negotiation', 'discovery', 'crisis', 'planning'];

  const TRAITS = {
    positive: ['loyal', 'brave', 'resourceful', 'calm', 'optimistic', 'skilled', 'diplomatic', 'analytical'],
    negative: ['reckless', 'pessimistic', 'hot_headed', 'cautious', 'greedy', 'suspicious', 'stubborn']
  };

  const FACTIONS = {
    frontier_guild: { name: 'Frontier Guild', base_standing: 50 },
    merchants_union: { name: 'Merchants Union', base_standing: 50 },
    research_academy: { name: 'Research Academy', base_standing: 50 },
    frontier_rangers: { name: 'Frontier Rangers', base_standing: 50 },
    independent_settlers: { name: 'Independent Settlers', base_standing: 50 }
  };

  // ============================================================
  // INIT GUARD
  // ============================================================

  if (window[CONFIG.INIT_FLAG]) return;
  window[CONFIG.INIT_FLAG] = true;

  // ============================================================
  // CORE STATE MANAGEMENT
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
        time_of_day: 'morning',
        scene_mode: 'planning',
        danger_level: 0,
        morale_modifier: 0
      },
      world: {
        seed: null,
        regions: {},
        discovered_locations: [],
        travel_network: {},
        event_cooldowns: {}
      },
      party: {
        members: [],
        max_size: 6,
        total_health: 0,
        total_morale: 0,
        fatigue: 0,
        relationships: {}
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
        completed: [],
        failed: []
      },
      factions: Object.keys(FACTIONS).reduce((acc, key) => {
        acc[key] = { standing: FACTIONS[key].base_standing, encounters: 0, last_interaction: null };
        return acc;
      }, {}),
      history: {
        major_events: [],
        decisions: [],
        discoveries: [],
        relationships: [],
        faction_events: []
      },
      meta: {
        commands_used: 0,
        sessions: 1,
        last_save: Date.now(),
        current_screen: 'dashboard',
        notifications: [],
        tutorial_completed: false,
        ui_visible: true
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
      events_remaining: 3,
      special_features: []
    };
  }

  // ============================================================
  // PARTY & NPC SYSTEM
  // ============================================================

  function generateTraits(seed, index) {
    const positiveCount = Math.floor(seedRandom(seed, index) * 3) + 1;
    const negativeCount = Math.floor(seedRandom(seed, index + 1000) * 2);

    const positive = [];
    const negative = [];

    for (let i = 0; i < positiveCount; i++) {
      const traitIndex = Math.floor(seedRandom(seed, index + i + 100) * TRAITS.positive.length);
      if (!positive.includes(TRAITS.positive[traitIndex])) {
        positive.push(TRAITS.positive[traitIndex]);
      }
    }

    for (let i = 0; i < negativeCount; i++) {
      const traitIndex = Math.floor(seedRandom(seed, index + i + 200) * TRAITS.negative.length);
      if (!negative.includes(TRAITS.negative[traitIndex])) {
        negative.push(TRAITS.negative[traitIndex]);
      }
    }

    return { positive, negative };
  }

  function createPartyMember(name, role, skills = []) {
    const state = getState();
    const memberIndex = state.party.members.length;
    const traits = generateTraits(state.world.seed || 'DEFAULT', memberIndex + 5000);

    return {
      name: name,
      role: role,
      health: 100,
      max_health: 100,
      morale: 75,
      skills: skills.length > 0 ? skills : generateSkillsForRole(role),
      traits: traits,
      status_effects: [],
      inventory: [],
      fatigue: 0,
      experience: 0,
      relationships: {}
    };
  }

  function generateSkillsForRole(role) {
    const skillSets = {
      scout: ['navigation', 'tracking', 'stealth'],
      medic: ['first_aid', 'diagnosis', 'surgery'],
      engineer: ['repair', 'construction', 'explosives'],
      guard: ['combat', 'defense', 'intimidation'],
      specialist: ['survival', 'foraging', 'weather_reading'],
      diplomat: ['negotiation', 'persuasion', 'empathy'],
      researcher: ['analysis', 'lore', 'languages']
    };
    return skillSets[role] || ['general'];
  }

  function updateRelationship(member1Name, member2Name, delta, reason) {
    const state = getState();
    const key1 = \`\${member1Name}_\${member2Name}\`;
    const key2 = \`\${member2Name}_\${member1Name}\`;

    if (!state.party.relationships[key1]) {
      state.party.relationships[key1] = { value: 50, history: [] };
    }

    state.party.relationships[key1].value = Math.max(0, Math.min(100, state.party.relationships[key1].value + delta));
    state.party.relationships[key1].history.push({
      day: state.expedition.day,
      delta: delta,
      reason: reason,
      timestamp: Date.now()
    });

    // Mirror relationship
    state.party.relationships[key2] = state.party.relationships[key1];

    if (Math.abs(delta) >= CONFIG.RELATIONSHIP_IMPACT_THRESHOLD) {
      logEvent('relationships', \`\${member1Name} and \${member2Name}: \${reason}\`, { delta, new_value: state.party.relationships[key1].value });
    }

    setState(state);
  }

  function getRelationship(member1Name, member2Name) {
    const state = getState();
    const key = \`\${member1Name}_\${member2Name}\`;
    return state.party.relationships[key]?.value || 50;
  }

  function applyFatigue(amount) {
    const state = getState();
    state.party.members.forEach(member => {
      member.fatigue = Math.min(100, member.fatigue + amount);
      if (member.fatigue > 80) {
        member.morale = Math.max(0, member.morale - 5);
      }
    });
    setState(state);
  }

  // ============================================================
  // FACTION SYSTEM
  // ============================================================

  function modifyFactionStanding(factionId, delta, reason) {
    const state = getState();
    if (!state.factions[factionId]) return false;

    state.factions[factionId].standing = Math.max(0, Math.min(100, state.factions[factionId].standing + delta));
    state.factions[factionId].encounters += 1;
    state.factions[factionId].last_interaction = Date.now();

    logEvent('faction_events', \`\${FACTIONS[factionId].name}: \${reason}\`, {
      delta: delta,
      new_standing: state.factions[factionId].standing
    });

    setState(state);
    return true;
  }

  function getFactionStanding(factionId) {
    const state = getState();
    return state.factions[factionId]?.standing || 50;
  }

  function getFactionRelationshipStatus(standing) {
    if (standing >= 80) return 'allied';
    if (standing >= 60) return 'friendly';
    if (standing >= 40) return 'neutral';
    if (standing >= 20) return 'unfriendly';
    return 'hostile';
  }

  // ============================================================
  // CONTRACT SYSTEM
  // ============================================================

  function createContract(title, description, objectives, reward, factionId = null) {
    return {
      id: \`contract_\${Date.now()}\`,
      title: title,
      description: description,
      objectives: objectives.map((obj, idx) => ({
        id: idx,
        description: obj.description,
        required: obj.required || 1,
        current: 0,
        completed: false
      })),
      reward: reward,
      faction: factionId,
      accepted_day: null,
      completed_day: null,
      failed: false,
      status: 'available'
    };
  }

  function acceptContract(contract) {
    const state = getState();
    contract.status = 'active';
    contract.accepted_day = state.expedition.day;

    if (!state.contracts.primary) {
      state.contracts.primary = contract;
    } else {
      state.contracts.secondary.push(contract);
    }

    setState(state);
    logEvent('major_events', \`Contract accepted: \${contract.title}\`, { contract_id: contract.id });
  }

  function updateContractProgress(contractId, objectiveId, progress) {
    const state = getState();
    let contract = state.contracts.primary?.id === contractId ? state.contracts.primary : null;

    if (!contract) {
      contract = state.contracts.secondary.find(c => c.id === contractId);
    }

    if (!contract) return false;

    const objective = contract.objectives.find(o => o.id === objectiveId);
    if (!objective) return false;

    objective.current = Math.min(objective.required, objective.current + progress);
    objective.completed = objective.current >= objective.required;

    // Check if all objectives complete
    if (contract.objectives.every(o => o.completed)) {
      completeContract(contract);
    }

    setState(state);
    return true;
  }

  function completeContract(contract) {
    const state = getState();
    contract.status = 'completed';
    contract.completed_day = state.expedition.day;

    // Apply rewards
    if (contract.reward.resources) {
      Object.keys(contract.reward.resources).forEach(resource => {
        modifyResource(resource, contract.reward.resources[resource]);
      });
    }

    if (contract.reward.faction_standing && contract.faction) {
      modifyFactionStanding(contract.faction, contract.reward.faction_standing, \`Completed contract: \${contract.title}\`);
    }

    // Move to completed
    state.contracts.completed.push(contract);

    if (state.contracts.primary?.id === contract.id) {
      state.contracts.primary = state.contracts.secondary.shift() || null;
    } else {
      state.contracts.secondary = state.contracts.secondary.filter(c => c.id !== contract.id);
    }

    setState(state);
    logEvent('major_events', \`Contract completed: \${contract.title}\`, { rewards: contract.reward });
  }

  // ============================================================
  // EVENT ENGINE
  // ============================================================

  function canTriggerEvent(eventType, regionId) {
    const state = getState();
    const cooldownKey = \`\${eventType}_\${regionId}\`;
    const lastTrigger = state.world.event_cooldowns[cooldownKey];

    if (!lastTrigger) return true;

    const daysSince = state.expedition.day - lastTrigger;
    return daysSince >= CONFIG.EVENT_COOLDOWN_TURNS;
  }

  function markEventTriggered(eventType, regionId) {
    const state = getState();
    const cooldownKey = \`\${eventType}_\${regionId}\`;
    state.world.event_cooldowns[cooldownKey] = state.expedition.day;
    setState(state);
  }

  function generateEvent(regionId) {
    const state = getState();
    const region = state.world.regions[regionId];
    if (!region) return null;

    // Filter available event types by cooldown
    const availableTypes = EVENT_TYPES.filter(type => canTriggerEvent(type, regionId));
    if (availableTypes.length === 0) return null;

    // Weight by region properties
    const weights = availableTypes.map(type => {
      let weight = 1;
      if (type === 'danger' && region.danger_level > 5) weight = 3;
      if (type === 'resource' && region.resource_richness > 5) weight = 3;
      if (type === 'discovery' && region.visited_count === 0) weight = 2;
      return weight;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    let selectedType = availableTypes[0];
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedType = availableTypes[i];
        break;
      }
    }

    markEventTriggered(selectedType, regionId);
    return createEventByType(selectedType, region);
  }

  function createEventByType(eventType, region) {
    const templates = {
      discovery: [
        { title: 'Ancient Ruins', description: 'Weathered structures emerge from the landscape.', consequences: { lore: true } },
        { title: 'Natural Wonder', description: 'A breathtaking geological formation.', consequences: { morale: 10 } },
        { title: 'Resource Cache', description: 'Supplies left by previous expeditions.', consequences: { resources: { materials: 15, tools: 10 } } }
      ],
      encounter: [
        { title: 'Frontier Patrol', description: 'Rangers on patrol approach your party.', consequences: { faction: 'frontier_rangers' } },
        { title: 'Merchant Caravan', description: 'Traders offer to exchange goods.', consequences: { trade: true } },
        { title: 'Wildlife', description: 'Indigenous creatures cross your path.', consequences: { danger: 3 } }
      ],
      danger: [
        { title: 'Harsh Weather', description: 'Conditions deteriorate rapidly.', consequences: { weather_event: true, health: -10 } },
        { title: 'Equipment Failure', description: 'Critical gear malfunctions.', consequences: { resources: { tools: -5 } } },
        { title: 'Hostile Force', description: 'Aggressive entities threaten the party.', consequences: { combat: true } }
      ],
      resource: [
        { title: 'Abundant Foraging', description: 'Rich natural resources in this area.', consequences: { resources: { food: 20, water: 15 } } },
        { title: 'Mineral Deposit', description: 'Valuable materials can be extracted.', consequences: { resources: { materials: 25 } } },
        { title: 'Fresh Water Source', description: 'A reliable water supply.', consequences: { resources: { water: 30 } } }
      ]
    };

    const options = templates[eventType] || templates['discovery'];
    const template = options[Math.floor(Math.random() * options.length)];

    return {
      type: eventType,
      title: template.title,
      description: template.description,
      consequences: template.consequences,
      region: region.id,
      day: getState().expedition.day,
      resolved: false
    };
  }

  function resolveEvent(event, choice) {
    const state = getState();

    if (event.consequences.resources) {
      Object.keys(event.consequences.resources).forEach(resource => {
        modifyResource(resource, event.consequences.resources[resource]);
      });
    }

    if (event.consequences.morale) {
      state.party.members.forEach(member => {
        member.morale = Math.max(0, Math.min(100, member.morale + event.consequences.morale));
      });
    }

    if (event.consequences.health) {
      state.party.members.forEach(member => {
        member.health = Math.max(0, Math.min(member.max_health, member.health + event.consequences.health));
      });
    }

    if (event.consequences.faction) {
      modifyFactionStanding(event.consequences.faction, choice === 'positive' ? 10 : -5, \`Event: \${event.title}\`);
    }

    event.resolved = true;
    logEvent('major_events', \`Event resolved: \${event.title}\`, { choice, consequences: event.consequences });

    setState(state);
  }

  // ============================================================
  // RESOURCE MANAGEMENT
  // ============================================================

  function modifyResource(resourceType, amount) {
    const state = getState();
    if (!RESOURCE_TYPES.includes(resourceType)) return false;

    const oldValue = state.resources[resourceType];
    state.resources[resourceType] = Math.max(0, oldValue + amount);

    if (amount < 0 && state.resources[resourceType] === 0 && oldValue > 0) {
      showToast(\`\${resourceType.toUpperCase()} DEPLETED!\`, 'error');
    }

    setState(state);
    return true;
  }

  function checkResourceGating(action) {
    const state = getState();
    const requirements = {
      travel: { food: 5, water: 5, fuel: 2 },
      camp: { food: 3 * state.party.members.length, water: 3 * state.party.members.length, fuel: 5 },
      gather: { tools: 1 },
      craft: { materials: 10, tools: 2 }
    };

    const required = requirements[action];
    if (!required) return { allowed: true };

    const missing = [];
    Object.keys(required).forEach(resource => {
      if (state.resources[resource] < required[resource]) {
        missing.push(\`\${resource} (need \${required[resource]}, have \${state.resources[resource]})\`);
      }
    });

    return {
      allowed: missing.length === 0,
      missing: missing
    };
  }

  // ============================================================
  // SCENE ORCHESTRATION
  // ============================================================

  function updateSceneMode(newMode) {
    const state = getState();
    const oldMode = state.expedition.scene_mode;
    state.expedition.scene_mode = newMode;

    // Update reminder message based on scene mode
    updateReminderForScene(newMode);

    // Update image prompts
    updateImagePromptsForScene(newMode);

    setState(state);

    if (oldMode !== newMode) {
      logEvent('major_events', \`Scene transition: \${oldMode} → \${newMode}\`, { mode: newMode });
    }
  }

  function updateReminderForScene(sceneMode) {
    const reminders = {
      travel: \`SCENE: Active travel through \${getState().world.regions[getState().expedition.current_region]?.biome || 'frontier'}. Weather: \${getState().expedition.weather}. Keep responses focused on journey challenges, terrain, and immediate decisions. Tone: Alert, descriptive.\`,
      camp: \`SCENE: Party resting at camp. Time for reflection, planning, and character interactions. Show party dynamics and relationship moments. Tone: Reflective, character-driven.\`,
      combat: \`SCENE: Active danger/combat situation. Responses should be tense, urgent, action-focused. Show party skills and teamwork under pressure. Tone: Urgent, tense.\`,
      negotiation: \`SCENE: Diplomatic encounter or faction interaction. Choices matter for relationships and standing. Show consequences of tone and approach. Tone: Careful, consequence-aware.\`,
      discovery: \`SCENE: Significant discovery or revelation moment. Build atmosphere and wonder. Allow for investigation and curiosity. Tone: Atmospheric, mysterious.\`,
      crisis: \`SCENE: Emergency situation requiring immediate decisions. High stakes, limited time. Show party stress and quick thinking. Tone: Tense, decisive.\`,
      planning: \`SCENE: Strategy and preparation phase. Allow for deliberation, planning, and resource management. Tone: Thoughtful, strategic.\`
    };

    oc.character.reminderMessage = reminders[sceneMode] || reminders.planning;
  }

  function updateImagePromptsForScene(sceneMode) {
    const prefixes = {
      travel: 'Expedition party traveling through ',
      camp: 'Frontier camp at rest, ',
      combat: 'Intense combat scene, expedition party in action, ',
      negotiation: 'Diplomatic encounter, ',
      discovery: 'Moment of discovery, expedition party investigating ',
      crisis: 'Emergency situation, ',
      planning: 'Expedition planning scene, '
    };

    const suffixes = {
      travel: ', dynamic travel scene, sense of journey and distance',
      camp: ', warm campfire glow, characters at rest',
      combat: ', action and motion, dramatic lighting',
      negotiation: ', tense atmosphere, careful positioning',
      discovery: ', atmospheric lighting, sense of wonder',
      crisis: ', chaotic energy, urgent mood',
      planning: ', maps and supplies visible, thoughtful composition'
    };

    oc.character.imagePromptPrefix = (prefixes[sceneMode] || prefixes.planning) + (oc.character.imagePromptPrefix || '');
    oc.character.imagePromptSuffix = (oc.character.imagePromptSuffix || '') + (suffixes[sceneMode] || suffixes.planning);
  }

  // ============================================================
  // HISTORY & LOGGING
  // ============================================================

  function logEvent(category, description, metadata = {}) {
    const state = getState();
    if (!state.history[category]) {
      state.history[category] = [];
    }

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

    // Add to notifications for UI
    if (category === 'major_events') {
      state.meta.notifications.unshift(\`Day \${state.expedition.day}: \${description}\`);
      if (state.meta.notifications.length > 10) {
        state.meta.notifications.pop();
      }
    }

    setState(state);
  }

  // ============================================================
  // SAVE/RESTORE SYSTEM
  // ============================================================

  function saveExpedition(slotName = 'quicksave') {
    const state = getState();
    const saveData = {
      version: CONFIG.SCHEMA_VERSION,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)),
      metadata: {
        expedition_name: state.expedition.name,
        day: state.expedition.day,
        party_size: state.party.members.length
      }
    };

    const saveKey = CONFIG.SAVE_SLOT_PREFIX + slotName;

    try {
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      logEvent('major_events', \`Expedition saved: \${slotName}\`, { day: state.expedition.day });
      return { success: true, slot: slotName, timestamp: saveData.timestamp };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function loadExpedition(slotName = 'quicksave') {
    const saveKey = CONFIG.SAVE_SLOT_PREFIX + slotName;

    try {
      const savedData = localStorage.getItem(saveKey);
      if (!savedData) {
        return { success: false, error: 'No save found in this slot' };
      }

      const saveData = JSON.parse(savedData);

      if (saveData.version !== CONFIG.SCHEMA_VERSION) {
        return { success: false, error: 'Save version mismatch' };
      }

      oc.thread.customData[CONFIG.STATE_KEY] = saveData.state;
      renderUI();

      logEvent('major_events', \`Expedition loaded: \${slotName}\`, { day: saveData.state.expedition.day });
      return { success: true, slot: slotName, metadata: saveData.metadata };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function listSaves() {
    const saves = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(CONFIG.SAVE_SLOT_PREFIX)) {
        try {
          const saveData = JSON.parse(localStorage.getItem(key));
          saves.push({
            slot: key.replace(CONFIG.SAVE_SLOT_PREFIX, ''),
            timestamp: saveData.timestamp,
            metadata: saveData.metadata
          });
        } catch (e) {
          // Skip corrupted saves
        }
      }
    }
    return saves.sort((a, b) => b.timestamp - a.timestamp);
  }

  // ============================================================
  // UI SYSTEM (Extended from Phase 2)
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
      'width: 420px',
      'max-height: 650px',
      'background: light-dark(#f8f9fa, #1a1d23)',
      'border: 2px solid light-dark(rgba(100,120,140,0.4), rgba(80,100,120,0.4))',
      'border-radius: 12px',
      'box-shadow: 0 8px 32px rgba(0,0,0,0.3)',
      'z-index: 999999',
      'font-family: system-ui, -apple-system, sans-serif',
      'overflow: hidden',
      'display: flex',
      'flex-direction: column',
      'transition: all 0.3s ease'
    ].join('; ');

    document.body.appendChild(container);
    return container;
  }

  function renderUI() {
    const container = getOrCreateUI();
    const state = getState();

    if (!state.meta.ui_visible) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';

    const html = \`
      <div style="padding: 16px; background: light-dark(#e9ecef, #2a2f3a); border-bottom: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1)); display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; color: light-dark(#212529, #f8f9fa); font-size: 16px; font-weight: 600;">Chronicle Foundry v1.3</h3>
        <button onclick="window.__pcbw_toggleUI(false)" style="background: none; border: none; font-size: 20px; cursor: pointer; color: light-dark(#495057, #adb5bd); padding: 0; width: 24px; height: 24px;">×</button>
      </div>

      <div style="display: flex; padding: 8px; gap: 4px; background: light-dark(#dee2e6, #212529); border-bottom: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1)); overflow-x: auto;">
        \${renderTabs()}
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 16px;">
        \${renderActiveScreen()}
      </div>
    \`;

    container.innerHTML = html;
  }

  function renderTabs() {
    const state = getState();
    const tabs = [
      { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { id: 'map', icon: '🗺️', label: 'Map' },
      { id: 'party', icon: '👥', label: 'Party' },
      { id: 'inventory', icon: '📦', label: 'Inventory' },
      { id: 'contracts', icon: '📜', label: 'Contracts' },
      { id: 'timeline', icon: '📅', label: 'Timeline' },
      { id: 'debug', icon: '🔧', label: 'Debug' }
    ];

    return tabs.map(tab => {
      const active = state.meta.current_screen === tab.id;
      return \`
        <button
          onclick="window.__pcbw_switchScreen('\${tab.id}')"
          style="
            padding: 8px 12px;
            border: none;
            background: \${active ? 'light-dark(#4dabf7, #1864ab)' : 'transparent'};
            color: \${active ? 'light-dark(#fff, #fff)' : 'light-dark(#495057, #adb5bd)'};
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
            transition: all 0.2s;
            font-weight: \${active ? '600' : '400'};
          "
        >
          \${tab.icon} \${tab.label}
        </button>
      \`;
    }).join('');
  }

  function renderActiveScreen() {
    const state = getState();
    const screens = {
      dashboard: renderDashboard,
      map: renderMapScreen,
      party: renderPartyScreen,
      inventory: renderInventoryScreen,
      contracts: renderContractsScreen,
      timeline: renderTimelineScreen,
      debug: renderDebugScreen
    };

    const renderer = screens[state.meta.current_screen] || renderDashboard;
    return renderer();
  }

  function renderDashboard() {
    const state = getState();

    if (!state.expedition.active) {
      return \`
        <div style="text-align: center; padding: 40px 20px; color: light-dark(#495057, #adb5bd);">
          <h3 style="margin: 0 0 16px 0; color: light-dark(#212529, #f8f9fa);">No Active Expedition</h3>
          <p style="margin: 0 0 20px 0;">Start your frontier journey with the /begin command.</p>
          <div style="background: light-dark(#fff, #2a2f3a); padding: 16px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1)); text-align: left;">
            <strong style="color: light-dark(#212529, #f8f9fa);">Getting Started:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: light-dark(#495057, #adb5bd);">
              <li>Type <code>/begin [name]</code> to start</li>
              <li>Use <code>/help</code> for all commands</li>
              <li>Click tabs to explore the interface</li>
            </ul>
          </div>
        </div>
      \`;
    }

    const avgHealth = state.party.members.length > 0
      ? Math.floor(state.party.members.reduce((sum, m) => sum + m.health, 0) / state.party.members.length)
      : 0;

    const avgMorale = state.party.members.length > 0
      ? Math.floor(state.party.members.reduce((sum, m) => sum + m.morale, 0) / state.party.members.length)
      : 0;

    const criticalResources = RESOURCE_TYPES.filter(r => state.resources[r] < 10);

    return \`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: light-dark(#fff, #2a2f3a); padding: 16px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
          <h4 style="margin: 0 0 12px 0; color: light-dark(#212529, #f8f9fa); font-size: 14px; font-weight: 600;">
            📍 \${state.expedition.name || 'Expedition'}
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; color: light-dark(#495057, #adb5bd);">
            <div><strong>Day:</strong> \${state.expedition.day}</div>
            <div><strong>Distance:</strong> \${state.expedition.distance_traveled}km</div>
            <div><strong>Weather:</strong> \${state.expedition.weather}</div>
            <div><strong>Time:</strong> \${state.expedition.time_of_day}</div>
          </div>
        </div>

        <div style="background: light-dark(#fff, #2a2f3a); padding: 16px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
          <h4 style="margin: 0 0 12px 0; color: light-dark(#212529, #f8f9fa); font-size: 14px; font-weight: 600;">
            👥 Party Status
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; color: light-dark(#495057, #adb5bd);">
            <div><strong>Members:</strong> \${state.party.members.length}/\${state.party.max_size}</div>
            <div><strong>Avg Health:</strong> \${avgHealth}%</div>
            <div><strong>Avg Morale:</strong> \${avgMorale}%</div>
            <div><strong>Fatigue:</strong> \${state.party.fatigue}</div>
          </div>
        </div>

        \${criticalResources.length > 0 ? \`
          <div style="background: light-dark(#fff3cd, #664d03); padding: 16px; border-radius: 8px; border: 1px solid light-dark(#ffc107, #996900);">
            <h4 style="margin: 0 0 8px 0; color: light-dark(#856404, #ffc107); font-size: 14px; font-weight: 600;">
              ⚠️ Critical Resources
            </h4>
            <div style="font-size: 13px; color: light-dark(#856404, #ffc107);">
              Low: \${criticalResources.join(', ')}
            </div>
          </div>
        \` : ''}

        <div style="background: light-dark(#fff, #2a2f3a); padding: 16px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
          <h4 style="margin: 0 0 12px 0; color: light-dark(#212529, #f8f9fa); font-size: 14px; font-weight: 600;">
            📢 Recent Events
          </h4>
          <div style="font-size: 12px; color: light-dark(#495057, #adb5bd);">
            \${state.meta.notifications.slice(0, 5).map(n => \`<div style="padding: 4px 0; border-bottom: 1px solid light-dark(rgba(0,0,0,0.05), rgba(255,255,255,0.05));">\${n}</div>\`).join('') || '<div>No recent events</div>'}
          </div>
        </div>
      </div>
    \`;
  }

  function renderMapScreen() {
    const state = getState();
    const discoveredRegions = Object.values(state.world.regions).filter(r => r.discovered);

    if (discoveredRegions.length === 0) {
      return \`<div style="text-align: center; padding: 40px 20px; color: light-dark(#495057, #adb5bd);">
        <p>Start an expedition to discover regions.</p>
      </div>\`;
    }

    return \`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        \${discoveredRegions.map(region => {
          const isCurrent = region.id === state.expedition.current_region;
          return \`
            <div style="
              background: \${isCurrent ? 'light-dark(#e3f2fd, #0d47a1)' : 'light-dark(#fff, #2a2f3a)'};
              padding: 12px;
              border-radius: 8px;
              border: 2px solid \${isCurrent ? 'light-dark(#2196f3, #1976d2)' : 'light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1))'};
            ">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div>
                  <h5 style="margin: 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">
                    \${isCurrent ? '📍 ' : ''}\${region.id}
                  </h5>
                  <div style="font-size: 11px; color: light-dark(#6c757d, #adb5bd); margin-top: 4px;">
                    \${region.biome} | Danger: \${region.danger_level}/10 | Resources: \${region.resource_richness}/10
                  </div>
                </div>
                \${!isCurrent ? \`
                  <button
                    onclick="window.__pcbw_travelTo('\${region.id}')"
                    style="
                      padding: 6px 12px;
                      background: light-dark(#4dabf7, #1864ab);
                      color: white;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 11px;
                      font-weight: 500;
                    "
                  >
                    Travel
                  </button>
                \` : ''}
              </div>
              <div style="font-size: 11px; color: light-dark(#495057, #adb5bd);">
                Visited: \${region.visited_count} times | Events: \${region.events_remaining} remaining
              </div>
            </div>
          \`;
        }).join('')}
      </div>
    \`;
  }

  function renderPartyScreen() {
    const state = getState();

    if (state.party.members.length === 0) {
      return \`<div style="text-align: center; padding: 40px 20px; color: light-dark(#495057, #adb5bd);">
        <p>No party members. Use /recruit [name] [role] to add members.</p>
      </div>\`;
    }

    return \`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        \${state.party.members.map(member => \`
          <div style="background: light-dark(#fff, #2a2f3a); padding: 12px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <div>
                <h5 style="margin: 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">
                  \${member.name}
                </h5>
                <div style="font-size: 11px; color: light-dark(#6c757d, #adb5bd); margin-top: 2px;">
                  \${member.role} | XP: \${member.experience}
                </div>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="color: light-dark(#495057, #adb5bd);">Health</span>
                <span style="color: light-dark(#212529, #f8f9fa); font-weight: 600;">\${member.health}/\${member.max_health}</span>
              </div>
              <div style="height: 6px; background: light-dark(#e9ecef, #343a40); border-radius: 3px; overflow: hidden;">
                <div style="width: \${(member.health / member.max_health) * 100}%; height: 100%; background: \${member.health > 50 ? '#51cf66' : member.health > 25 ? '#ffd43b' : '#ff6b6b'}; transition: width 0.3s;"></div>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="color: light-dark(#495057, #adb5bd);">Morale</span>
                <span style="color: light-dark(#212529, #f8f9fa); font-weight: 600;">\${member.morale}/100</span>
              </div>
              <div style="height: 6px; background: light-dark(#e9ecef, #343a40); border-radius: 3px; overflow: hidden;">
                <div style="width: \${member.morale}%; height: 100%; background: \${member.morale > 60 ? '#4dabf7' : member.morale > 30 ? '#ffd43b' : '#ff6b6b'}; transition: width 0.3s;"></div>
              </div>
            </div>

            <div style="font-size: 11px; color: light-dark(#495057, #adb5bd);">
              <div><strong>Skills:</strong> \${member.skills.join(', ')}</div>
              \${member.traits.positive.length > 0 ? \`<div style="margin-top: 4px;"><strong>Traits:</strong> \${member.traits.positive.join(', ')}</div>\` : ''}
              \${member.traits.negative.length > 0 ? \`<div style="margin-top: 4px;"><strong>Flaws:</strong> \${member.traits.negative.join(', ')}</div>\` : ''}
              \${member.fatigue > 0 ? \`<div style="margin-top: 4px;"><strong>Fatigue:</strong> \${member.fatigue}/100</div>\` : ''}
            </div>
          </div>
        \`).join('')}
      </div>
    \`;
  }

  function renderInventoryScreen() {
    const state = getState();

    return \`
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        \${RESOURCE_TYPES.map(resource => {
          const amount = state.resources[resource];
          const status = amount < 5 ? 'critical' : amount < 15 ? 'low' : 'ok';
          const color = status === 'critical' ? '#ff6b6b' : status === 'low' ? '#ffd43b' : '#51cf66';

          return \`
            <div style="background: light-dark(#fff, #2a2f3a); padding: 12px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
              <div style="font-size: 11px; color: light-dark(#6c757d, #adb5bd); text-transform: uppercase; margin-bottom: 6px;">
                \${resource}
              </div>
              <div style="font-size: 20px; font-weight: 700; color: \${color}; margin-bottom: 8px;">
                \${amount}
              </div>
              <div style="height: 4px; background: light-dark(#e9ecef, #343a40); border-radius: 2px; overflow: hidden;">
                <div style="width: \${Math.min(100, amount)}%; height: 100%; background: \${color}; transition: width 0.3s;"></div>
              </div>
              \${status !== 'ok' ? \`
                <div style="font-size: 10px; color: \${color}; margin-top: 4px; font-weight: 600; text-transform: uppercase;">
                  \${status}
                </div>
              \` : ''}
            </div>
          \`;
        }).join('')}
      </div>
    \`;
  }

  function renderContractsScreen() {
    const state = getState();

    return \`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        \${state.contracts.primary ? \`
          <div style="background: light-dark(#fff, #2a2f3a); padding: 16px; border-radius: 8px; border: 2px solid light-dark(#4dabf7, #1864ab);">
            <h4 style="margin: 0 0 8px 0; color: light-dark(#212529, #f8f9fa); font-size: 14px; font-weight: 600;">
              📜 Primary Contract
            </h4>
            <h5 style="margin: 0 0 8px 0; color: light-dark(#212529, #f8f9fa); font-size: 13px;">
              \${state.contracts.primary.title}
            </h5>
            <div style="font-size: 12px; color: light-dark(#495057, #adb5bd); margin-bottom: 12px;">
              \${state.contracts.primary.description}
            </div>
            <div style="font-size: 11px; color: light-dark(#495057, #adb5bd);">
              <strong>Objectives:</strong>
              \${state.contracts.primary.objectives.map(obj => \`
                <div style="padding: 4px 0; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 16px;">\${obj.completed ? '✅' : '⏳'}</span>
                  <span>\${obj.description} (\${obj.current}/\${obj.required})</span>
                </div>
              \`).join('')}
            </div>
          </div>
        \` : '<div style="text-align: center; padding: 20px; color: light-dark(#6c757d, #adb5bd);">No active primary contract</div>'}

        \${state.contracts.secondary.length > 0 ? \`
          <div>
            <h4 style="margin: 0 0 12px 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">
              Secondary Contracts
            </h4>
            \${state.contracts.secondary.map(contract => \`
              <div style="background: light-dark(#fff, #2a2f3a); padding: 12px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1)); margin-bottom: 8px;">
                <h5 style="margin: 0 0 4px 0; color: light-dark(#212529, #f8f9fa); font-size: 12px; font-weight: 600;">
                  \${contract.title}
                </h5>
                <div style="font-size: 11px; color: light-dark(#495057, #adb5bd);">
                  \${contract.objectives.filter(o => o.completed).length}/\${contract.objectives.length} objectives complete
                </div>
              </div>
            \`).join('')}
          </div>
        \` : ''}

        \${state.contracts.completed.length > 0 ? \`
          <div>
            <h4 style="margin: 0 0 12px 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">
              Completed (Last 3)
            </h4>
            \${state.contracts.completed.slice(-3).reverse().map(contract => \`
              <div style="background: light-dark(#d3f9d8, #2b8a3e); padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 11px; color: light-dark(#2b8a3e, #d3f9d8);">
                ✓ \${contract.title} (Day \${contract.completed_day})
              </div>
            \`).join('')}
          </div>
        \` : ''}
      </div>
    \`;
  }

  function renderTimelineScreen() {
    const state = getState();
    const allEvents = [
      ...state.history.major_events.map(e => ({ ...e, icon: '🌟' })),
      ...state.history.decisions.map(e => ({ ...e, icon: '⚖️' })),
      ...state.history.discoveries.map(e => ({ ...e, icon: '🔍' })),
      ...state.history.relationships.map(e => ({ ...e, icon: '💬' })),
      ...state.history.faction_events.map(e => ({ ...e, icon: '🏛️' }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);

    if (allEvents.length === 0) {
      return \`<div style="text-align: center; padding: 40px 20px; color: light-dark(#6c757d, #adb5bd);">
        No events recorded yet.
      </div>\`;
    }

    return \`
      <div style="display: flex; flex-direction: column; gap: 8px;">
        \${allEvents.map(event => \`
          <div style="background: light-dark(#fff, #2a2f3a); padding: 10px 12px; border-radius: 6px; border-left: 3px solid light-dark(#4dabf7, #1864ab);">
            <div style="display: flex; align-items: start; gap: 8px;">
              <span style="font-size: 14px;">\${event.icon}</span>
              <div style="flex: 1;">
                <div style="font-size: 12px; color: light-dark(#212529, #f8f9fa); font-weight: 500; margin-bottom: 2px;">
                  \${event.description}
                </div>
                <div style="font-size: 10px; color: light-dark(#6c757d, #adb5bd);">
                  Day \${event.day} | \${event.category}
                </div>
              </div>
            </div>
          </div>
        \`).join('')}
      </div>
    \`;
  }

  function renderDebugScreen() {
    const state = getState();
    const saves = listSaves();

    return \`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: light-dark(#fff, #2a2f3a); padding: 12px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
          <h4 style="margin: 0 0 8px 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">System Info</h4>
          <div style="font-size: 11px; color: light-dark(#495057, #adb5bd); font-family: monospace;">
            <div>Schema: \${state.schema_version}</div>
            <div>Seed: \${state.world.seed || 'none'}</div>
            <div>Sessions: \${state.meta.sessions}</div>
            <div>Commands: \${state.meta.commands_used}</div>
            <div>Regions: \${Object.keys(state.world.regions).length}</div>
            <div>Party: \${state.party.members.length}</div>
            <div>Events Logged: \${state.history.major_events.length}</div>
          </div>
        </div>

        <div style="background: light-dark(#fff, #2a2f3a); padding: 12px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
          <h4 style="margin: 0 0 8px 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">Save Management</h4>
          <button
            onclick="window.__pcbw_saveExpedition('quicksave')"
            style="
              width: 100%;
              padding: 8px;
              background: light-dark(#51cf66, #2b8a3e);
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              margin-bottom: 8px;
            "
          >
            💾 Quick Save
          </button>

          \${saves.length > 0 ? \`
            <div style="font-size: 11px; color: light-dark(#495057, #adb5bd); margin-top: 8px;">
              <strong>Saved Expeditions:</strong>
              \${saves.map(save => \`
                <div style="padding: 6px; margin-top: 4px; background: light-dark(#f8f9fa, #212529); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div>\${save.metadata.expedition_name || 'Unnamed'}</div>
                    <div style="font-size: 10px; color: light-dark(#6c757d, #868e96);">
                      Day \${save.metadata.day} | \${new Date(save.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onclick="window.__pcbw_loadExpedition('\${save.slot}')"
                    style="
                      padding: 4px 8px;
                      background: light-dark(#4dabf7, #1864ab);
                      color: white;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 10px;
                    "
                  >
                    Load
                  </button>
                </div>
              \`).join('')}
            </div>
          \` : '<div style="font-size: 11px; color: light-dark(#6c757d, #adb5bd); margin-top: 8px;">No saves found</div>'}
        </div>

        <div style="background: light-dark(#fff, #2a2f3a); padding: 12px; border-radius: 8px; border: 1px solid light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1));">
          <h4 style="margin: 0 0 8px 0; color: light-dark(#212529, #f8f9fa); font-size: 13px; font-weight: 600;">Debug Actions</h4>
          <button
            onclick="window.__pcbw_exportState()"
            style="
              width: 100%;
              padding: 8px;
              background: light-dark(#4dabf7, #1864ab);
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              margin-bottom: 6px;
            "
          >
            Export State to Console
          </button>
          <button
            onclick="window.__pcbw_resetState()"
            style="
              width: 100%;
              padding: 8px;
              background: light-dark(#ff6b6b, #c92a2a);
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            "
          >
            ⚠️ Reset All Data
          </button>
        </div>
      </div>
    \`;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
      info: 'light-dark(#4dabf7, #1864ab)',
      success: 'light-dark(#51cf66, #2b8a3e)',
      error: 'light-dark(#ff6b6b, #c92a2a)',
      warning: 'light-dark(#ffd43b, #f59f00)'
    };

    toast.style.cssText = [
      'position: fixed',
      'bottom: 20px',
      'right: 20px',
      'background: ' + colors[type],
      'color: white',
      'padding: 12px 16px',
      'border-radius: 8px',
      'box-shadow: 0 4px 12px rgba(0,0,0,0.2)',
      'z-index: 9999999',
      'font-size: 13px',
      'font-weight: 500',
      'animation: slideIn 0.3s ease-out',
      'max-width: 300px'
    ].join('; ');

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function toggleUI(show) {
    const state = getState();
    state.meta.ui_visible = show !== undefined ? show : !state.meta.ui_visible;
    setState(state);
    renderUI();
  }

  function switchScreen(screenId) {
    const state = getState();
    state.meta.current_screen = screenId;
    setState(state);
    renderUI();
  }

  // ============================================================
  // WINDOW HANDLERS (for onclick)
  // ============================================================

  window.__pcbw_toggleUI = toggleUI;
  window.__pcbw_switchScreen = switchScreen;

  window.__pcbw_travelTo = (regionId) => {
    const gateCheck = checkResourceGating('travel');
    if (!gateCheck.allowed) {
      showToast('Cannot travel: insufficient ' + gateCheck.missing.join(', '), 'error');
      return;
    }

    const state = getState();
    const region = state.world.regions[regionId];

    if (!region || !region.discovered) {
      showToast('Region not discovered', 'error');
      return;
    }

    state.expedition.current_region = regionId;
    state.expedition.distance_traveled += 10;
    state.expedition.day += 1;
    region.visited_count += 1;

    modifyResource('food', -5);
    modifyResource('water', -5);
    modifyResource('fuel', -2);

    applyFatigue(10);

    // Update scene mode
    updateSceneMode('travel');

    // Generate event with chance
    if (Math.random() < 0.3) {
      const event = generateEvent(regionId);
      if (event) {
        logEvent('major_events', \`Event: \${event.title} - \${event.description}\`, event);
      }
    }

    setState(state);
    logEvent('major_events', \`Traveled to \${regionId}\`, { distance: 10 });
    renderUI();
    showToast('Traveled to ' + regionId, 'success');
  };

  window.__pcbw_exportState = () => {
    const state = getState();
    console.log('=== CHRONICLE FOUNDRY STATE EXPORT ===');
    console.log(JSON.stringify(state, null, 2));
    showToast('State exported to console', 'info');
  };

  window.__pcbw_resetState = () => {
    if (confirm('Reset all expedition data? This cannot be undone.')) {
      initState();
      renderUI();
      showToast('All data reset', 'warning');
    }
  };

  window.__pcbw_saveExpedition = (slot) => {
    const result = saveExpedition(slot || 'quicksave');
    if (result.success) {
      showToast('Expedition saved', 'success');
      renderUI();
    } else {
      showToast('Save failed: ' + result.error, 'error');
    }
  };

  window.__pcbw_loadExpedition = (slot) => {
    const result = loadExpedition(slot);
    if (result.success) {
      showToast('Expedition loaded', 'success');
      renderUI();
    } else {
      showToast('Load failed: ' + result.error, 'error');
    }
  };

  // ============================================================
  // COMMAND SYSTEM
  // ============================================================

  function parseCommand(message) {
    const text = message.content.trim();
    if (!text.startsWith('/')) return null;

    const parts = text.slice(1).split(/\\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    return { command, args, raw: text };
  }

  function handleCommand(parsed) {
    const state = getState();
    state.meta.commands_used += 1;
    setState(state);

    const handlers = {
      help: cmdHelp,
      begin: cmdBegin,
      ui: cmdUI,
      screen: cmdScreen,
      camp: cmdCamp,
      travel: cmdTravel,
      recruit: cmdRecruit,
      gather: cmdGather,
      save: cmdSave,
      load: cmdLoad,
      contract: cmdContract,
      status: cmdStatus
    };

    const handler = handlers[parsed.command];
    if (!handler) {
      return {
        handled: false,
        response: null
      };
    }

    return handler(parsed.args);
  }

  function cmdHelp() {
    return {
      handled: true,
      response: \`**Chronicle Foundry v1.3 Commands**

**Core Commands:**
\\\`/begin [name]\\\` - Start new expedition
\\\`/ui\\\` - Toggle interface
\\\`/screen [name]\\\` - Switch screen (dashboard, map, party, inventory, contracts, timeline, debug)
\\\`/status\\\` - Show current expedition status
\\\`/help\\\` - Show this help

**Expedition Commands:**
\\\`/travel [region]\\\` - Travel to discovered region
\\\`/camp\\\` - Make camp and rest
\\\`/recruit [name] [role]\\\` - Recruit party member
\\\`/gather\\\` - Gather resources in current region

**Management Commands:**
\\\`/save [slot]\\\` - Save expedition (default: quicksave)
\\\`/load [slot]\\\` - Load expedition
\\\`/contract\\\` - View active contracts

**Available Roles:** scout, medic, engineer, guard, specialist, diplomat, researcher

Use the interface buttons or type commands to play. Resource decisions matter—manage supplies carefully!\`
    };
  }

  function cmdBegin(args) {
    const state = getState();

    if (state.expedition.active) {
      return {
        handled: true,
        response: 'An expedition is already active. Use /save and /load to manage expeditions.'
      };
    }

    const expeditionName = args.join(' ') || 'Frontier Expedition';
    const seed = generateSeed();

    state.expedition.active = true;
    state.expedition.name = expeditionName;
    state.expedition.seed = seed;
    state.expedition.day = 1;
    state.world.seed = seed;

    // Generate starting region and connected regions
    const startRegion = generateRegion(seed, 'region_0');
    startRegion.discovered = true;
    startRegion.visited_count = 1;
    state.world.regions['region_0'] = startRegion;

    for (let i = 1; i <= 3; i++) {
      const region = generateRegion(seed, 'region_' + i);
      region.discovered = true;
      state.world.regions['region_' + i] = region;
      startRegion.connections.push('region_' + i);
    }

    // Starting resources
    state.resources = {
      food: 50,
      water: 50,
      medicine: 20,
      tools: 15,
      fuel: 25,
      materials: 10
    };

    // Generate starting contract
    const startingContract = createContract(
      'Frontier Survey',
      'Complete an initial survey of the frontier region',
      [
        { description: 'Discover 5 regions', required: 5 },
        { description: 'Recruit 3 party members', required: 3 }
      ],
      {
        resources: { food: 30, water: 30, medicine: 15 },
        faction_standing: 10
      },
      'frontier_guild'
    );
    acceptContract(startingContract);

    setState(state);
    updateSceneMode('planning');
    logEvent('major_events', \`Expedition "\${expeditionName}" begins\`, { seed: seed });

    renderUI();

    return {
      handled: true,
      response: \`**Expedition "\${expeditionName}" Begins**

World seed: \\\`\${seed}\\\`

Your expedition begins at region_0, a \${startRegion.biome} region. Three adjacent regions are visible on your map. Your party starts with basic supplies and a contract from the Frontier Guild.

The interface is now active. Click tabs to navigate or use commands to manage your expedition.

Good luck, Commander. The frontier is unforgiving—but the discoveries are worth it.\`
    };
  }

  function cmdUI() {
    toggleUI();
    return {
      handled: true,
      response: getState().meta.ui_visible ? 'Interface opened.' : 'Interface closed.'
    };
  }

  function cmdScreen(args) {
    if (args.length === 0) {
      return {
        handled: true,
        response: 'Available screens: dashboard, map, party, inventory, contracts, timeline, debug'
      };
    }

    switchScreen(args[0]);
    return {
      handled: true,
      response: \`Switched to \${args[0]} screen.\`
    };
  }

  function cmdCamp() {
    const gateCheck = checkResourceGating('camp');
    if (!gateCheck.allowed) {
      return {
        handled: true,
        response: \`Cannot make camp. Insufficient resources: \${gateCheck.missing.join(', ')}\`
      };
    }

    const state = getState();
    const memberCount = state.party.members.length;

    state.expedition.day += 1;

    // Consume resources
    modifyResource('food', -(3 * memberCount));
    modifyResource('water', -(3 * memberCount));
    modifyResource('fuel', -5);

    // Recovery
    state.party.members.forEach(member => {
      member.health = Math.min(member.max_health, member.health + 15);
      member.morale = Math.min(100, member.morale + 10);
      member.fatigue = Math.max(0, member.fatigue - 30);
    });

    setState(state);
    updateSceneMode('camp');
    logEvent('major_events', 'Party makes camp', { day: state.expedition.day });
    renderUI();

    return {
      handled: true,
      response: \`**Camp Made**

The party rests for the night. Resources consumed, health and morale recovering. Fatigue reduced.

Day advanced to \${state.expedition.day}.\`
    };
  }

  function cmdTravel(args) {
    if (args.length === 0) {
      return {
        handled: true,
        response: 'Specify a region ID. Use /screen map to see discovered regions.'
      };
    }

    const regionId = args[0];
    const gateCheck = checkResourceGating('travel');

    if (!gateCheck.allowed) {
      return {
        handled: true,
        response: \`Cannot travel. Insufficient resources: \${gateCheck.missing.join(', ')}\`
      };
    }

    const state = getState();
    const region = state.world.regions[regionId];

    if (!region || !region.discovered) {
      return {
        handled: true,
        response: 'Region not found or not yet discovered.'
      };
    }

    window.__pcbw_travelTo(regionId);

    return {
      handled: true,
      response: \`Traveled to \${regionId}. Check the map screen for details.\`
    };
  }

  function cmdRecruit(args) {
    if (args.length < 2) {
      return {
        handled: true,
        response: 'Usage: /recruit [name] [role]. Available roles: scout, medic, engineer, guard, specialist, diplomat, researcher'
      };
    }

    const name = args[0];
    const role = args[1].toLowerCase();

    if (!PARTY_ROLES.includes(role)) {
      return {
        handled: true,
        response: \`Invalid role. Available: \${PARTY_ROLES.join(', ')}\`
      };
    }

    const state = getState();

    if (state.party.members.length >= state.party.max_size) {
      return {
        handled: true,
        response: 'Party is full (max 6 members).'
      };
    }

    const member = createPartyMember(name, role);
    state.party.members.push(member);

    // Update contract progress if applicable
    if (state.contracts.primary) {
      updateContractProgress(state.contracts.primary.id, 1, 1);
    }

    setState(state);
    logEvent('major_events', \`\${name} recruited as \${role}\`, { member: name, role: role });
    renderUI();

    return {
      handled: true,
      response: \`**\${name} Recruited**

Role: \${role}
Skills: \${member.skills.join(', ')}
Traits: \${member.traits.positive.join(', ')}

\${name} joins your expedition. Check the party screen for full details.\`
    };
  }

  function cmdGather() {
    const gateCheck = checkResourceGating('gather');
    if (!gateCheck.allowed) {
      return {
        handled: true,
        response: \`Cannot gather. Insufficient resources: \${gateCheck.missing.join(', ')}\`
      };
    }

    const state = getState();
    const region = state.world.regions[state.expedition.current_region];

    if (!region) {
      return {
        handled: true,
        response: 'No current region.'
      };
    }

    const richness = region.resource_richness;
    const foodGain = Math.floor((Math.random() * 10 + 5) * (richness / 5));
    const waterGain = Math.floor((Math.random() * 8 + 3) * (richness / 5));
    const materialsGain = Math.floor((Math.random() * 6 + 2) * (richness / 5));

    modifyResource('food', foodGain);
    modifyResource('water', waterGain);
    modifyResource('materials', materialsGain);
    modifyResource('tools', -1);

    logEvent('major_events', \`Resources gathered in \${region.id}\`, { food: foodGain, water: waterGain, materials: materialsGain });
    renderUI();

    return {
      handled: true,
      response: \`**Resources Gathered**

Food: +\${foodGain}
Water: +\${waterGain}
Materials: +\${materialsGain}

Tools worn down (-1). Region richness: \${richness}/10.\`
    };
  }

  function cmdSave(args) {
    const slot = args[0] || 'quicksave';
    const result = saveExpedition(slot);

    if (result.success) {
      return {
        handled: true,
        response: \`Expedition saved to slot "\${slot}".\`
      };
    } else {
      return {
        handled: true,
        response: \`Save failed: \${result.error}\`
      };
    }
  }

  function cmdLoad(args) {
    if (args.length === 0) {
      const saves = listSaves();
      if (saves.length === 0) {
        return {
          handled: true,
          response: 'No saved expeditions found.'
        };
      }

      return {
        handled: true,
        response: \`**Saved Expeditions:**

\${saves.map(s => \`- \${s.slot}: \${s.metadata.expedition_name} (Day \${s.metadata.day})\`).join('\\n')}

Use /load [slot] to load.\`
      };
    }

    const slot = args[0];
    const result = loadExpedition(slot);

    if (result.success) {
      return {
        handled: true,
        response: \`Expedition "\${result.metadata.expedition_name}" loaded from slot "\${slot}".\`
      };
    } else {
      return {
        handled: true,
        response: \`Load failed: \${result.error}\`
      };
    }
  }

  function cmdContract() {
    const state = getState();

    if (!state.contracts.primary) {
      return {
        handled: true,
        response: 'No active primary contract. Check the contracts screen for details.'
      };
    }

    const contract = state.contracts.primary;
    const objectivesText = contract.objectives.map(obj =>
      \`- [\${obj.completed ? 'X' : ' '}] \${obj.description} (\${obj.current}/\${obj.required})\`
    ).join('\\n');

    return {
      handled: true,
      response: \`**\${contract.title}**

\${contract.description}

**Objectives:**
\${objectivesText}

Check the contracts screen for full details.\`
    };
  }

  function cmdStatus() {
    const state = getState();

    if (!state.expedition.active) {
      return {
        handled: true,
        response: 'No active expedition. Use /begin to start.'
      };
    }

    const avgHealth = state.party.members.length > 0
      ? Math.floor(state.party.members.reduce((sum, m) => sum + m.health, 0) / state.party.members.length)
      : 0;

    const avgMorale = state.party.members.length > 0
      ? Math.floor(state.party.members.reduce((sum, m) => sum + m.morale, 0) / state.party.members.length)
      : 0;

    return {
      handled: true,
      response: \`**\${state.expedition.name}**

Day: \${state.expedition.day} | Distance: \${state.expedition.distance_traveled}km
Region: \${state.expedition.current_region}
Weather: \${state.expedition.weather} | \${state.expedition.time_of_day}

Party: \${state.party.members.length}/\${state.party.max_size} members
Avg Health: \${avgHealth}% | Avg Morale: \${avgMorale}%

Food: \${state.resources.food} | Water: \${state.resources.water}
Medicine: \${state.resources.medicine} | Tools: \${state.resources.tools}

Use /ui to open full interface.\`
    };
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  oc.thread.on('MessageAdded', async () => {
    const messages = oc.thread.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.author === 'user') {
      const parsed = parseCommand(lastMessage);

      if (parsed) {
        const result = handleCommand(parsed);

        if (result.handled && result.response) {
          oc.thread.messages.push({
            author: 'system',
            content: result.response,
            hiddenFrom: [],
            expectsReply: false
          });
        }
      }
    }

    // Refresh UI after any message
    renderUI();
  });

  // ============================================================
  // INITIALIZATION
  // ============================================================

  initState();
  renderUI();

  console.log('[Chronicle Foundry v1.3] Initialized');

})();
`;

// Assign the customCode
characterRow.customCode = phase3CustomCode;

// Write the final Phase 3 export
const outputPath = path.join(__dirname, 'frontier_foundry_1.3.json');
fs.writeFileSync(outputPath, JSON.stringify(phase3, null, 2));

console.log('✓ Chronicle Foundry v1.3 Final built successfully');
console.log('  Output:', outputPath);
console.log('  Schema:', phase3.data.data[0].rows[0].customData.PUBLIC.schema_version);
console.log('  CustomCode size:', phase3CustomCode.length, 'characters');
console.log('\nPhase 3 capabilities:');
phase3.data.data[0].rows[0].customData.PUBLIC.capabilities.forEach(cap => {
  console.log('  -', cap);
});

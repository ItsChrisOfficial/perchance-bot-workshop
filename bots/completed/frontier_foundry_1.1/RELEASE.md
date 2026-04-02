## Bot

- Name: Frontier Foundry v1.1 - Chronicle Foundry: Living Expedition Engine
- Lifecycle state: completed (Phase 1 Foundation)
- Export artifact path: `bots/completed/frontier_foundry_1.1/frontier_foundry_1.1.json`
- Release version: v1.1.0-phase1
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Phase 1 Implementation Status

### Completed Foundation Systems ✓

**Core Architecture:**
- ✓ Full Perchance export envelope with canonical table structure
- ✓ Programmatic JSON generation via build script (no hand-editing)
- ✓ Init guard pattern (`__pcbw_frontier_foundry_init`)
- ✓ Schema versioning (v1.1.0-phase1)
- ✓ State migration hook (ready for Phase 2)
- ✓ Namespaced storage (`__pcbw_frontier_foundry`)

**World & Exploration:**
- ✓ Deterministic world seed generation (16-char alphanumeric)
- ✓ Seed-based PRNG for consistent world generation
- ✓ Region generation system (biome, danger, resources)
- ✓ Travel network foundation (connections tracking)
- ✓ Discovered locations registry
- ✓ Current region tracking

**Party Management:**
- ✓ Party member data model (name, role, health, morale, skills, inventory, status effects)
- ✓ Party roster with max size enforcement (6 members)
- ✓ Health and morale aggregate tracking
- ✓ Role-based party composition (scout, medic, engineer, guard, specialist)
- ✓ Party creation helpers

**Resource Economy:**
- ✓ Six resource types (food, water, medicine, tools, fuel, materials)
- ✓ Resource modification API
- ✓ Resource status reporting
- ✓ Zero-floor enforcement (no negative resources)

**Contracts & Objectives:**
- ✓ Contract data model (title, description, objectives, progress, status)
- ✓ Primary and secondary contract tracking
- ✓ Completed contract history
- ✓ Contract creation API

**Faction System:**
- ✓ Faction registry (known factions tracking)
- ✓ Standing system (numeric reputation per faction)
- ✓ Interaction counter per faction
- ✓ Dynamic faction registration

**Event History:**
- ✓ Three-category event log (major_events, decisions, discoveries)
- ✓ Timestamped event entries with metadata
- ✓ Expedition day correlation
- ✓ History size cap (50 entries per category)
- ✓ Event logging API

**Persistence & State:**
- ✓ JSON-serializable state schema
- ✓ Deep-copy default state initialization
- ✓ State save/load helpers
- ✓ Session counter
- ✓ Last-save timestamps
- ✓ Command usage tracking

**Hidden System Context:**
- ✓ Hidden message injection with user filtering
- ✓ Max hidden message cap (10) with oldest-removal
- ✓ State context builder for AI awareness
- ✓ Expedition status summary generation

**Command System:**
- ✓ Command parser with `/` prefix detection
- ✓ Command interception before AI sees message
- ✓ 10 functional commands: `/help`, `/status`, `/map`, `/party`, `/resources`, `/contracts`, `/seed`, `/reset`, `/debug`, `confirm reset`
- ✓ Command response as system messages
- ✓ Unknown command feedback

**AI Integration:**
- ✓ Rich roleInstruction (world concept, responsibilities, tone, style)
- ✓ Focused reminderMessage (present tense, second person, weight)
- ✓ Initial message sequence (system + AI opening)
- ✓ Baseline shortcut buttons (Status, Map, Help)
- ✓ MessageAdded handler for command processing
- ✓ Post-AI-message state sync

**Build & Validation:**
- ✓ Programmatic build script (Node.js)
- ✓ No hand-edited JSON
- ✓ Full validation pass (node + python)
- ✓ Export envelope integrity
- ✓ CustomCode syntax validation
- ✓ Schema compliance

### Phase 1 Subsystems Ready for Phase 2 Extension

- World generation (extend to multi-region travel, encounter tables)
- Party management (extend to skills/progression, injuries, equipment)
- Resource system (extend to degradation, crafting, trade)
- Contract system (extend to objectives progress tracking, rewards)
- Faction system (extend to dynamic events, quest lines)
- Event history (extend to queryable log, summary generation)
- Command system (extend to complex args, aliases)
- Hidden context (extend to adaptive injection, relevance filtering)

### What Phase 2 Must Build

**Major Systems (not yet implemented):**
- Iframe UI application (panels, toolbar, drawers, tabs)
- Visual map renderer
- Travel/movement mechanics with distance/time
- Encounter resolution (combat placeholder, diplomacy, discovery)
- Resource consumption per day
- Party health/morale degradation
- Contract objective progress tracking
- World expansion (multi-region generation, connection building)
- Scene transition integration
- Save/load UI
- Advanced command suite (travel, rest, craft, trade)
- Dynamic shortcut button orchestration
- AI response post-processing
- Lore injection system
- Progressive disclosure for tutorials

**Polish & Refinement (Phase 3):**
- Full UI theme system
- Avatar expression routing
- Scene-reactive background/music
- Advanced event classification
- Pyodide integration for complex simulation
- Export/share functionality
- Mobile optimization
- Accessibility audit

## Notes

- **Promotion context:** This is a **Phase 1 foundation-only release**. It establishes the engine backbone for a very large, system-dense Perchance bot. All core data structures, persistence patterns, and baseline mechanics are implemented and validated. The bot is fully importable and functional but deliberately incomplete—Phase 2 will build the full UI and advanced mechanics on this foundation.

- **Known constraints:**
  - Phase 1 is **command-driven only**; no iframe UI yet
  - No combat/encounter resolution (foundation data structures exist)
  - No travel mechanics beyond region tracking (network exists, traversal logic pending)
  - Resource consumption is manual via commands (auto-consumption in Phase 2)
  - Party health/morale does not degrade automatically (degradation hooks ready)
  - World generation is single-region on init (multi-region expansion in Phase 2)
  - Shortcut buttons are static baseline (dynamic orchestration in Phase 2)

- **Architecture decisions:**
  - Used IIFE wrapper for global scope isolation
  - All state under `__pcbw_frontier_foundry` key (namespaced, conflict-safe)
  - Init guard prevents duplicate registration on reload
  - Deterministic PRNG from seed ensures world consistency
  - Command system intercepts messages before AI for clean separation
  - Hidden context injection caps at 10 messages to prevent context exhaustion (FM-10)
  - Event history caps at 50 entries per category to prevent storage bloat
  - Schema version in state for future migration paths

- **Testing performed:**
  - ✓ Export JSON parses correctly
  - ✓ customCode extracts and syntax-validates
  - ✓ All canonical tables present with correct rowCount
  - ✓ initialMessages and shortcutButtons are valid arrays
  - ✓ Message object contracts respected
  - ✓ Node validator passes
  - ✓ Python validator passes

- **Next maintenance action:** Phase 2 implementation pass must:
  1. Resume from this Phase 1 artifact as baseline
  2. Preserve all Phase 1 foundation systems intact
  3. Add UI layer, travel mechanics, and encounter resolution
  4. Maintain import compatibility with Phase 1 saves (via schema migration)
  5. Test that Phase 1 commands continue to work in Phase 2

## Phase 1 Artifact Preservation

**Critical:** The file `bots/completed/frontier_foundry_1.1/frontier_foundry_1.1.json` is the **Phase 1 preserved artifact**. Phase 2 work must start from this file, not replace it. Create a new versioned file or branch for Phase 2 to maintain Phase 1 integrity.

Build script location: `bots/completed/frontier_foundry_1.1/build-phase1.js`

To regenerate Phase 1 export:
```bash
cd bots/completed/frontier_foundry_1.1
node build-phase1.js
```

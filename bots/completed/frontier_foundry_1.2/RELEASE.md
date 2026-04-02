## Bot

- Name: Frontier Foundry v1.2 - Chronicle Foundry: Living Expedition Engine
- Lifecycle state: completed (Phase 2 UI Application)
- Export artifact path: `bots/completed/frontier_foundry_1.2/frontier_foundry_1.2.json`
- Release version: v1.2.0-phase2
- Release date: 2026-04-02
- Built from: `bots/completed/frontier_foundry_1.1/frontier_foundry_1.1.json` (Phase 1 foundation preserved)

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied
- [x] Phase 1 artifact preserved on current branch
- [x] Phase 2 created as new file (not rename/overwrite)

## Phase 2 Implementation Status

### Completed UI Application Systems ✓

**Iframe UI Shell:**
- ✓ Full iframe application container with show/hide/toggle
- ✓ Fixed positioning with responsive sizing (400px wide, 600px max height)
- ✓ Theme-aware styling using light-dark() CSS function
- ✓ Z-index management (999999) for proper layering
- ✓ Clean open/close animations

**Screen Navigation:**
- ✓ 7 fully functional screens with tab navigation
- ✓ Dashboard screen with expedition overview
- ✓ Map screen with discovered regions and travel actions
- ✓ Party screen with member roster and status bars
- ✓ Inventory screen with resource visualization and warnings
- ✓ Contracts screen with primary/secondary objectives
- ✓ Timeline screen with event history log
- ✓ Debug screen with state inspection and export tools

**Dashboard Screen:**
- ✓ Active expedition summary card
- ✓ Day/distance/weather display
- ✓ Party size and average health/morale
- ✓ Resource summary with critical warnings
- ✓ Current region display
- ✓ Recent notifications feed

**Map Screen:**
- ✓ Discovered regions list with details
- ✓ Current region highlighting
- ✓ Region info cards (biome, danger, resources, visited count)
- ✓ Travel action buttons with onclick handlers
- ✓ Region connection tracking

**Party Screen:**
- ✓ Full party roster with member cards
- ✓ Health and morale progress bars with color coding
- ✓ Status effects display
- ✓ Skills listing per member
- ✓ Role badges

**Inventory Screen:**
- ✓ All 6 resource types with visual bars
- ✓ Critical/low resource warnings
- ✓ Color-coded resource status (critical red, low yellow, ok green)
- ✓ Numeric amounts with bar visualization
- ✓ Grid layout for clean presentation

**Contracts Screen:**
- ✓ Primary objective display with highlighted card
- ✓ Secondary objectives list
- ✓ Completed contracts history (last 3)
- ✓ Empty state messaging

**Timeline Screen:**
- ✓ Combined event log from all 3 history categories
- ✓ Sorted by timestamp (most recent first)
- ✓ Event categorization with icons and colors
- ✓ Day correlation for each event
- ✓ Last 20 events displayed

**Debug Screen:**
- ✓ System info display (schema, sessions, commands, seed)
- ✓ State summary (regions, party, events, factions)
- ✓ Export state button (to console)
- ✓ Reset all data button with confirmation

**Toast Notification System:**
- ✓ Toast creation with type support (info, success, error)
- ✓ Auto-dismiss after 3 seconds
- ✓ Slide-in/slide-out animations
- ✓ Bottom-right positioning
- ✓ Theme-aware coloring

**UI Action Handlers:**
- ✓ \`window.__pcbw_toggleUI(show)\` - Show/hide interface
- ✓ \`window.__pcbw_switchScreen(screenId)\` - Change active screen
- ✓ \`window.__pcbw_travelTo(regionId)\` - Execute travel with consequences
- ✓ \`window.__pcbw_exportState()\` - Export state to console
- ✓ \`window.__pcbw_resetState()\` - Reset with confirmation
- ✓ All handlers update state and trigger UI re-render

**Travel System:**
- ✓ Travel action from map screen
- ✓ Distance tracking (+10km per travel)
- ✓ Day progression (+1 day per travel)
- ✓ Resource consumption (food -5, water -5 per travel)
- ✓ Region visited count increment
- ✓ Travel event logging
- ✓ Toast notification on travel completion

**Day Progression & Rest:**
- ✓ /camp command for making camp
- ✓ Day advancement
- ✓ Party health/morale recovery (+10 health, +5 morale)
- ✓ Fatigue reduction (-20 per camp)
- ✓ Resource consumption during camp (3x food, 3x water per member, 5 fuel)
- ✓ Camp event logging

**Expedition Initialization:**
- ✓ /begin command with expedition naming
- ✓ World seed generation on start
- ✓ Starting region generation and marking as discovered
- ✓ 3 connected adjacent regions generated
- ✓ Initial resource allocation (50 food, 50 water, etc.)
- ✓ Expedition active flag set
- ✓ Day counter initialized to 1
- ✓ Major event logged for expedition start

**Party Management:**
- ✓ /recruit command with name and role
- ✓ Party member creation with full data model
- ✓ Max party size enforcement (6 members)
- ✓ Total health/morale aggregate updates
- ✓ Member display in party screen with progress bars
- ✓ Recruitment event logging

**Resource Gathering:**
- ✓ /gather command for current region
- ✓ Region resource richness affects yield
- ✓ Randomized gather amounts
- ✓ Food, water, and materials gathering
- ✓ Gather event logging
- ✓ Region-aware gathering

**Command System Extensions:**
- ✓ /ui command to toggle interface
- ✓ /screen <name> command to switch screens
- ✓ /begin <name> command to start expedition
- ✓ /camp command for rest
- ✓ /travel <region> command (alternative to UI button)
- ✓ /recruit <name> <role> command
- ✓ /gather command
- ✓ All Phase 1 commands preserved and working
- ✓ Enhanced /help with Phase 2 command list

**State Management:**
- ✓ Schema migration from 1.1.0-phase1 to 1.2.0-phase2
- ✓ All Phase 1 state structure preserved
- ✓ New state fields: weather, time_of_day, fatigue, current_screen, ui_visible, notifications, tutorial_completed
- ✓ Region events_remaining added
- ✓ State persistence across UI interactions
- ✓ Auto-save on state changes

**Real-Time Updates:**
- ✓ UI re-renders on command execution
- ✓ UI refreshes after AI messages
- ✓ Toast notifications for user actions
- ✓ State sync between command results and UI display
- ✓ No duplicate listeners (init guard prevents)

**Build & Validation:**
- ✓ Programmatic build script extending Phase 1
- ✓ No hand-edited JSON
- ✓ Full validation pass (node + python)
- ✓ Phase 1 artifact preserved on branch
- ✓ Phase 2 created as new file

### Phase 2 Fully Usable Features

**User can now:**
- Toggle full expedition interface with /ui
- Navigate between 7 different screens
- Start an expedition with /begin
- Recruit party members with /recruit
- Travel between regions via map screen buttons
- Make camp to rest and recover
- Gather resources in regions
- View live expedition status in dashboard
- Track all resources with visual warnings
- View party health/morale with progress bars
- See event timeline with categorized history
- Inspect debug state and export data
- Receive toast notifications for actions
- Use both commands and UI buttons interchangeably

**Every screen has real data and real actions:**
- Dashboard: shows actual expedition state, not placeholders
- Map: displays discovered regions with travel buttons that work
- Party: shows recruited members with real health/morale bars
- Inventory: displays actual resource amounts with warnings
- Contracts: shows configured contracts (structure ready for content)
- Timeline: displays logged events from actual gameplay
- Debug: provides real state inspection and export

### What Phase 3 Must Finalize

**Content & Balance:**
- Weather system implementation (currently tracked but not active)
- Time-of-day cycle effects
- Event encounter engine (baseline exists, needs content)
- Contract objective auto-progress tracking
- Faction dynamic events and interactions
- Resource degradation over time
- Party fatigue effects on performance
- Tutorial/onboarding flow

**Polish & Refinement:**
- Mobile responsive breakpoints
- Accessibility keyboard navigation
- Scene background/music integration
- Avatar expression routing
- Advanced event classification
- Export/import save functionality
- Pyodide integration for complex simulation (optional)
- Performance optimization for long sessions

**Content Creation:**
- Pre-built expedition templates
- Sample contracts with objectives
- Faction lore and quest chains
- Event encounter library
- Region narrative descriptions
- Party member personality traits

## Notes

- **Promotion context:** This is a **Phase 2 UI application release**. It builds on the Phase 1 foundation with a complete, usable iframe interface. All core screens are functional with real data and real actions. The bot is fully playable after import—users can start expeditions, recruit parties, travel between regions, manage resources, and track progress through the UI. Phase 3 will add content, balance, and polish.

- **Known constraints:**
  - Weather and time-of-day are tracked but don't yet affect gameplay
  - Event encounter engine exists but needs event content library
  - Faction system has data structure but no dynamic events yet
  - Contract objectives track but don't auto-complete
  - Tutorial flow structure exists but not yet activated
  - No save export/import UI (state persists in customData)

- **Architecture decisions:**
  - Extended Phase 1 IIFE wrapper (maintains isolation)
  - All UI handlers prefixed with \`window.__pcbw_\` for onclick access
  - Toast system uses vanilla DOM for simplicity
  - Screen rendering uses template string HTML (no JSX/framework)
  - State updates trigger full UI re-renders (simple, predictable)
  - Command system handles both text commands and UI actions
  - Travel system consumes resources immediately (no deferred costs)
  - Init guard upgraded from v1.1 flag to v1.2 flag
  - UI auto-opens on first session (configurable)

- **Testing performed:**
  - ✓ Export JSON parses correctly
  - ✓ customCode extracts and syntax-validates
  - ✓ All canonical tables present with correct rowCount
  - ✓ initialMessages and shortcutButtons are valid arrays
  - ✓ Node validator passes for both 1.1 and 1.2
  - ✓ Python validator passes
  - ✓ Phase 1 artifact integrity confirmed
  - ✓ UI renders without console errors
  - ✓ All 7 screens render unique content
  - ✓ Action handlers modify state correctly
  - ✓ Toast notifications appear and dismiss
  - ✓ Travel system consumes resources and updates state

- **Next maintenance action:** Phase 3 finalization pass must:
  1. Add weather/time-of-day gameplay effects
  2. Build event encounter content library
  3. Implement contract auto-completion
  4. Create tutorial/onboarding flow
  5. Add save export/import UI
  6. Mobile responsive testing
  7. Accessibility audit
  8. Performance profiling for long sessions

## Phase 2 Artifact Creation

**Source:** Phase 1 artifact `bots/completed/frontier_foundry_1.1/frontier_foundry_1.1.json` (preserved on current branch)

**Output:** Phase 2 artifact `bots/completed/frontier_foundry_1.2/frontier_foundry_1.2.json` (new file, not rename)

**Method:** Programmatic generation via `build-phase2.js` which:
1. Loads Phase 1 JSON as baseline
2. Clones structure via deep JSON parse/stringify
3. Updates schema version to 1.2.0-phase2
4. Replaces customCode with Phase 2 UI application
5. Updates initial messages and shortcut buttons
6. Writes new file to 1.2 folder

**Critical:** Both 1.1 and 1.2 exist on the current branch. 1.1 is preserved as Phase 1 checkpoint. 1.2 is the evolved Phase 2 build.

Build script location: `bots/completed/frontier_foundry_1.2/build-phase2.js`

To regenerate Phase 2 export:
```bash
cd bots/completed/frontier_foundry_1.2
node build-phase2.js
```

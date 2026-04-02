# Reusable Pattern Recipes

Compositions of existing snippets into higher-level bot designs. Each recipe documents what to combine, in what order, and what to watch for.

All snippet paths are relative to `snippets/custom-code/`.

---

## 1. Interactive Builder Bot

**Supports:** Bots that let users configure settings, preferences, or parameters through UI panels and shortcut buttons.

**When to use:** The bot needs a settings/configuration layer that persists across messages — e.g., adjusting AI behavior, toggling features, or selecting modes.

**Required snippets:**
- `ui-ux/ui-tabbed-panel.js` — settings panel with multiple config tabs
- `ui-ux/ui-shortcut-button-orchestrator.js` — buttons that reflect current config state
- `transformations/transforms-state-safe-init-guard.js` — safe customData initialization

**Optional snippets:**
- `ui-ux/ui-toast-notifications.js` — confirm setting changes
- `ui-ux/ui-confirmation-dialog.js` — confirm destructive resets
- `prompting/prompting-dynamic-reminder-router.js` — switch AI behavior based on active config

**Composition order:**
1. `transforms-state-safe-init-guard.js` — initialize customData structure
2. `ui-tabbed-panel.js` — render config UI
3. `ui-shortcut-button-orchestrator.js` — bind buttons to config state
4. `prompting-dynamic-reminder-router.js` — route reminder based on config

**State considerations:**
- All config values live in `oc.thread.customData.__pcbw_config`
- Button labels must update when config changes
- Panel state (open/closed, active tab) should not persist across reloads unless intentional

**Likely conflicts:**
- `ui-tabbed-panel.js` and `ui-slideout-side-panel.js` both create panel containers — do not use together without namespace separation
- Two snippets writing `shortcutButtons` will overwrite each other — only `ui-shortcut-button-orchestrator.js` should own that array

**Implementation notes:**
- Config changes should take effect on next AI response, not retroactively
- Store defaults as constants at the top of the composed customCode block

**Limitations:**
- No server-side persistence — config resets if the user clears thread data
- Complex nested configs may exceed comfortable customData size

---

## 2. State-Driven Companion Bot

**Supports:** Bots with evolving personality, mood, or behavioral states that change based on conversation flow.

**When to use:** The character should feel dynamic — mood shifts, relationship progression, or behavioral changes over time.

**Required snippets:**
- `transformations/transforms-character-state-machine.js` — FSM for mood/personality states
- `prompting/prompting-dynamic-reminder-router.js` — swap system reminder per state
- `transformations/transforms-state-safe-init-guard.js` — safe init

**Optional snippets:**
- `transformations/transforms-runtime-theme-shift.js` — visual theme changes with mood
- `ui-ux/ui-toast-notifications.js` — notify user of state transitions
- `prompting/prompting-last-message-classifier.js` — detect triggers for state transitions

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `transforms-character-state-machine.js`
3. `prompting-last-message-classifier.js`
4. `prompting-dynamic-reminder-router.js`
5. `transforms-runtime-theme-shift.js`

**State considerations:**
- FSM state stored in `oc.thread.customData.__pcbw_char_state`
- State transitions should be deterministic — classify message → check transition table → apply
- Theme shift CSS must not conflict with Perchance base styles

**Likely conflicts:**
- Multiple snippets writing `reminderMessage` — only the router should own it
- Theme shift and manual `wrapperStyle` overrides can clash

**Implementation notes:**
- Define state transition table as a plain object at the top of customCode
- Keep state count under 8 for maintainability
- Log transitions to console during development

**Limitations:**
- LLM classification is probabilistic — misclassification can cause wrong state transitions
- Long threads may accumulate state history; prune periodically

---

## 3. Image-Heavy Art Bot

**Supports:** Bots focused on generating, displaying, or managing AI-generated images alongside conversation.

**When to use:** The bot creates art, mood images, or scene illustrations as a core feature, not a side effect.

**Required snippets:**
- `pregeneration/prewarm-image-cache.js` — cache generated images to avoid redundant generation
- `pregeneration/prebake-image-prompt-builder.js` — construct image prompts from conversation context
- `transformations/transforms-avatar-expression-router.js` — route avatar images based on mood/context

**Optional snippets:**
- `ui-ux/ui-progress-bar.js` — show image generation progress
- `ui-ux/ui-toast-notifications.js` — notify when image is ready
- `prompting/prompting-response-style-enforcer.js` — ensure AI includes image trigger keywords

**Composition order:**
1. `prewarm-image-cache.js` — load cached images at thread start
2. `prebake-image-prompt-builder.js` — prepare prompt templates
3. `transforms-avatar-expression-router.js` — bind expression routing
4. `prompting-response-style-enforcer.js` — ensure AI output includes image cues

**State considerations:**
- Image cache keys in `oc.thread.customData.__pcbw_image_cache`
- Cache should have a size limit — evict oldest entries beyond threshold
- Avatar expression map should be defined as a constant

**Likely conflicts:**
- Multiple snippets setting `oc.character.avatar.url` — only the expression router should own this
- Image prompt builder and style enforcer may produce conflicting formatting requirements

**Implementation notes:**
- Use Perchance text-to-image plugin API, not external services
- Image generation is async — never block message rendering on it
- Test with image generation disabled to ensure bot still functions

**Limitations:**
- Perchance image generation has rate limits and may fail silently
- Generated images are ephemeral — no persistent gallery without external storage
- Avatar expression routing requires predefined expression set

---

## 4. Transformation-Heavy Bot

**Supports:** Bots with complex multi-axis state changes — simultaneous scene transitions, mode switches, and character evolution.

**When to use:** The bot has multiple independent transformation axes that need to stay synchronized.

**Required snippets:**
- `transformations/transforms-character-state-machine.js` — character-level FSM
- `transformations/transforms-mode-switcher.js` — mode toggling (e.g., combat/exploration/dialogue)
- `transformations/transforms-scene-transition-engine.js` — scene graph management
- `transformations/transforms-state-safe-init-guard.js` — safe init for all state

**Optional snippets:**
- `prompting/prompting-dynamic-reminder-router.js` — context-aware prompting
- `ui-ux/ui-toast-notifications.js` — transition feedback
- `prompting/prompting-last-message-classifier.js` — trigger detection

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `transforms-character-state-machine.js`
3. `transforms-mode-switcher.js`
4. `transforms-scene-transition-engine.js`
5. `prompting-last-message-classifier.js`
6. `prompting-dynamic-reminder-router.js`

**State considerations:**
- Three independent state axes: character state, mode, scene
- All stored under `oc.thread.customData` with separate `__pcbw_` keys
- Cross-axis dependencies must be explicit (e.g., entering `"dungeon"` scene forces `"combat"` mode)

**Likely conflicts:**
- Scene engine and mode switcher may both try to update the reminder — use the dynamic reminder router as the single owner
- State machine and mode switcher both react to messages — define clear trigger priority

**Implementation notes:**
- Draw the full state × mode × scene matrix before coding
- Invalid combinations should be explicitly blocked, not silently ignored
- Add a debug shortcut that dumps all three axes to console

**Limitations:**
- Combinatorial explosion: 5 states × 3 modes × 4 scenes = 60 combinations — test coverage is hard
- LLM may not respect all three axes simultaneously in its output

---

## 5. Modal-Heavy Utility Bot

**Supports:** Bots with multi-step workflows — form filling, guided processes, or wizard-style interactions.

**When to use:** The bot needs structured user input beyond free-text chat — confirmations, selections, or multi-field forms.

**Required snippets:**
- `ui-ux/ui-modal-dialog-shell.js` — modal container for workflow steps
- `ui-ux/ui-confirmation-dialog.js` — yes/no gates between steps
- `ui-ux/ui-toast-notifications.js` — step completion feedback

**Optional snippets:**
- `ui-ux/ui-progress-bar.js` — workflow progress indicator
- `ui-ux/ui-shortcut-button-orchestrator.js` — step-specific action buttons
- `transformations/transforms-state-safe-init-guard.js` — workflow state init

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `ui-modal-dialog-shell.js`
3. `ui-confirmation-dialog.js`
4. `ui-toast-notifications.js`
5. `ui-progress-bar.js`
6. `ui-shortcut-button-orchestrator.js`

**State considerations:**
- Workflow step index in `oc.thread.customData.__pcbw_workflow_step`
- Collected form data in `oc.thread.customData.__pcbw_workflow_data`
- Modal open/close state should not persist — modals start closed on reload

**Likely conflicts:**
- Multiple modal snippets creating overlapping z-index layers
- Confirmation dialog and modal shell may both try to trap focus

**Implementation notes:**
- Each workflow step should be a pure function: `(currentData) → updatedData`
- Always provide a cancel/back path — never trap the user in a modal
- Test keyboard accessibility (Escape to close)

**Limitations:**
- Complex forms are awkward in Perchance's iframe environment
- No native form validation — must implement manually
- Modal stacking beyond 2 levels is fragile

---

## 6. Low-UI Lightweight Bot

**Supports:** Simple, focused bots that need minimal infrastructure — just well-behaved custom code with no UI chrome.

**When to use:** The bot's value is in its writing/prompting, not in UI features. You want clean customCode with guard rails but no panels, modals, or complex state.

**Required snippets:**
- `transformations/transforms-state-safe-init-guard.js` — safe init
- `ai-response/ai-response-postprocessor.js` — clean up AI output
- `prompting/prompting-response-style-enforcer.js` — enforce output format

**Optional snippets:**
- `prompting/prompting-hidden-system-injector.js` — inject hidden instructions
- `ui-ux/ui-theme-adaptive-message-style.js` — match light/dark theme

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `prompting-hidden-system-injector.js`
3. `prompting-response-style-enforcer.js`
4. `ai-response-postprocessor.js`
5. `ui-theme-adaptive-message-style.js`

**State considerations:**
- Minimal state — at most a few flags in customData
- No complex state machines or transformation axes

**Likely conflicts:**
- Style enforcer and postprocessor may apply contradictory formatting rules — test together
- Hidden injector and manual `reminderMessage` may duplicate instructions

**Implementation notes:**
- This is the default starting recipe for new bots
- Total customCode should be under 200 lines
- If you need more than this recipe provides, upgrade to a different recipe

**Limitations:**
- No dynamic behavior beyond what the AI naturally produces
- No user-facing controls beyond shortcut buttons

---

## 7. Archive / Snapshot Bot

**Supports:** Bots that preload rich context — lore documents, world-building, character backstories — and seed conversations from prepared content.

**When to use:** The bot operates in a content-rich world that needs to be loaded before the first user message.

**Required snippets:**
- `prompting/prompting-context-packer.js` — compress and prioritize context for the prompt
- `pregeneration/prebake-lore-loader-helper.js` — load lore documents into state
- `pregeneration/prebake-initial-message-seeder.js` — seed the thread with prepared messages

**Optional snippets:**
- `transformations/transforms-state-safe-init-guard.js` — safe init
- `prompting/prompting-hidden-system-injector.js` — inject lore as hidden context
- `pregeneration/preformat-message-html-sanitizer.js` — sanitize loaded content

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `prebake-lore-loader-helper.js` — load lore into customData
3. `prebake-initial-message-seeder.js` — seed initial messages
4. `preformat-message-html-sanitizer.js` — sanitize seeded content
5. `prompting-context-packer.js` — pack context for prompting
6. `prompting-hidden-system-injector.js` — inject packed context

**State considerations:**
- Lore data in `oc.thread.customData.__pcbw_lore`
- Context packer output in `oc.thread.customData.__pcbw_packed_context`
- Seeded messages should set `author: "ai"` or `author: "system"` and use `hiddenFrom: []` appropriately

**Likely conflicts:**
- Context packer and hidden injector both manipulate prompt context — define clear ownership
- Initial message seeder must run only once — use init guard

**Implementation notes:**
- Lore loading should be synchronous at init, not async per-message
- Context packer should have a token budget and prioritize recent context
- Test with maximum lore size to check performance

**Limitations:**
- Large lore sets increase customData size and may hit storage limits
- Context packing is heuristic — important context may be dropped under pressure
- Seeded messages cannot be un-seeded without thread reset

---

## 8. Scene-Switching Roleplay Bot

**Supports:** Roleplay bots with discrete locations/scenes that the player can move between, with scene-appropriate context and UI.

**When to use:** The roleplay has distinct locations with different rules, atmospheres, or available actions.

**Required snippets:**
- `transformations/transforms-scene-transition-engine.js` — scene graph and transition logic
- `pregeneration/prewarm-scene-assets.js` — preload scene metadata
- `ui-ux/ui-shortcut-button-orchestrator.js` — scene-contextual action buttons

**Optional snippets:**
- `prompting/prompting-dynamic-reminder-router.js` — per-scene system prompts
- `ui-ux/ui-toast-notifications.js` — scene change announcements
- `transformations/transforms-state-safe-init-guard.js` — safe init
- `transformations/transforms-runtime-theme-shift.js` — visual theme per scene

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `prewarm-scene-assets.js` — load scene definitions
3. `transforms-scene-transition-engine.js` — initialize scene graph
4. `ui-shortcut-button-orchestrator.js` — bind initial buttons
5. `prompting-dynamic-reminder-router.js` — set initial reminder
6. `ui-toast-notifications.js`
7. `transforms-runtime-theme-shift.js`

**State considerations:**
- Current scene in `oc.thread.customData.__pcbw_current_scene`
- Scene history in `oc.thread.customData.__pcbw_scene_history`
- Scene assets in `oc.thread.customData.__pcbw_scene_assets`
- Button sets must be defined per scene

**Likely conflicts:**
- Scene engine and theme shift both react to scene changes — define event order
- Shortcut orchestrator and manual `shortcutButtons` writes will conflict

**Implementation notes:**
- Define scenes as a data structure, not as code branches
- Scene graph should be validated at init — no orphan or unreachable scenes
- Keep scene count reasonable (< 12) for v1

**Limitations:**
- AI may not reliably detect scene transitions from free-text — combine with classifier
- Scene preloading adds to init time on first load
- No spatial/map rendering — scenes are named, not positioned

---

## 9. Controlled Prompting Bot

**Supports:** Bots where precise control over the AI's output format, style, and content is critical.

**When to use:** The bot must enforce strict output rules — structured responses, specific formatting, content filtering, or response classification.

**Required snippets:**
- `prompting/prompting-hidden-system-injector.js` — inject hidden formatting instructions
- `prompting/prompting-dynamic-reminder-router.js` — context-sensitive reminders
- `prompting/prompting-response-style-enforcer.js` — post-hoc style enforcement
- `prompting/prompting-last-message-classifier.js` — classify AI output for routing

**Optional snippets:**
- `ai-response/ai-response-postprocessor.js` — additional output cleanup
- `transformations/transforms-state-safe-init-guard.js` — safe init

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `prompting-hidden-system-injector.js` — inject base instructions
3. `prompting-dynamic-reminder-router.js` — set context reminder
4. `prompting-last-message-classifier.js` — classify previous output
5. `prompting-response-style-enforcer.js` — enforce style on new output
6. `ai-response-postprocessor.js` — final cleanup

**State considerations:**
- Classification results in `oc.thread.customData.__pcbw_last_classification`
- Style enforcer rules should be configurable constants
- Injected instructions should be minimal to preserve context window

**Likely conflicts:**
- Hidden injector and reminder router both modify prompt context — layer carefully
- Style enforcer and postprocessor may apply conflicting transformations — test order

**Implementation notes:**
- Define style rules as a declarative object, not imperative code
- Classifier should return a small enum, not free-text categories
- Test with adversarial user inputs that try to break formatting

**Limitations:**
- LLMs do not reliably follow formatting instructions — style enforcer is a safety net, not a guarantee
- Over-constraining the prompt reduces response quality
- Classifier accuracy depends on LLM capability — budget for misclassification

---

## 10. Pyodide-Optional Computation Bot

**Supports:** Bots that can run Python code for computation, data processing, or analysis — with graceful degradation when Pyodide is unavailable.

**When to use:** The bot benefits from real computation (math, data analysis, code execution) but must still function without Python.

**Required snippets:**
- `ai-response/ai-response-pyodide-runner-guarded.js` — guarded Pyodide loading and execution
- `ui-ux/ui-debug-console-panel.js` — show Python output and errors
- `ui-ux/ui-progress-bar.js` — Pyodide download progress

**Optional snippets:**
- `ui-ux/ui-toast-notifications.js` — load status notifications
- `transformations/transforms-state-safe-init-guard.js` — safe init

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `ui-progress-bar.js` — ready before Pyodide load starts
3. `ai-response-pyodide-runner-guarded.js` — load Pyodide (async, guarded)
4. `ui-debug-console-panel.js` — bind output display
5. `ui-toast-notifications.js`

**State considerations:**
- Pyodide load state in `oc.thread.customData.__pcbw_pyodide_ready` (boolean)
- Python execution results cached if expensive
- Fallback behavior must be defined for when Pyodide is not loaded

**Likely conflicts:**
- Pyodide runner's `delete window.sessionStorage` hack may affect other snippets that use sessionStorage
- Progress bar and debug console may compete for visual space

**Implementation notes:**
- See `docs/PYODIDE_COMPATIBILITY_NOTES.md` for constraints and anti-patterns
- Always show a loading indicator — Pyodide is 10–20 MB
- Define a clear fallback: what happens when Python is unavailable?
- Never block chat on Pyodide loading — load in background

**Limitations:**
- Pyodide download is 10–20 MB and takes 5–30 seconds
- Only pure-Python packages and Pyodide-distributed packages available
- JSPI crash risk on Chrome/Edge — guard loading
- No offline support — CDN dependency

---

## 11. Debug / Development Aid Bot

**Supports:** Bots designed to help developers inspect, debug, or monitor their own bot's runtime behavior.

**When to use:** During bot development — not intended for end-user-facing bots.

**Required snippets:**
- `ui-ux/ui-debug-console-panel.js` — in-page debug console
- `ai-response/ai-response-stream-monitor.js` — monitor AI response streaming
- `ui-ux/ui-toast-notifications.js` — event notifications

**Optional snippets:**
- `transformations/transforms-state-safe-init-guard.js` — safe init
- `prompting/prompting-last-message-classifier.js` — test classification logic
- `ui-ux/ui-toolbar-button-cluster.js` — debug action buttons

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `ui-debug-console-panel.js` — available immediately
3. `ai-response-stream-monitor.js` — hooks into message events
4. `ui-toast-notifications.js` — visual event log
5. `ui-toolbar-button-cluster.js` — debug actions
6. `prompting-last-message-classifier.js` — test classifier

**State considerations:**
- Debug log buffer in `oc.thread.customData.__pcbw_debug_log` (array, capped size)
- Stream monitor should log to both console and debug panel
- Clear debug state on thread reset

**Likely conflicts:**
- Debug console and other panels may overlap — set z-index explicitly
- Stream monitor hooks into message events — may interfere with postprocessors

**Implementation notes:**
- Strip this recipe's snippets before shipping to production
- Add a "Dump State" button that logs all `__pcbw_` customData keys
- Stream monitor should show token count and timing

**Limitations:**
- Adds overhead — not for production use
- Debug console may not render correctly on mobile
- Stream monitor visibility depends on Perchance's streaming implementation

---

## 12. Dynamic Personality Bot

**Supports:** Bots whose personality, appearance, and behavior shift dynamically based on conversation events or user actions.

**When to use:** The bot should feel like a living character — appearance changes, personality shifts, and visual feedback reflect internal state.

**Required snippets:**
- `transformations/transforms-avatar-expression-router.js` — dynamic avatar based on mood
- `transformations/transforms-runtime-theme-shift.js` — visual theme reflects personality
- `transformations/transforms-character-state-machine.js` — personality FSM
- `prompting/prompting-last-message-classifier.js` — detect personality triggers

**Optional snippets:**
- `transformations/transforms-state-safe-init-guard.js` — safe init
- `prompting/prompting-dynamic-reminder-router.js` — personality-aware prompting
- `ui-ux/ui-toast-notifications.js` — personality shift notifications

**Composition order:**
1. `transforms-state-safe-init-guard.js`
2. `transforms-character-state-machine.js` — personality FSM
3. `prompting-last-message-classifier.js` — trigger detection
4. `transforms-avatar-expression-router.js` — bind avatar to state
5. `transforms-runtime-theme-shift.js` — bind theme to state
6. `prompting-dynamic-reminder-router.js` — bind prompt to state
7. `ui-toast-notifications.js`

**State considerations:**
- Personality state in `oc.thread.customData.__pcbw_personality`
- Expression map (state → avatar URL) defined as a constant
- Theme map (state → CSS variables) defined as a constant
- Classifier output feeds into state machine transition function

**Likely conflicts:**
- Avatar router and manual `oc.character.avatar.url` writes conflict
- Theme shift and `wrapperStyle` overrides conflict
- Multiple snippets reading classifier output — ensure classifier runs before consumers

**Implementation notes:**
- Define personality states as an enum with clear names
- Expression map needs one avatar URL per personality state — prepare assets first
- Theme shift should only change CSS custom properties, not structural styles
- Test personality loop: ensure no state gets stuck

**Limitations:**
- Avatar images must be pre-generated or pre-hosted — no runtime generation
- Theme transitions may flash if CSS is not pre-cached
- Classifier may misread sarcasm, irony, or ambiguous messages
- More than 6 personality states becomes unwieldy to test and maintain

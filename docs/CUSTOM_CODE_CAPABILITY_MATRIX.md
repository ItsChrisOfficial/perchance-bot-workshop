# Custom Code Capability Matrix

Decision-table reference for Perchance AI Character Chat `customCode` capabilities. Use this to determine **what is realistic**, **what each capability requires**, and **which snippet to start from** — before writing a single line of code.

This matrix covers the 36 snippet files in `snippets/custom-code/` and maps them to concrete capabilities, constraints, and use cases within the Perchance `customCode` runtime.

> **Scope.** This document covers behavior achievable inside the `customCode` iframe sandbox. It does not cover Perchance generator-level features, plugin lists, or server-side behavior.

---

## How to use this matrix

1. **Find the capability you want** in the grouped tables below.
2. **Check "Realistic in customCode"** — if it says `no`, stop. If `guarded`, read the caveats before committing.
3. **Check resource columns** — LLM call, network, and iframe UI tell you the runtime cost and user-facing impact.
4. **Read "Touches"** to understand which parts of the bot contract your code will modify.
5. **Start from the listed snippet(s)** — they are real files in `snippets/custom-code/` and give you a validated starting point.
6. **Read "Major caveats"** — these are Perchance-specific footguns, not generic warnings.
7. **Check anti-use cases** — if your plan matches one, reconsider your approach.

### Column definitions

| Column | Meaning |
|---|---|
| **Capability** | What the code does in plain terms |
| **Realistic in customCode** | `yes` = straightforward; `guarded` = possible but fragile or rate-limited; `no` = not feasible in the Perchance iframe sandbox |
| **Requires LLM call** | Whether the capability needs `oc.getInstructCompletion`, `oc.getChatCompletion`, or `oc.generateText` |
| **Requires network** | Whether external HTTP requests or asset fetches are needed |
| **Requires iframe UI** | Whether `document.body.innerHTML` injection and `oc.window.show()`/`oc.window.hide()` are needed |
| **Touches** | Which parts of the bot contract are read or mutated: `messages`, `prompts`, `state`, `UI`, `media`, `exports` |
| **Ideal snippet starting point(s)** | Real filenames from `snippets/custom-code/` |
| **Major caveats** | Perchance-specific constraints, gotchas, or limitations |
| **Recommended use cases** | Concrete scenarios where this capability works well |
| **Anti-use cases** | Scenarios where this capability will fail, perform badly, or cause problems |

---

## Transformations

Capabilities related to character state, mode switching, scene management, avatars, and runtime theme changes.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Character state machine (branching narrative states) | guarded | yes | no | no | state, prompts | `transforms-character-state-machine.js`, `transforms-state-safe-init-guard.js` | State resets on page reload unless persisted to `oc.thread.customData`; LLM must infer current state from context injection; `MessageAdded` fires on every message including regenerations | Branching narrative arcs, emotion tracking, relationship progression systems | General-purpose game engines; states requiring sub-second transitions |
| Mode switching (e.g., SFW/NSFW, roleplay/OOC) | yes | no | no | optional | state, prompts | `transforms-mode-switcher.js`, `transforms-state-safe-init-guard.js` | Must guard against init re-triggering on every `MessageAdded` fire; mode must be written to `oc.thread.customData` to persist; switching modes mid-conversation requires `reminderMessage` rewrite | Content-tier toggling, roleplay-vs-OOC switching, difficulty modes | Dynamic per-message mode detection (too fragile; use classification instead) |
| Scene transitions | guarded | optional | no | optional | state, prompts, UI | `transforms-scene-transition-engine.js`, `transforms-state-safe-init-guard.js` | Scene change must be injected via hidden system message *before* the AI generates its next response; timing is tricky with `StreamingMessage`; scene metadata must be stored in `oc.thread.customData` | Location-based RP, adventure game chapters, visual novel scenes | Real-time scene rendering (no canvas API in iframe); scenes requiring physics |
| Avatar expression routing | guarded | optional | optional | no | media, state | `transforms-avatar-expression-router.js` | Avatar image URLs must be pre-registered or pre-generated; `oc.textToImage` is slow (5–15s) and rate-limited; avatar field on message objects is a URL string | Emotion-mapped avatar swaps per AI message, outfit changes per scene | Live avatar animation (no animation API); generating a new avatar per message |
| Runtime theme shifting | yes | no | no | yes | UI, state | `transforms-runtime-theme-shift.js`, `ui-theme-adaptive-message-style.js` | Theme CSS is injected via `document.body.innerHTML` inside the iframe; parent Perchance page styles are completely inaccessible; theme preference should persist in `oc.character.customData` | Dark/light mode toggle, seasonal themes, mood-reactive styling | Modifying parent page CSS; themes requiring web fonts not already loaded |
| Safe init guard (double-init prevention) | yes | no | no | no | state | `transforms-state-safe-init-guard.js` | Must run before any other `customCode` logic; prevents duplicate initialization when `MessageAdded` re-fires; use a flag in `oc.thread.customData` to track init status | Every bot with persistent state, event handlers, or seeded messages — this is universally recommended | None; every non-trivial bot should use this pattern |

---

## Prompting

Capabilities for manipulating what the AI sees before and during generation.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Hidden system message injection | yes | no | no | no | prompts, messages | `prompting-hidden-system-injector.js` | Injected messages must use `hiddenFrom: ["user"]` to avoid display leakage; too many hidden messages consume context tokens; injected messages are visible in DevTools | Lore injection, behavior guardrails, persona reinforcement, world-state summaries | Injecting entire documents (context window limits apply); secrets (visible in DevTools) |
| Response style enforcement | guarded | yes | no | no | prompts | `prompting-response-style-enforcer.js`, `prompting-context-packer.js` | LLM compliance varies by model and temperature; style instructions compete with `roleInstruction` for attention; over-constraining style reduces creativity | Enforcing paragraph count, prose-vs-dialogue ratio, language/dialect, response length | Pixel-perfect formatting (LLM output is inherently variable); enforcing exact word counts |
| Last-message classification | guarded | yes | no | no | messages, state | `prompting-last-message-classifier.js` | Classification LLM call adds 1–3s latency per message; must handle refusals, garbage output, and JSON parse failures gracefully; runs on `MessageAdded` which includes regenerations | Sentiment tracking, intent routing, content tagging, NSFW detection | Real-time per-token classification (no token-level hook); latency-sensitive flows |
| Context packing and management | yes | no | no | no | prompts, messages | `prompting-context-packer.js`, `prompting-hidden-system-injector.js` | Must respect model token limits; over-packing causes silent truncation of recent messages by the platform; `fitMessagesInContextMethod` interacts with your packing strategy | Long-running RPs needing summary injection, lore-heavy worlds, multi-NPC conversations | Assuming unlimited context; packing without measuring approximate token usage |
| Dynamic reminder routing | yes | no | no | no | prompts | `prompting-dynamic-reminder-router.js`, `transforms-state-safe-init-guard.js` | `oc.character.reminderMessage` is a single string field — writing to it overwrites all previous content; must reconstruct the full reminder each time; changes apply to next AI turn only | State-dependent behavior reminders, conditional persona shifts, adaptive instruction | Appending infinite reminders (one field, one value); expecting per-message reminder history |
| Slash command interpretation | yes | no | no | optional | messages, state, UI | `prompting-slash-command-interpreter.js`, `ui-toast-notifications.js` | Commands must be intercepted in `MessageAdded` before the AI sees them; must splice the command message out of `oc.thread.messages` to prevent AI confusion; malformed commands should fail with user feedback | `/reset`, `/mode`, `/scene`, `/debug` commands; user-triggered state changes | Complex CLI-style argument parsing (users type on mobile keyboards); undiscoverable commands without a help UI |

---

## UI/UX

Capabilities for building user interfaces inside the `customCode` iframe.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Floating panel | yes | no | no | yes | UI | `ui-floating-panel-shell.js` | Panel lives inside the iframe; must call `oc.window.show()` to reveal; z-index conflicts with Perchance parent UI are possible; iframe size constrains panel dimensions | Settings panels, character info displays, stat sheets | Full-page applications (iframe viewport is small); panels needing drag-and-drop |
| Modal dialog | yes | no | no | yes | UI | `ui-modal-dialog-shell.js`, `ui-confirmation-dialog.js` | Modal only overlays the iframe, not the parent page; cannot truly block parent page interaction; user can simply ignore the iframe | Confirmation prompts, "are you sure?" dialogs, info popups, EULA/warnings | Critical system alerts requiring forced acknowledgment (user can just close iframe) |
| Slideout side panel | yes | no | no | yes | UI | `ui-slideout-side-panel.js` | CSS animation performance varies by device; panel width is constrained by iframe dimensions; must handle touch gestures for mobile | Inventory panels, character sheets, lore browsers, settings drawers | Wide data tables (iframe width is very limited); complex multi-column layouts |
| Bottom drawer | yes | no | no | yes | UI | `ui-bottom-drawer.js` | Drawer height competes with visible chat area; must auto-collapse or be dismissible to avoid permanently blocking the chat interface | Quick-action menus, status displays, compact toolbars, mini-maps | Persistent always-open drawers (blocks chat input and messages) |
| Toolbar button cluster | yes | no | no | yes | UI | `ui-toolbar-button-cluster.js` | Too many buttons overflow on mobile; keep cluster to 3–5 actions; buttons must have clear icons or very short labels; must handle touch targets ≥44px | Action bars, quick-mode toggles, scene selectors | Replicating full application ribbons or menus; more than 6 toolbar actions |
| Toast notifications | yes | no | no | yes | UI | `ui-toast-notifications.js` | Toasts must auto-dismiss; stacking more than 3 causes visual noise; iframe must be visible (`oc.window.show()`) for toasts to appear; toasts vanish on iframe hide | Event confirmations, state change alerts, error feedback, slash command results | Critical persistent warnings (toasts disappear); notifications when iframe is hidden |
| Tabbed panel | yes | no | no | yes | UI | `ui-tabbed-panel.js`, `ui-floating-panel-shell.js` | Active tab state resets on `oc.window.hide()`/`show()` unless persisted; too many tabs crowd mobile screens; tab content is fully re-rendered on switch | Multi-section settings, categorized lore browsers, help/FAQ pages | Deeply nested tab-within-tab hierarchies; tabs requiring independent scroll state |
| Progress bar | yes | no | no | yes | UI | `ui-progress-bar.js` | Progress must be driven by real events (asset load counts, quest steps); no reliable signal for LLM generation progress; fake/indeterminate progress misleads users | Asset preloading feedback, quest progress meters, relationship level indicators | Indicating LLM generation progress (no token-count signal available); precise ETAs |
| Confirmation dialog | yes | no | no | yes | UI | `ui-confirmation-dialog.js`, `ui-modal-dialog-shell.js` | Cannot block JavaScript execution like `window.confirm()`; must use callback/promise pattern; dialog is iframe-only | Destructive action confirmation (reset, delete), mode change verification | System-level confirmations; dialogs that must prevent all other user interaction |
| Theme-adaptive message styling | yes | no | no | no | UI, messages | `ui-theme-adaptive-message-style.js`, `transforms-runtime-theme-shift.js` | Uses `oc.messageRenderingPipeline.push(fn)` to modify rendered messages; runs on every render including scroll; heavy DOM manipulation causes jank | Color-coded messages by author, role-specific styling, mood-reactive message borders | Per-message DOM rewriting with complex logic (causes scroll lag); styles needing parent CSS access |
| Dynamic shortcut button management | yes | no | no | no | UI, state | `ui-shortcut-button-orchestrator.js`, `transforms-state-safe-init-guard.js` | `oc.thread.shortcutButtons` is the live array; mutations reflect immediately in the chat UI; must preserve the object contract (`name`, `message`, `insertionType`, `autoSend`, `clearAfterSend`) | Context-sensitive action buttons, state-driven dialogue choices, scene-appropriate options | Hundreds of buttons (UI becomes unusable); buttons that change on every keystroke |
| Debug console panel | yes | no | no | yes | UI, state | `ui-debug-console-panel.js` | Must be disabled or hidden before sharing/exporting the bot; exposes internal state, event flow, and potentially user messages | Development-time state inspection, event tracing, `customData` monitoring, init flow verification | Shipping visible to end users (information leak, UI clutter, wasted screen space) |

---

## Pregeneration / Prewarming / Preformatting / Prebaking

Capabilities for preparing assets, caches, messages, and prompts before or between AI turns.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Image cache prewarming | guarded | no | yes | no | media | `prewarm-image-cache.js` | Network requests are fire-and-forget; no guaranteed cache persistence across browser sessions; rate limits on image hosts apply; CORS restrictions may block some domains | Avatar emotion sets, scene backgrounds, item sprites, expression libraries | Preloading hundreds of images (bandwidth waste, rate limits); dynamically generated URLs |
| Audio cache prewarming | guarded | no | yes | no | media | `prewarm-audio-cache.js` | Browser autoplay policies require a user gesture before first `AudioContext.resume()`; audio files must be hosted on CORS-enabled servers; no persistent audio player across page navigations | Ambient scene audio, notification chimes, UI sound effects | Background music streaming (no persistent player); large audio files (bandwidth) |
| Scene asset preloading | guarded | no | yes | optional | media, state | `prewarm-scene-assets.js`, `transforms-scene-transition-engine.js` | Assets must be pre-registered by URL; dynamically generating assets at prewarm time adds startup latency; must track load status in `oc.thread.customData` | Adventure bots with known scene sets, visual novel chapter assets | Prewarming dynamically generated scenes (can't prewarm unknown URLs) |
| Message HTML sanitization | yes | no | no | no | messages | `preformat-message-html-sanitizer.js` | Runs via `oc.messageRenderingPipeline` on every render pass including scroll; heavy DOM manipulation causes visible jank; must not strip intentional markdown formatting | Stripping script injection attempts, normalizing whitespace, removing unwanted HTML tags | Full DOM tree rewriting per message (performance death on long threads) |
| Roleplay layout normalization | yes | no | no | no | messages | `preformat-roleplay-layout-normalizer.js`, `preformat-message-html-sanitizer.js` | Must not destroy intentional RP formatting like `*action text*` or `"dialogue"`; regex-based parsing is inherently fragile with LLM output; must handle edge cases gracefully | Consistent paragraph spacing, italic wrapping for actions, dialogue formatting | Enforcing pixel-perfect layouts (LLM output is inherently variable); complex multi-speaker parsing |
| Image prompt construction | guarded | yes | yes | no | media, prompts | `prebake-image-prompt-builder.js`, `prewarm-image-cache.js` | `oc.textToImage` is rate-limited and slow (5–15s per image); prompt quality directly impacts output; must handle generation failures with fallback images; costs user generation credits | Auto-generating scene illustrations, character portraits, item images between turns | Real-time per-message image generation (too slow for conversation flow); rapid-fire generation |
| Initial message seeding | yes | no | no | no | messages, state | `prebake-initial-message-seeder.js`, `transforms-state-safe-init-guard.js` | Must only run on truly first load; guard with `oc.thread.customData` flag against re-seeding on every `MessageAdded` fire; seeded messages must match the message object contract (`content`, `author`, `hiddenFrom`) | Opening narration, tutorial messages, world-building intros, multi-message cold opens | Re-seeding on every page load (duplicates messages endlessly); seeding dozens of messages (clutters thread) |
| Lore loader / context helper | yes | no | no | no | prompts, state | `prebake-lore-loader-helper.js`, `prompting-context-packer.js` | Lore strings consume context tokens proportionally to their length; must be selective about which lore to inject per turn based on relevance; static lore competes with dynamic conversation for context space | World-building injection, NPC knowledge bases, item/location databases, faction lore | Loading entire wikis into context (hard token cap); injecting all lore every turn regardless of relevance |

---

## AI Response Functionality

Capabilities for processing, guarding, monitoring, and extending AI-generated responses.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Response post-processing | yes | no | no | no | messages | `ai-response-postprocessor.js`, `preformat-message-html-sanitizer.js` | Runs after AI response is finalized in `MessageAdded`; cannot modify streaming output mid-stream; regex replacements may break markdown or HTML entities; must handle empty/null responses | Formatting cleanup, OOC tag stripping, content warning insertion, automated footnotes | Fundamentally changing AI response meaning (use prompting-layer injection instead); per-token processing |
| Regeneration guard / deduplication | yes | no | no | no | messages, state | `ai-response-regeneration-guard.js`, `transforms-state-safe-init-guard.js` | Must track message content hashes or timestamps in `oc.thread.customData`; aggressive dedup may block intentionally similar responses; must distinguish user-initiated regen from automatic re-fires | Preventing duplicate messages on regeneration spam, idempotent event handlers, init safety | Blocking all similar-sounding responses (some repetition is natural in RP); content-based filtering (use classification) |
| Stream monitoring | guarded | no | no | optional | messages, UI | `ai-response-stream-monitor.js`, `ui-progress-bar.js` | `oc.thread.on("StreamingMessage", ...)` fires frequently during generation; heavy handlers cause visible lag; partial content may be incomplete mid-token; handler receives the in-progress message object | Live typing indicators, real-time content safety checks, stream progress feedback, character-count displays | Complex per-token analysis (too much overhead per fire); modifying the stream mid-generation (read-only access) |
| Pyodide-guarded Python execution | guarded | no | no | no | state | `ai-response-pyodide-runner-guarded.js` | Pyodide loads a full Python WASM runtime (~10 MB); must guard against re-initialization on every `MessageAdded`; limited Python package availability; significant cold-start latency (3–10s first load) | Data analysis on chat history, complex math/statistics, NPC decision logic in Python, algorithm-heavy processing | General-purpose Python scripting (overhead is massive; use JS); anything requiring fast startup; Python packages with C extensions |

---

## State Persistence

Capabilities for storing and retrieving data across messages, threads, and shared links.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Thread-level state (`oc.thread.customData`) | yes | no | no | no | state | `transforms-state-safe-init-guard.js`, `transforms-character-state-machine.js` | Persists for the thread's lifetime; lost on thread deletion; must initialize safely before first read; values must be JSON-serializable; no built-in versioning or migration | Conversation flags, scene state, turn counters, inventory, relationship scores | Storing large binary blobs (serialization cost, potential quota); data that must survive thread deletion |
| Character-level state (`oc.character.customData`) | yes | no | no | no | state | `transforms-state-safe-init-guard.js`, `transforms-mode-switcher.js` | Shared across all threads for this character; concurrent tabs may cause race conditions; writes from one thread overwrite data for all threads; must init safely | Global preferences, unlock flags, cross-thread progression, persistent settings | Per-conversation data (use `oc.thread.customData` instead); high-frequency writes from multiple threads |
| Shared/public state (`oc.character.customData.PUBLIC`) | guarded | no | no | no | state, exports | `transforms-state-safe-init-guard.js` | `PUBLIC` data travels with shared character links — anyone who receives the link gets this data; do not store user-specific or sensitive information here; data is visible in the export JSON | Default settings, cosmetic preferences, bot version tags that should persist when shared | User secrets, API keys, personal data, conversation history (visible to anyone with the shared link) |
| Cross-message state tracking | yes | no | no | no | state, messages | `transforms-character-state-machine.js`, `prompting-last-message-classifier.js` | State must be derived from or synced with the message array; out-of-sync state causes inconsistent AI behavior; message deletion or editing by the user can invalidate tracked state | Relationship score tracking, quest/objective progress, emotional arc memory, NPC disposition | Assuming state is always consistent with messages (users can delete, edit, or regenerate messages at any time) |

---

## Media Handling

Capabilities for working with images, audio, and generated media.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Dynamic avatar images | guarded | no | yes | no | media | `transforms-avatar-expression-router.js`, `prewarm-image-cache.js` | Avatar URLs must be publicly accessible and CORS-compatible; `oc.textToImage` is too slow for real-time per-message swaps; preloading a fixed set of expressions is the practical approach | Emotion-based avatar switching, outfit/costume changes per scene, injury/status indicators | Generating a unique avatar per message (latency and rate limits); avatars requiring transparency (PNG with alpha not guaranteed) |
| Text-to-image generation | guarded | no | yes | optional | media, UI | `prebake-image-prompt-builder.js`, `prewarm-image-cache.js` | `oc.textToImage()` is rate-limited, slow (5–15s), may fail silently, and consumes user generation credits; always provide a fallback image URL; prompt engineering significantly affects quality | Scene illustrations between chapters, character portraits on first encounter, item images for inventory | Inline per-message illustrations (latency kills conversational UX); rapid-fire image generation; NSFW where model policy prohibits |
| Audio asset management | guarded | no | yes | yes | media, UI | `prewarm-audio-cache.js`, `ui-toolbar-button-cluster.js` | Browser autoplay policy requires a user gesture (click/tap) before first `AudioContext.resume()`; audio elements inside the iframe; no persistent audio across page navigations; must pre-cache for responsiveness | Ambient scene sounds, notification chimes, mood music triggered by scene changes, UI feedback sounds | Continuous background music (no persistent player); large streaming audio files; auto-playing audio on page load |

---

## Debugging

Capabilities for development-time inspection and troubleshooting.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| Custom debug console panel | yes | no | no | yes | UI, state | `ui-debug-console-panel.js`, `ui-tabbed-panel.js` | Must be stripped, gated behind a flag, or hidden before sharing the bot; exposes internal state, event handler flow, and potentially user message content; adds iframe UI overhead | Development-time state inspection, event tracing, `customData` monitoring, init-flow verification, handler debugging | Shipping visible to end users (information leak, UI clutter, performance overhead in production) |
| State inspection and logging | yes | no | no | optional | state | `ui-debug-console-panel.js`, `transforms-state-safe-init-guard.js` | `console.log` outputs to browser DevTools (not visible in-iframe); custom debug panel needed for in-iframe visibility; logging every `MessageAdded` fire creates noise; must clean up before export | Tracking `customData` changes over time, verifying init guard behavior, diagnosing event handler ordering | Production logging of all user messages (performance drain, privacy concern); logging without cleanup before sharing |

---

## Export-Sensitive Behavior

Capabilities that interact with or risk breaking the Perchance export/import contract.

| Capability | Realistic in customCode | Requires LLM call | Requires network | Requires iframe UI | Touches | Ideal snippet starting point(s) | Major caveats | Recommended use cases | Anti-use cases |
|---|---|---|---|---|---|---|---|---|---|
| `customCode` serialization safety | yes | no | no | no | exports | `transforms-state-safe-init-guard.js` | `customCode` must survive `JSON.stringify` → `JSON.parse` round-trip; avoid backtick template literals with `${}` expressions (JSON escaping corrupts them); use string concatenation or `"string" + variable` instead; test by re-importing your own export | All bots with any `customCode` — this is a universal concern | Using template literals with embedded expressions; hand-editing escaped JSON strings; assuming your IDE's formatting survives serialization |
| Field contract preservation at runtime | yes | no | no | no | exports, messages | `prebake-initial-message-seeder.js`, `ui-shortcut-button-orchestrator.js` | `initialMessages` must remain an array; `shortcutButtons` must remain an array of objects with `name`, `message`, `insertionType`, `autoSend`, `clearAfterSend`; `customCode` must remain a string; violating these contracts breaks import silently | Any bot that modifies character fields at runtime; dynamic shortcut buttons; programmatic message seeding | Dynamically changing field types at runtime (e.g., setting `initialMessages` to a string); deleting required fields; adding non-serializable values (functions, DOM nodes) to `customData` |

---

## Quick-Reference Legend

| Symbol / Term | Meaning |
|---|---|
| `yes` | Capability works reliably within normal Perchance `customCode` constraints |
| `guarded` | Capability is possible but requires careful handling — rate limits, latency, fragile timing, or platform-specific quirks apply |
| `no` | Not feasible within the Perchance `customCode` iframe sandbox |
| `optional` | Depends on implementation choice; the capability can work with or without this resource |
| **messages** | Reads or mutates `oc.thread.messages` array or individual message objects |
| **prompts** | Modifies `oc.character.roleInstruction`, `oc.character.reminderMessage`, or injects hidden prompt messages |
| **state** | Reads or writes `oc.thread.customData`, `oc.character.customData`, or `oc.character.customData.PUBLIC` |
| **UI** | Injects HTML/CSS into the iframe via `document.body.innerHTML` or uses `oc.window.show()`/`oc.window.hide()` |
| **media** | Works with image URLs, audio elements, or calls `oc.textToImage()` |
| **exports** | Touches fields or structures that affect whether the bot can be exported and re-imported via the Perchance Dexie JSON format |

### Key API surfaces referenced in this matrix

| API | Purpose | Typical latency |
|---|---|---|
| `oc.thread.on("MessageAdded", fn)` | React to new or regenerated messages | Immediate (event-driven) |
| `oc.thread.on("StreamingMessage", fn)` | Monitor AI output as it streams | Fires many times per generation |
| `oc.thread.messages` | Read/write the message array directly | Immediate (in-memory) |
| `oc.thread.customData` | Thread-scoped persistent key-value state | Immediate (in-memory, auto-persisted) |
| `oc.thread.shortcutButtons` | Live shortcut button array | Immediate (UI updates on mutation) |
| `oc.character.customData` | Character-scoped persistent state | Immediate |
| `oc.character.customData.PUBLIC` | State that travels with shared links | Immediate |
| `oc.character.roleInstruction` | Main character system prompt | Applied on next AI turn |
| `oc.character.reminderMessage` | Reminder injected near end of context | Applied on next AI turn |
| `oc.getInstructCompletion({instruction, startWith})` | Single-turn instruction completion | 1–5s |
| `oc.getChatCompletion(messages)` | Multi-turn chat completion | 1–5s |
| `oc.generateText(...)` | General text generation | 1–5s |
| `oc.textToImage()` | Text-to-image generation | 5–15s |
| `oc.messageRenderingPipeline.push(fn)` | Hook into message render pass | Runs per message per render |
| `oc.window.show()` / `oc.window.hide()` | Toggle iframe visibility | Immediate |
| `document.body.innerHTML` | Inject UI into the iframe | Immediate |

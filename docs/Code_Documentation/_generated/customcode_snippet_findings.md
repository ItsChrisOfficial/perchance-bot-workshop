# Custom Code Snippet Library — Local Documentation Findings Memo

Generated from all 18 markdown files in `/docs/Code_Documentation/`.

---

## 1. What the Perchance Custom Code Runtime Can Actually Do

### Execution Environment
- All custom code runs inside an **isolated iframe** associated with the chat thread.
- The iframe has its own DOM; custom code **cannot** access the main page DOM or global variables.
- The iframe can be shown (`oc.window.show()`) or hidden (`oc.window.hide()`); code runs regardless of visibility.
- JavaScript is the primary language. Python via Pyodide is optional and expensive.

### Available APIs
- **`oc.thread`** — per-thread state: `messages`, `customData`, `shortcutButtons`, `messageWrapperStyle`, `name`, `character`, `userCharacter`, `systemCharacter`.
- **`oc.character`** — character template: `name`, `avatar.url`, `avatar.size`, `avatar.shape`, `roleInstruction`, `reminderMessage`, `initialMessages`, `customCode`, `imagePromptPrefix`, `imagePromptSuffix`, `imagePromptTriggers`, `shortcutButtons`, `customData`, `customData.PUBLIC`, `stopSequences`.
- **`oc.thread.on("MessageAdded", handler)`** — fires when any message is added. Handler can be async and is awaited before AI responds.
- **`oc.thread.on("StreamingMessage", handler)`** — fires during AI message streaming; receives `data.chunks` async iterable.
- **`oc.getInstructCompletion({instruction, startWith})`** — instruct-style LLM completion.
- **`oc.getChatCompletion()`** — chat-style completion (less recommended).
- **`oc.generateText({instruction, startWith})`** — alias/equivalent for AI text generation.
- **`oc.textToImage()`** — image generation via server-side model (network-dependent).
- **`oc.window.show()` / `oc.window.hide()`** — toggle iframe visibility.
- **Standard browser APIs** available inside the iframe: DOM, CSS, Web Speech API, Canvas, etc.

### Message Object Properties
Each message in `oc.thread.messages` supports:
- `content` (string, required) — message text/HTML
- `author` ("user" | "ai" | "system")
- `name` (optional string override)
- `hiddenFrom` (array: "user" and/or "ai")
- `expectsReply` (boolean)
- `customData` (object, per-message)
- `avatar` (per-message avatar override)
- `wrapperStyle` (CSS string for message bubble)
- `instruction` (per-message instruction override)
- `scene` — with `background.url`, `background.filter`, `music.url`, `music.volume`
- Messages can be manipulated with array operations: `push`, `pop`, `splice`, `shift`, `unshift`.

### Message Rendering Pipeline
- `messageRenderingPipeline` is an array of functions run on messages before display.
- Custom processing functions can be added for advanced styling or content transformation.

---

## 2. Iframe/Runtime Constraints

- **No main page DOM access** — only iframe-local DOM.
- **No direct module imports** — no npm, no bundlers, no `require()`, no repo-local imports.
- **No guaranteed network** — remote fetches may fail; must degrade gracefully.
- **No server-side execution** — everything runs client-side in the browser.
- **No private/undocumented APIs** — only use documented `oc.*` APIs.
- **Heavy operations block UI** — keep code lightweight, use async patterns.
- **CORS restrictions apply** — external fetch calls are subject to browser CORS.
- **Pyodide download is ~10-20 MB** — must be lazy-loaded and guarded.
- **Code persists across messages** — the iframe stays alive for the thread lifecycle.
- **IIFE wrapping recommended** — avoid global namespace pollution.

---

## 3. State Storage

### Thread-scoped state
- **`oc.thread.customData`** — persists across page reloads for the same thread. Namespaced keys recommended.
- **Per-message `customData`** — attach data to individual messages.

### Character-scoped state
- **`oc.character.customData`** — local to the character instance.
- **`oc.character.customData.PUBLIC`** — persisted when sharing a character link.

### In-memory state
- JavaScript variables inside the IIFE persist for the iframe lifecycle (until page reload or thread switch).
- Pyodide instance persists in memory once loaded.

---

## 4. Realistic Event Hooks and Message Lifecycle

### Event hooks
- **`MessageAdded`** — fires after any message is added (user, ai, or system). Handler is awaited if async, so modifications complete before the AI responds.
- **`StreamingMessage`** — fires during AI streaming. Receives async iterable of text chunks. Useful for real-time processing (e.g., TTS).

### Message lifecycle
1. User sends message (or slash command triggers AI).
2. `MessageAdded` fires for user message.
3. AI generates response (instruction + reminder + context applied).
4. `StreamingMessage` fires during generation (if streaming).
5. `MessageAdded` fires for AI message after completion.
6. Custom code can modify, delete, or add messages at any point.

---

## 5. Instruction/Reminder Implications

- **`oc.character.roleInstruction`** — writable; changes propagate to all threads immediately.
- **`oc.character.reminderMessage`** — writable; placed just before AI response for strong influence.
- Instructions/reminders are **never summarized** — they persist at the top of context.
- Custom code can dynamically modify these to change AI behavior at runtime.
- Multiple instruction/reminder messages supported via `[AI]:`, `[USER]:`, `[SYSTEM]:` notation.

---

## 6. Initial Message Implications

- **`oc.character.initialMessages`** — array of message objects shown at conversation start.
- Initial messages **are summarized** when thread grows long — not suitable for persistent rules.
- Can include `hiddenFrom` for selective visibility.
- Custom code can programmatically set/modify initial messages.

---

## 7. Memory/Lore Implications

- **Memories** — auto-generated summaries of past conversation, searchable, per-thread.
- **Lore** — static facts, loadable from lorebook URLs, dynamically injected when relevant.
- Both are managed via `/mem` and `/lore` slash commands.
- Custom code can interact with memories/lore indirectly via message content and instruction manipulation.
- Lore entries should be self-contained (no unresolved pronouns).

---

## 8. Message Styling Implications

- **`wrapperStyle`** — per-message CSS string applied to the message bubble.
- **`oc.thread.messageWrapperStyle`** — CSS applied to all messages in the thread.
- **`light-dark(a, b)`** — CSS function for theme-aware colors.
- **`scene.background.filter`** — CSS filter property for visual effects (blur, hue-rotate, sepia, etc.).
- **`scene.background.url`**, **`scene.music.url`**, **`scene.music.volume`** — media properties.
- HTML is allowed in message `content`.
- `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` hides content from AI while showing to user.

---

## 9. Shortcut/Slash Command Implications

### Shortcut buttons
- **`oc.thread.shortcutButtons`** — array of button objects for current thread.
- **`oc.character.shortcutButtons`** — default buttons for new threads.
- Each button: `{ name, message, insertionType, autoSend, clearAfterSend }`.
- `insertionType`: "replace" | "prepend" | "append".
- Custom code can dynamically generate/modify shortcut buttons.

### Slash commands
- `/ai`, `/user`, `/sys`, `/nar`, `/image`, `/mem`, `/lore`, `/sum`, `/name`, `/avatar`, `/import`.
- Custom code can construct messages that include slash commands.
- Shortcut buttons can trigger slash commands via their `message` field.

---

## 10. Prompt/Response Orchestration Patterns (Realistic)

### Instruct completion
- Call `oc.getInstructCompletion({instruction, startWith})` to get AI to perform a task.
- Use for: classification, rewriting, extraction, summarization, analysis.

### Post-processing chain
- Listen for `MessageAdded`, check if AI message, call instruct completion to refine, update `content`.
- Chain multiple refinement steps sequentially.

### Hidden system messages
- Push messages with `hiddenFrom: ["user"]` to inject context only the AI sees.
- Push messages with `hiddenFrom: ["ai"]` to show user-only content.

### Dynamic instruction modification
- Update `oc.character.roleInstruction` or `oc.character.reminderMessage` based on conversation state.

---

## 11. Prewarming/Pregeneration/Preformatting/Prebaking Patterns (Realistic)

### Image prewarming
- Preload image URLs into `new Image()` objects so they display instantly when needed.
- Use data URLs from `oc.textToImage()` cached in `oc.thread.customData`.

### Audio prewarming
- Preload `Audio` objects for sound effects or ambient audio.
- Cache audio data URLs in memory or `customData`.

### Scene asset preloading
- Combine image and audio prewarming for scene transitions.

### Message HTML sanitization
- Clean/normalize message content before display using regex or DOM parsing.
- Strip dangerous tags while preserving safe formatting.

### Roleplay layout normalization
- Standardize formatting of dialogue, actions, narration markers.

### Image prompt building
- Construct image generation prompts from conversation context programmatically.

### Initial message seeding
- Programmatically set `oc.character.initialMessages` based on configuration.

### Lore loading
- Programmatically manage lore entries and lorebook data.

---

## 12. Transformation Patterns (Realistic)

### State machines
- Use `oc.thread.customData` to track current state; transition on message events.

### Mode switching
- Toggle between conversation modes (e.g., combat, exploration, dialogue) via state.

### Scene transitions
- Change `scene.background.url`, `scene.background.filter`, `scene.music.url` on messages.

### Avatar expression routing
- Map AI message sentiment to different avatar URLs using instruct completion classification.

### Theme shifting
- Dynamically change `messageWrapperStyle` and scene properties based on mood/state.

---

## 13. UI Patterns (Realistic)

- Render HTML/CSS inside the iframe DOM.
- Use `oc.window.show()` / `oc.window.hide()` to toggle visibility.
- Build: floating panels, modals, drawers, toolbars, toast notifications, tabs, progress bars, confirmation dialogs.
- All CSS must be scoped/namespaced (e.g., `pcbw-*` prefix).
- Use `document.body.innerHTML` or `document.createElement()` for DOM construction.
- UI state can be persisted in `oc.thread.customData`.

---

## 14. Pyodide Constraints and Issue-Risk Notes

### Constraints
- ~10-20 MB download; must be lazy-loaded.
- `sessionStorage` workaround required: `delete window.sessionStorage; window.sessionStorage = {};`.
- Only pure-Python wheels or pre-built Pyodide packages work reliably.
- Heavy computation blocks UI thread.
- Network required for initial load and package installation.

### Known issues (as of April 2026)
- STATUS_ACCESS_VIOLATION crash on Chrome/Edge with JSPI + `runPythonAsync`.
- `mountNativeFS` fails on Android.
- jQuery 4.0 may break Pyodide console.
- File writes >= 2 GiB crash.
- Interrupting execution doesn't work with `requests` or `time.sleep()`.
- Matplotlib + ipympl incompatibility.

### Risk mitigation
- Always guard Pyodide loading with try/catch.
- Show loading indicators.
- Provide fallback behavior when Pyodide fails to load.
- Keep Python code minimal and short-running.
- Store Pyodide instance as singleton.

---

## 15. Rejected Ideas (Unrealistic)

| Idea | Reason for rejection |
|------|---------------------|
| Server-side backend code | No server execution — everything runs client-side in iframe |
| Direct main page DOM manipulation | Iframe isolation prevents cross-frame DOM access |
| npm/bundler dependencies | No build system in Perchance runtime |
| External framework imports (React, Vue) | Not realistic in customCode paste environment |
| Reliable external API calls | Network not guaranteed; CORS restrictions |
| Large persistent databases | Only `customData` storage available |
| Web Workers for Pyodide | Not documented as supported in the customCode iframe |
| Private undocumented `oc` APIs | Only documented APIs are safe |
| Stable internet assumption | Users may be offline |

---

## 16. Final Approved Snippet List (36 Snippets)

### Transformations (6)
| # | Filename | Purpose |
|---|----------|---------|
| 1 | `transforms-state-safe-init-guard.js` | Double-initialization guard pattern with namespaced state |
| 2 | `transforms-character-state-machine.js` | Finite state machine using `customData` with transitions on message events |
| 3 | `transforms-mode-switcher.js` | Toggle between conversation modes with persistent state |
| 4 | `transforms-scene-transition-engine.js` | Scene changes (background, filter, music) driven by AI classification |
| 5 | `transforms-avatar-expression-router.js` | Map AI message sentiment to avatar URLs via instruct completion |
| 6 | `transforms-runtime-theme-shift.js` | Dynamic `messageWrapperStyle` and scene theming based on mood |

### Prompting (6)
| # | Filename | Purpose |
|---|----------|---------|
| 7 | `prompting-hidden-system-injector.js` | Inject hidden system messages for AI-only context |
| 8 | `prompting-response-style-enforcer.js` | Post-process AI messages to enforce style rules |
| 9 | `prompting-last-message-classifier.js` | Classify last AI message into categories via instruct completion |
| 10 | `prompting-context-packer.js` | Summarize/pack recent messages into a compact context block |
| 11 | `prompting-dynamic-reminder-router.js` | Dynamically update `reminderMessage` based on conversation state |
| 12 | `prompting-slash-command-interpreter.js` | Parse and handle custom slash commands from user messages |

### UI/UX (12)
| # | Filename | Purpose |
|---|----------|---------|
| 13 | `ui-floating-panel-shell.js` | Draggable floating panel in iframe |
| 14 | `ui-modal-dialog-shell.js` | Modal dialog with overlay |
| 15 | `ui-slideout-side-panel.js` | Slide-out panel from side of iframe |
| 16 | `ui-bottom-drawer.js` | Pull-up drawer from bottom of iframe |
| 17 | `ui-toolbar-button-cluster.js` | Fixed toolbar with icon buttons |
| 18 | `ui-toast-notifications.js` | Auto-dismissing toast notifications |
| 19 | `ui-tabbed-panel.js` | Tabbed content panel |
| 20 | `ui-progress-bar.js` | Animated progress/loading bar |
| 21 | `ui-confirmation-dialog.js` | Yes/No confirmation dialog |
| 22 | `ui-theme-adaptive-message-style.js` | Apply theme-aware CSS to messages via `wrapperStyle` |
| 23 | `ui-shortcut-button-orchestrator.js` | Dynamically manage shortcut buttons based on state |
| 24 | `ui-debug-console-panel.js` | In-iframe debug console for logging |

### Pregeneration/Prewarming/Preformatting/Prebaking (8)
| # | Filename | Purpose |
|---|----------|---------|
| 25 | `prewarm-image-cache.js` | Preload images into browser cache |
| 26 | `prewarm-audio-cache.js` | Preload audio files into Audio objects |
| 27 | `prewarm-scene-assets.js` | Combined image+audio scene preloader |
| 28 | `preformat-message-html-sanitizer.js` | Sanitize message HTML content |
| 29 | `preformat-roleplay-layout-normalizer.js` | Normalize roleplay formatting conventions |
| 30 | `prebake-image-prompt-builder.js` | Build text-to-image prompts from conversation context |
| 31 | `prebake-initial-message-seeder.js` | Programmatically seed initial messages |
| 32 | `prebake-lore-loader-helper.js` | Manage lore entries via customData |

### AI Response Functionality (4)
| # | Filename | Purpose |
|---|----------|---------|
| 33 | `ai-response-postprocessor.js` | Extensible post-processing pipeline for AI messages |
| 34 | `ai-response-regeneration-guard.js` | Prevent duplicate AI responses and guard regeneration |
| 35 | `ai-response-stream-monitor.js` | Monitor and react to streaming AI messages in real-time |
| 36 | `ai-response-pyodide-runner-guarded.js` | Guarded Pyodide execution of Python code from AI messages |

---

## 17. Implementation Rules Derived from Docs

1. **IIFE wrapping** — every snippet must be wrapped in `(async () => { ... })();` or `(() => { ... })();`.
2. **Double-init guard** — use a namespaced flag (e.g., `window.__pcbw_snippetName_init`) to prevent re-registration.
3. **Namespaced DOM** — all element IDs and CSS classes must use a `pcbw-` prefix.
4. **Namespaced customData** — use a unique key under `oc.thread.customData` (e.g., `oc.thread.customData.__pcbw_snippetName`).
5. **No global pollution** — all state inside the IIFE; only deliberate namespace exports.
6. **Async event handlers** — use `async` handlers for `MessageAdded` to allow `await` on instruct completions.
7. **Error handling** — wrap all external calls (LLM, image, Pyodide) in try/catch.
8. **Graceful degradation** — if network fails, show user-friendly message or skip non-essential behavior.
9. **No character-specific hardcoding** — all names, URLs, settings must be configurable constants at the top.
10. **Theme awareness** — use `light-dark()` CSS function for colors that work in both themes.
11. **AI content hiding** — use `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` for user-only visual content.
12. **Message operations** — use documented array methods on `oc.thread.messages`.
13. **Pyodide guarding** — lazy-load, singleton, sessionStorage workaround, try/catch, fallback UI.
14. **CSS scoping** — all styles inline or in `<style>` tags with namespaced selectors.
15. **No external dependencies** — all code must be self-contained vanilla JS/CSS.

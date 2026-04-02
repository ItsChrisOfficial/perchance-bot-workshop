# Snippet Selection Guide

> **Task-oriented guide for choosing the right snippets from `snippets/custom-code/`.**

This repository contains 36 reusable `customCode` snippets across five categories (Transformations, Prompting, UI/UX, Pregeneration, AI Response). Each snippet is IIFE-wrapped, init-guarded, namespaced, theme-aware, and character-agnostic. This guide helps you pick the right combination for your bot's needs without reading every file.

For the canonical list of all snippets with metadata, see [`SNIPPETS_INDEX.md`](../SNIPPETS_INDEX.md).
For import/export safety rules, see [`PERCHANCE_IMPORT_VERIFICATION.md`](./PERCHANCE_IMPORT_VERIFICATION.md).

---

## How to use this guide

1. **Start with the Quick Decision Table** — find your goal, get snippet names.
2. **Read the matching Scenario** — understand *why* those snippets fit and what companions to add.
3. **Check Combination Guidance** — verify your chosen set doesn't conflict.
4. **Review "When NOT to use"** — make sure a snippet is appropriate.
5. Paste chosen snippets into your bot's `customCode` field in the order they appear in your export.

All snippet filenames below are relative to `snippets/custom-code/`.

---

## Quick Decision Table

| I want to…                                         | Start with                                               | Category         |
| --------------------------------------------------- | -------------------------------------------------------- | ---------------- |
| Initialize character state safely                   | `transforms-state-safe-init-guard.js`                    | Transformations  |
| Track mood/emotion and change bot behavior           | `transforms-character-state-machine.js`                  | Transformations  |
| Switch conversation modes (e.g., combat/social)      | `transforms-mode-switcher.js`                            | Transformations  |
| Change backgrounds/music on scene changes            | `transforms-scene-transition-engine.js`                  | Transformations  |
| Swap avatar images by AI emotion                     | `transforms-avatar-expression-router.js`                 | Transformations  |
| Shift CSS theme based on conversation mood           | `transforms-runtime-theme-shift.js`                      | Transformations  |
| Inject hidden system context                         | `prompting-hidden-system-injector.js`                    | Prompting        |
| Enforce a specific AI writing style                  | `prompting-response-style-enforcer.js`                   | Prompting        |
| Classify/label AI messages (e.g., tone badges)       | `prompting-last-message-classifier.js`                   | Prompting        |
| Summarize context to stay within token limits        | `prompting-context-packer.js`                            | Prompting        |
| Change reminderMessage based on conversation state   | `prompting-dynamic-reminder-router.js`                   | Prompting        |
| Add custom slash/bang commands                       | `prompting-slash-command-interpreter.js`                 | Prompting        |
| Create a draggable floating panel                    | `ui-floating-panel-shell.js`                             | UI/UX            |
| Show a centered modal dialog                         | `ui-modal-dialog-shell.js`                               | UI/UX            |
| Add a slide-out side panel (e.g., settings)          | `ui-slideout-side-panel.js`                              | UI/UX            |
| Add a pull-up bottom drawer                          | `ui-bottom-drawer.js`                                    | UI/UX            |
| Create a fixed toolbar with icon buttons             | `ui-toolbar-button-cluster.js`                           | UI/UX            |
| Show auto-dismissing toast notifications             | `ui-toast-notifications.js`                              | UI/UX            |
| Build a multi-tab settings/info panel                | `ui-tabbed-panel.js`                                     | UI/UX            |
| Display an animated progress bar                     | `ui-progress-bar.js`                                     | UI/UX            |
| Ask yes/no confirmation before actions               | `ui-confirmation-dialog.js`                              | UI/UX            |
| Style messages differently per author                | `ui-theme-adaptive-message-style.js`                     | UI/UX            |
| Dynamically manage shortcut buttons by state         | `ui-shortcut-button-orchestrator.js`                     | UI/UX            |
| Add an in-iframe debug console                       | `ui-debug-console-panel.js`                              | UI/UX            |
| Preload images for fast display                      | `prewarm-image-cache.js`                                 | Pregeneration    |
| Preload audio clips                                  | `prewarm-audio-cache.js`                                 | Pregeneration    |
| Preload full scene asset bundles                     | `prewarm-scene-assets.js`                                | Pregeneration    |
| Sanitize AI message HTML                             | `preformat-message-html-sanitizer.js`                    | Pregeneration    |
| Normalize roleplay message formatting                | `preformat-roleplay-layout-normalizer.js`                | Pregeneration    |
| Generate text-to-image prompts from conversation     | `prebake-image-prompt-builder.js`                        | Pregeneration    |
| Programmatically seed initial messages               | `prebake-initial-message-seeder.js`                      | Pregeneration    |
| Manage lore entries via customData                   | `prebake-lore-loader-helper.js`                          | Pregeneration    |
| Post-process AI responses through a pipeline         | `ai-response-postprocessor.js`                           | AI Response      |
| Detect/remove duplicate AI responses                 | `ai-response-regeneration-guard.js`                      | AI Response      |
| Monitor streaming AI messages                        | `ai-response-stream-monitor.js`                          | AI Response      |
| Run Python/Pyodide code from conversation            | `ai-response-pyodide-runner-guarded.js`                  | AI Response      |

---

## Implementation Scenarios

### Scenario 1 — Stateful Roleplay Bot

**Goal:** Build a bot that remembers relationship status, inventory, and location across messages.

**Best snippet(s):**
- `transforms-state-safe-init-guard.js`
- `transforms-character-state-machine.js`

**Why:** The init guard establishes a safe `customData` foundation with merged defaults, preventing state loss on reload. The state machine adds FSM logic so the bot can transition between moods/relationship tiers based on LLM classification of each exchange.

**Likely companions:**
- `prompting-dynamic-reminder-router.js` — adjust the reminderMessage based on current relationship state
- `ui-shortcut-button-orchestrator.js` — show different action buttons depending on state (e.g., "Confess feelings" only appears at high affection)

**Risks/conflicts:**
- If both the state machine and mode switcher write to overlapping `customData` keys, one may overwrite the other. Namespace your state keys carefully.
- The state machine uses LLM classification, which adds latency per message.

---

### Scenario 2 — Dynamic Avatar Expressions

**Goal:** The bot's avatar image changes to match the AI's current emotion (happy, angry, sad, etc.).

**Best snippet(s):**
- `transforms-avatar-expression-router.js`

**Why:** This snippet maps classified AI emotions to avatar image URLs, updating the displayed avatar after each AI response. It uses configurable emotion-to-URL mappings at the top of the file.

**Likely companions:**
- `transforms-state-safe-init-guard.js` — ensure expression state persists across reloads
- `prewarm-image-cache.js` — preload all avatar variants so swaps are instant

**Risks/conflicts:**
- Requires multiple avatar images hosted at accessible URLs. If URLs are unreachable, the avatar may show a broken image.
- If combined with `transforms-scene-transition-engine.js`, both may attempt to modify visual state; ensure they target separate DOM elements.

---

### Scenario 3 — Interactive Settings Panel

**Goal:** Give users a slide-out panel where they can toggle bot features (e.g., NSFW filter, verbosity, language).

**Best snippet(s):**
- `ui-slideout-side-panel.js`
- `ui-toolbar-button-cluster.js`

**Why:** The side panel provides a right-side slide-out container for settings content. The toolbar gives the user a fixed button to open/close it.

**Likely companions:**
- `ui-toast-notifications.js` — confirm setting changes with a brief toast ("Verbosity set to High")
- `transforms-state-safe-init-guard.js` — persist user preferences in `customData`
- `prompting-dynamic-reminder-router.js` — apply saved preferences by switching the active reminderMessage

**Risks/conflicts:**
- Multiple panel snippets (floating, modal, slideout, drawer) can overlap visually if opened simultaneously. Use z-index management or ensure only one is open at a time.
- The side panel may obscure the chat on narrow viewports.

---

### Scenario 4 — Scene-Switching Adventure Bot

**Goal:** Build an adventure/visual-novel bot where scenes change dynamically — different backgrounds, ambient music, and visual filters based on story progression.

**Best snippet(s):**
- `transforms-scene-transition-engine.js`
- `prewarm-scene-assets.js`

**Why:** The scene engine uses LLM classification to detect scene changes and applies background images, CSS filters, and music cues. The scene preloader ensures assets load before they are needed, preventing jarring delays.

**Likely companions:**
- `transforms-state-safe-init-guard.js` — track current scene in `customData`
- `prewarm-audio-cache.js` — preload ambient audio loops
- `prompting-hidden-system-injector.js` — inject scene-specific context ("You are now in the dark forest") as hidden system messages
- `ui-progress-bar.js` — show a loading bar during asset preloading

**Risks/conflicts:**
- Scene assets require network access. Offline users will see fallback content.
- `prewarm-scene-assets.js` and `prewarm-image-cache.js` + `prewarm-audio-cache.js` overlap; use `prewarm-scene-assets.js` as the combined solution instead of both individual prewarmers.
- Heavy asset preloading can slow initial page load on mobile.

---

### Scenario 5 — Custom Slash Commands

**Goal:** Let users type `!reset`, `!stats`, `!mode combat`, etc., to control the bot via text commands.

**Best snippet(s):**
- `prompting-slash-command-interpreter.js`

**Why:** This snippet parses user messages for `!` prefixed commands, routes them to registered handlers, and prevents the command text from being sent to the AI as a regular message.

**Likely companions:**
- `transforms-state-safe-init-guard.js` — commands like `!reset` need to mutate `customData`
- `ui-toast-notifications.js` — show feedback toasts ("Stats reset", "Mode changed to combat")
- `transforms-mode-switcher.js` — if commands include mode changes, wire the handler to the mode switcher
- `transforms-character-state-machine.js` — `!stats` can read and display the current FSM state

**Risks/conflicts:**
- If the user's character name or roleplay text naturally includes `!`, false positives can occur. Configure the command prefix carefully.
- Command parsing runs before AI sees the message, so typos in commands will silently fail unless you add error feedback.

---

### Scenario 6 — AI Response Post-Processing Pipeline

**Goal:** Clean up, format, or transform every AI response before display (e.g., strip OOC markers, add formatting, censor words).

**Best snippet(s):**
- `ai-response-postprocessor.js`

**Why:** Provides an extensible pipeline architecture where you register transform functions that run sequentially on each AI response. Add or remove processing steps without rewriting core logic.

**Likely companions:**
- `preformat-message-html-sanitizer.js` — add HTML sanitization as a pipeline step
- `preformat-roleplay-layout-normalizer.js` — normalize RP formatting (italics for actions, quotes for speech)
- `ai-response-regeneration-guard.js` — filter out duplicate/repeated responses before formatting

**Risks/conflicts:**
- Pipeline order matters. Sanitization should run before formatting normalization, which should run before display transforms.
- If the postprocessor modifies message content and `prompting-last-message-classifier.js` also reads it, ensure the classifier reads the original, not the modified version.

---

### Scenario 7 — Debug/Development Aid

**Goal:** Add a developer console inside the Perchance iframe to inspect `customData`, view logs, and test snippet behavior during development.

**Best snippet(s):**
- `ui-debug-console-panel.js`

**Why:** Provides an in-iframe debug console that captures `console.log`/`warn`/`error` output, displays `customData` state, and allows evaluating expressions. Essential for debugging since browser DevTools have limited access inside Perchance iframes.

**Likely companions:**
- `ui-toolbar-button-cluster.js` — add a "Debug" button to the toolbar to toggle the console
- `ui-floating-panel-shell.js` — alternative: host the debug console inside a draggable floating panel

**Risks/conflicts:**
- **Remove before production.** The debug console exposes internal state to end users.
- Log capture may interfere with other snippets that rely on native `console` methods. The debug console wraps `console.*`, so ensure it initializes first.

---

### Scenario 8 — Mood-Responsive Bot with Theme Shifts

**Goal:** Build a bot whose visual theme (colors, fonts, atmosphere) shifts based on the overall conversational mood — cheerful conversations get warm tones, tense conversations get dark tones.

**Best snippet(s):**
- `transforms-runtime-theme-shift.js`
- `transforms-character-state-machine.js`

**Why:** The theme shift snippet uses a rolling-window mood tracker to compute the dominant emotional tone and applies matching CSS custom properties. The state machine provides the underlying mood classification per message.

**Likely companions:**
- `transforms-state-safe-init-guard.js` — persist mood history in `customData`
- `transforms-avatar-expression-router.js` — sync avatar expression with the mood theme
- `ui-theme-adaptive-message-style.js` — style individual messages to match the active theme

**Risks/conflicts:**
- Both `transforms-runtime-theme-shift.js` and `ui-theme-adaptive-message-style.js` modify CSS. Ensure they target different scopes (global theme vs. per-message styling) to avoid conflicts.
- Rapid mood swings can cause jarring visual flicker. The rolling window smooths this, but test with volatile conversations.

---

### Scenario 9 — Confirmation Dialogs Before Dangerous Actions

**Goal:** Ask the user "Are you sure?" before irreversible actions like resetting progress, deleting saved data, or triggering a major story branch.

**Best snippet(s):**
- `ui-confirmation-dialog.js`

**Why:** Provides a promise-based yes/no dialog that integrates cleanly with async workflows. Call `await confirm("Reset all progress?")` and branch on the result.

**Likely companions:**
- `prompting-slash-command-interpreter.js` — wrap destructive commands (`!reset`) in a confirmation prompt
- `transforms-state-safe-init-guard.js` — the state being protected by the confirmation
- `ui-toast-notifications.js` — confirm the outcome after the user decides ("Progress reset" or "Cancelled")

**Risks/conflicts:**
- On rapid repeated actions, multiple dialogs can stack. Ensure only one confirmation is active at a time.
- If the user dismisses the dialog (e.g., clicks outside), treat it as "No" to prevent accidental data loss.

---

### Scenario 10 — Dynamic Shortcut Buttons by Game State

**Goal:** Show different shortcut buttons depending on the current game state — "Attack" and "Defend" in combat, "Talk" and "Examine" in exploration.

**Best snippet(s):**
- `ui-shortcut-button-orchestrator.js`
- `transforms-character-state-machine.js`

**Why:** The orchestrator manages shortcut button sets declaratively — you define which buttons belong to each state, and it swaps them when the state changes. The state machine provides the state transitions.

**Likely companions:**
- `transforms-state-safe-init-guard.js` — persist current state so buttons survive reload
- `transforms-mode-switcher.js` — alternative lighter approach if you only need 2–3 fixed modes

**Risks/conflicts:**
- Shortcut button changes are visible to the user immediately. Rapid state changes can cause button flicker.
- If combined with `prompting-slash-command-interpreter.js`, ensure command-triggered state changes also update the button set.

---

### Scenario 11 — Pyodide Computation Bot

**Goal:** Build a bot that can execute Python code (math, data analysis, plotting) within the conversation.

**Best snippet(s):**
- `ai-response-pyodide-runner-guarded.js`

**Why:** This snippet provides a guarded Pyodide execution environment that safely runs Python code blocks extracted from AI responses. It handles Pyodide loading, sandboxing, and error capture.

**Likely companions:**
- `ui-progress-bar.js` — show a progress bar during Pyodide's initial load (~15 MB)
- `ai-response-postprocessor.js` — integrate Pyodide output back into the displayed message
- `ui-toast-notifications.js` — notify the user when Pyodide finishes loading
- `ui-debug-console-panel.js` — display Python execution logs during development

**Risks/conflicts:**
- Pyodide is large (~15 MB WASM). First load is slow. Consider `prewarm-scene-assets.js` patterns for preloading.
- Pyodide execution is guarded but still runs user/AI-generated code. Review sandboxing constraints.
- Not offline-safe: Pyodide loads from CDN.

---

### Scenario 12 — Context-Aware Long Conversations

**Goal:** Keep the bot coherent during long conversations by summarizing older context to stay within token limits.

**Best snippet(s):**
- `prompting-context-packer.js`

**Why:** Periodically summarizes older messages into compressed context, replacing verbose history with a concise summary. This keeps token usage manageable while preserving key information.

**Likely companions:**
- `prompting-hidden-system-injector.js` — inject the summary as a hidden system message so the AI has context without the user seeing the summary text
- `transforms-state-safe-init-guard.js` — store the latest summary in `customData`
- `prebake-lore-loader-helper.js` — ensure lore entries are included in summaries, not lost

**Risks/conflicts:**
- Summarization uses LLM calls, which add latency. Configure summarization frequency carefully (e.g., every 20 messages, not every message).
- Aggressive summarization can lose important details. Test with conversations that reference early details.
- If combined with `ai-response-stream-monitor.js`, ensure the monitor doesn't interfere with summarization timing.

---

### Scenario 13 — Style-Enforced Roleplay Bot

**Goal:** Ensure the AI always responds in a specific literary style (e.g., third-person past tense, purple prose, terse noir).

**Best snippet(s):**
- `prompting-response-style-enforcer.js`

**Why:** Uses LLM-powered analysis to check each AI response against configurable style rules and requests regeneration or applies corrections when rules are violated.

**Likely companions:**
- `preformat-roleplay-layout-normalizer.js` — normalize formatting after style enforcement
- `prompting-hidden-system-injector.js` — reinforce style rules via hidden system messages
- `ai-response-postprocessor.js` — apply style corrections as a post-processing step

**Risks/conflicts:**
- Style enforcement uses additional LLM calls per response, roughly doubling latency.
- Overly strict rules can cause regeneration loops. Set a maximum retry count.
- May conflict with `prompting-dynamic-reminder-router.js` if the reminder overrides the style instructions.

---

### Scenario 14 — Lore-Heavy World-Building Bot

**Goal:** Build a bot with deep lore (factions, locations, NPCs, history) that can be queried and stays consistent.

**Best snippet(s):**
- `prebake-lore-loader-helper.js`
- `prompting-hidden-system-injector.js`

**Why:** The lore loader manages lore entries in `customData` — add, remove, query by tag. The hidden injector feeds relevant lore entries to the AI as hidden system messages based on context.

**Likely companions:**
- `prompting-context-packer.js` — summarize conversations while preserving lore references
- `transforms-state-safe-init-guard.js` — persist loaded lore state
- `prompting-slash-command-interpreter.js` — add `!lore search <term>` commands for users to query the lore database

**Risks/conflicts:**
- Large lore sets consume token budget. Prioritize relevant entries over dumping everything.
- Lore entries are stored in `customData`, which has size limits. Compress or paginate if needed.

---

### Scenario 15 — Auto-Classifying Message Tones

**Goal:** Automatically tag each AI message with a colored badge indicating its tone (e.g., 🟢 Friendly, 🔴 Hostile, 🟡 Cautious).

**Best snippet(s):**
- `prompting-last-message-classifier.js`

**Why:** Classifies each AI message using configurable categories and renders a colored badge. Uses LLM classification for accuracy.

**Likely companions:**
- `ui-theme-adaptive-message-style.js` — extend classification visuals with full message styling (background tint, border color)
- `transforms-character-state-machine.js` — feed classification results into the state machine for behavioral changes
- `transforms-runtime-theme-shift.js` — use classification data as input to the mood-based theme shift

**Risks/conflicts:**
- Classification adds an LLM call per message. Consider caching or batching.
- If used alongside `ai-response-postprocessor.js`, the classifier should read the original message, not post-processed output.

---

### Scenario 16 — Visual Novel with Preloaded Assets

**Goal:** Build a visual-novel-style bot with preloaded scene images, character sprites, and background music.

**Best snippet(s):**
- `prewarm-scene-assets.js`
- `transforms-scene-transition-engine.js`

**Why:** The scene preloader bundles images, audio, and other assets by scene name, loading them ahead of time. The scene engine swaps active assets when the LLM detects a scene change.

**Likely companions:**
- `ui-progress-bar.js` — show preloading progress to the user
- `ui-toast-notifications.js` — notify when a new scene loads
- `transforms-state-safe-init-guard.js` — track current scene and preload status

**Risks/conflicts:**
- Do not combine `prewarm-scene-assets.js` with both `prewarm-image-cache.js` and `prewarm-audio-cache.js` — the scene preloader already handles both asset types. Using all three creates redundant network requests.
- Large asset bundles on mobile connections may time out.

---

### Scenario 17 — HTML-Safe Bot Responses

**Goal:** Ensure AI responses don't contain dangerous HTML (XSS vectors, broken tags) before rendering.

**Best snippet(s):**
- `preformat-message-html-sanitizer.js`

**Why:** Strips or escapes dangerous HTML constructs from AI messages before they reach the DOM. Protects against prompt injection attacks that try to render malicious HTML.

**Likely companions:**
- `ai-response-postprocessor.js` — integrate sanitization as the first step in the post-processing pipeline
- `preformat-roleplay-layout-normalizer.js` — apply RP formatting after sanitization

**Risks/conflicts:**
- Overly aggressive sanitization can strip legitimate formatting (bold, italic, links). Configure the allowlist carefully.
- Must run before any snippet that renders raw HTML content.

---

### Scenario 18 — Seeded Initial Messages

**Goal:** Programmatically generate initial messages (e.g., randomized greetings, conditional intros based on time of day).

**Best snippet(s):**
- `prebake-initial-message-seeder.js`

**Why:** Generates `initialMessages` array entries programmatically rather than hardcoding them. Supports dynamic content (time-based greetings, randomized intros, conditional narratives).

**Likely companions:**
- `transforms-state-safe-init-guard.js` — initialize state alongside seeded messages
- `prompting-hidden-system-injector.js` — inject context about the seeded scenario as a hidden system message

**Risks/conflicts:**
- `initialMessages` must be a valid array of message objects with `content` (string), `author` ("user"/"ai"/"system"), and optionally `hiddenFrom` (array) and `expectsReply` (boolean).
- Only runs on first load. Re-seeding on reload can duplicate messages if not guarded.

---

### Scenario 19 — Streaming Response Monitor

**Goal:** React to AI responses as they stream in (e.g., show typing indicators, detect content warnings mid-stream).

**Best snippet(s):**
- `ai-response-stream-monitor.js`

**Why:** Hooks into the streaming API to observe partial AI responses in real time, enabling mid-stream reactions without waiting for the full response.

**Likely companions:**
- `ui-progress-bar.js` — show response progress as a bar filling during streaming
- `ai-response-postprocessor.js` — apply post-processing after streaming completes
- `ai-response-regeneration-guard.js` — detect repeated content mid-stream and flag for regeneration

**Risks/conflicts:**
- Stream monitoring adds per-chunk processing overhead. Keep observer callbacks lightweight.
- Not all Perchance AI configurations support streaming. The snippet should degrade gracefully.

---

### Scenario 20 — Multi-Mode Conversation Bot

**Goal:** Bot supports multiple distinct conversation modes — e.g., "Interview Mode" (formal Q&A), "Story Mode" (narrative RP), "Tutor Mode" (educational).

**Best snippet(s):**
- `transforms-mode-switcher.js`
- `prompting-dynamic-reminder-router.js`

**Why:** The mode switcher toggles between named modes via shortcut buttons or commands. The reminder router swaps the active `reminderMessage` to match the selected mode's personality and rules.

**Likely companions:**
- `ui-shortcut-button-orchestrator.js` — show mode-specific shortcut buttons
- `prompting-hidden-system-injector.js` — inject mode-specific hidden context
- `ui-toast-notifications.js` — confirm mode changes
- `transforms-state-safe-init-guard.js` — persist selected mode

**Risks/conflicts:**
- If using both mode switcher and state machine, clarify which one is the source of truth for the current mode. Don't let both try to control the same state.
- Switching modes mid-conversation can confuse the AI. Include a transition message.

---

### Scenario 21 — Text-to-Image Generation from Conversation

**Goal:** Generate image prompts from the current conversation for text-to-image models (e.g., describing the current scene visually).

**Best snippet(s):**
- `prebake-image-prompt-builder.js`

**Why:** Analyzes recent conversation to build structured image generation prompts (subject, setting, style, mood). Requires LLM for prompt extraction.

**Likely companions:**
- `prewarm-image-cache.js` — cache generated images
- `transforms-scene-transition-engine.js` — trigger image generation on scene changes
- `ui-toast-notifications.js` — notify user when an image prompt is generated
- `prompting-slash-command-interpreter.js` — add `!imagine` command to trigger on demand

**Risks/conflicts:**
- Requires LLM calls for prompt extraction. Budget for additional latency.
- Generated prompts are only as good as the conversation context. Short exchanges produce vague prompts.

---

### Scenario 22 — Duplicate Response Detection

**Goal:** Detect when the AI repeats itself and either suppress or flag the duplicate.

**Best snippet(s):**
- `ai-response-regeneration-guard.js`

**Why:** Compares each new AI response against recent responses using similarity checks. Flags or removes duplicates, optionally requesting regeneration.

**Likely companions:**
- `ai-response-postprocessor.js` — integrate deduplication as a pipeline step
- `ui-toast-notifications.js` — notify the user when a duplicate is detected and suppressed
- `ai-response-stream-monitor.js` — detect repetition mid-stream for faster intervention

**Risks/conflicts:**
- Similarity thresholds need tuning. Too strict catches paraphrases; too loose misses near-duplicates.
- Automatic regeneration can loop if the AI persistently repeats. Set a max retry count.

---

### Scenario 23 — Tabbed Character Information Panel

**Goal:** Show a multi-tab panel with character stats, inventory, relationships, and quest log.

**Best snippet(s):**
- `ui-tabbed-panel.js`
- `transforms-state-safe-init-guard.js`

**Why:** The tabbed panel provides a container with switchable tabs for organizing different data views. The init guard ensures the state backing each tab persists.

**Likely companions:**
- `ui-toolbar-button-cluster.js` — add a toolbar button to open/close the panel
- `ui-floating-panel-shell.js` — make the tabbed panel draggable
- `transforms-character-state-machine.js` — populate tab content from FSM state

**Risks/conflicts:**
- Tabs with live-updating content (e.g., stats that change during conversation) need refresh logic. The tabbed panel is a container shell, not a data binding framework.
- Nesting a tabbed panel inside a floating panel works but increases DOM complexity.

---

### Scenario 24 — Bottom Drawer for Mobile-Friendly Interaction

**Goal:** Build a mobile-friendly pull-up drawer for quick-access actions (emoji reactions, quick responses, tools).

**Best snippet(s):**
- `ui-bottom-drawer.js`

**Why:** Provides a bottom-anchored drawer with snap positions (collapsed, half, full) that responds to touch gestures. Optimized for mobile viewports.

**Likely companions:**
- `ui-toolbar-button-cluster.js` — add a drawer toggle button in the toolbar
- `ui-shortcut-button-orchestrator.js` — populate drawer content with dynamic shortcut options
- `ui-toast-notifications.js` — show feedback when drawer actions are triggered

**Risks/conflicts:**
- Bottom drawer may overlap with the chat input area on short screens. Test viewport height handling.
- If combined with `ui-slideout-side-panel.js`, both panels may compete for screen space on mobile. Design mutual exclusivity.

---

### Scenario 25 — Roleplay Formatting Normalization

**Goal:** Ensure consistent formatting across AI responses — italics for actions, quotes for speech, proper paragraph breaks.

**Best snippet(s):**
- `preformat-roleplay-layout-normalizer.js`

**Why:** Applies consistent formatting rules to AI output — wrapping action text in italics, dialogue in quotes, normalizing whitespace and paragraph structure.

**Likely companions:**
- `ai-response-postprocessor.js` — integrate normalization as a pipeline step
- `preformat-message-html-sanitizer.js` — sanitize first, then normalize formatting
- `prompting-response-style-enforcer.js` — enforce style at the prompting level while normalizing at the display level

**Risks/conflicts:**
- Normalization rules are opinionated. The default rules may not match every RP style (e.g., some prefer asterisks for actions over italics).
- Running both `prompting-response-style-enforcer.js` and `preformat-roleplay-layout-normalizer.js` can double-process formatting. Use one at the prompting level and one at the display level, not both at the same stage.

---

### Scenario 26 — Toolbar-Driven Bot Controls

**Goal:** Add a fixed toolbar with icon buttons for common actions (reset, settings, debug, help).

**Best snippet(s):**
- `ui-toolbar-button-cluster.js`

**Why:** Creates a fixed-position toolbar with configurable icon buttons. Each button can trigger any JavaScript callback — opening panels, running commands, toggling features.

**Likely companions:**
- Any panel snippet (`ui-floating-panel-shell.js`, `ui-slideout-side-panel.js`, `ui-modal-dialog-shell.js`) — toolbar buttons open/close panels
- `ui-confirmation-dialog.js` — toolbar "Reset" button triggers a confirmation dialog
- `ui-debug-console-panel.js` — toolbar "Debug" button toggles the debug console

**Risks/conflicts:**
- Fixed positioning can obscure content on small screens. Make the toolbar collapsible or repositionable.
- Too many toolbar buttons create clutter. Limit to 4–6 primary actions.

---

### Scenario 27 — Hidden Context Injection for Multi-Character Scenes

**Goal:** Inject hidden context about NPCs, environment, or world state that the AI can see but the user cannot.

**Best snippet(s):**
- `prompting-hidden-system-injector.js`

**Why:** Pushes hidden system messages (with `hiddenFrom: ["user"]`) into the message array. The AI sees these for context, but they don't appear in the user's chat view.

**Likely companions:**
- `prebake-lore-loader-helper.js` — pull lore entries to inject as hidden context
- `transforms-state-safe-init-guard.js` — track what context has been injected to avoid duplicates
- `prompting-context-packer.js` — summarize injected context when it grows too large

**Risks/conflicts:**
- Hidden messages still consume token budget. Over-injection can push the conversation past token limits.
- Each hidden message must follow the message object contract: `content` (string), `author` ("system"), `hiddenFrom` (array).

---

### Scenario 28 — Toast-Based User Feedback System

**Goal:** Show brief, auto-dismissing notifications for system events (state changes, errors, confirmations).

**Best snippet(s):**
- `ui-toast-notifications.js`

**Why:** Provides a simple API to show styled, auto-dismissing toasts at configurable positions. Supports multiple toast types (success, warning, error, info).

**Likely companions:**
- Nearly any snippet benefits from toast feedback. Common pairings:
  - `prompting-slash-command-interpreter.js` — toast feedback for command results
  - `transforms-mode-switcher.js` — toast confirmation of mode changes
  - `ai-response-regeneration-guard.js` — toast alert when a duplicate is detected

**Risks/conflicts:**
- Toasts can obscure content if too many fire simultaneously. Implement a queue or limit concurrent toasts.
- Toast z-index must be higher than other UI panels to remain visible.

---

### Scenario 29 — Full-Featured Adventure Bot (Complex Combination)

**Goal:** Build a comprehensive adventure bot with scene changes, inventory, NPC interactions, dynamic UI, and preloaded assets.

**Best snippet(s) (core):**
- `transforms-state-safe-init-guard.js` — state foundation
- `transforms-character-state-machine.js` — FSM for game states
- `transforms-scene-transition-engine.js` — scene management
- `prewarm-scene-assets.js` — asset preloading

**Best snippet(s) (UI layer):**
- `ui-tabbed-panel.js` — inventory/stats/quest tabs
- `ui-toolbar-button-cluster.js` — action toolbar
- `ui-shortcut-button-orchestrator.js` — context-sensitive action buttons
- `ui-toast-notifications.js` — event feedback
- `ui-confirmation-dialog.js` — confirm dangerous actions

**Best snippet(s) (prompting layer):**
- `prompting-hidden-system-injector.js` — scene/NPC context
- `prompting-dynamic-reminder-router.js` — state-aware reminders
- `prebake-lore-loader-helper.js` — world lore

**Why:** Each layer handles a distinct concern. State → Scene → UI → Prompting. This mirrors the snippet category architecture.

**Risks/conflicts:**
- This is the maximum-complexity combination. Test incrementally — add one layer at a time.
- Init order matters: state guard → state machine → scene engine → UI → prompting.
- LLM-dependent snippets (state machine, scene engine, style enforcer) compound latency. Expect slower responses.
- Monitor `customData` size — many snippets writing state can accumulate.

---

### Scenario 30 — Theme-Adaptive Message Styling

**Goal:** Style AI, user, and system messages differently, with styles that automatically adapt to light/dark mode.

**Best snippet(s):**
- `ui-theme-adaptive-message-style.js`

**Why:** Applies per-author CSS styles via the `wrapperStyle` mechanism. Uses `light-dark()` CSS function to adapt to the user's theme preference automatically.

**Likely companions:**
- `transforms-runtime-theme-shift.js` — combine per-message styling with global theme shifts
- `prompting-last-message-classifier.js` — style messages based on classification (e.g., hostile messages get a red tint)

**Risks/conflicts:**
- `wrapperStyle` applies inline styles. If the Perchance platform changes its CSS structure, styles may break.
- Combining this with `transforms-runtime-theme-shift.js` requires careful CSS specificity management to avoid one overriding the other.

---

## Combination Guidance

### Snippets That Work Well Together

| Combination                                                    | Why It Works                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------------- |
| `transforms-state-safe-init-guard.js` + any stateful snippet   | Almost every stateful snippet needs a safe init foundation           |
| `ui-toolbar-button-cluster.js` + any panel snippet             | Toolbar buttons are the natural trigger for opening panels           |
| `ai-response-postprocessor.js` + sanitizer + normalizer        | Pipeline architecture is designed for chaining transforms            |
| `prompting-hidden-system-injector.js` + `prebake-lore-loader-helper.js` | Lore entries feed naturally into hidden context injection       |
| `transforms-scene-transition-engine.js` + `prewarm-scene-assets.js`  | Preloading assets for the engine that consumes them              |
| `prompting-slash-command-interpreter.js` + `ui-toast-notifications.js` | Commands need visible feedback                                 |
| `transforms-character-state-machine.js` + `ui-shortcut-button-orchestrator.js` | State-driven button sets                               |
| `transforms-character-state-machine.js` + `prompting-dynamic-reminder-router.js` | FSM state drives reminder selection                   |

### Snippets That Conflict or Overlap

| Combination                                                                      | Issue                                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `prewarm-scene-assets.js` + `prewarm-image-cache.js` + `prewarm-audio-cache.js`  | Scene preloader already combines image and audio caching. Using all three duplicates work.   |
| `transforms-mode-switcher.js` + `transforms-character-state-machine.js`           | Both manage state transitions. Use one as primary, the other as secondary, not both as primary. |
| `transforms-runtime-theme-shift.js` + `ui-theme-adaptive-message-style.js`        | Both modify CSS. Target different scopes (global vs. per-message) to avoid specificity wars.  |
| `prompting-response-style-enforcer.js` + `preformat-roleplay-layout-normalizer.js` | Both touch formatting. Use the enforcer at prompting time, the normalizer at display time.   |
| Multiple panel snippets open simultaneously                                        | Panels can overlap visually. Implement mutual exclusion or z-index management.               |
| `prompting-context-packer.js` + heavy hidden context injection                     | Summarization may discard injected context. Ensure critical hidden messages are marked as persistent. |

### Recommended Init Order

When combining multiple snippets, paste them into `customCode` in this order:

1. **State initialization** — `transforms-state-safe-init-guard.js`
2. **State machines / mode logic** — `transforms-character-state-machine.js`, `transforms-mode-switcher.js`
3. **Scene / visual engines** — `transforms-scene-transition-engine.js`, `transforms-avatar-expression-router.js`, `transforms-runtime-theme-shift.js`
4. **Pregeneration** — prewarm and prebake snippets
5. **Prompting** — injectors, enforcers, classifiers, context packer
6. **UI** — panels, toolbars, toasts, buttons
7. **AI Response** — postprocessor, regeneration guard, stream monitor, Pyodide runner
8. **Debug (dev only)** — `ui-debug-console-panel.js`

---

## When NOT to Use a Snippet

| Situation                                                          | Don't use                                                  | Instead                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Bot only needs static personality, no dynamic behavior             | Any transformation or prompting snippet                    | Use `roleInstruction` and `reminderMessage` fields directly       |
| Only one avatar image, no expression changes                       | `transforms-avatar-expression-router.js`                   | Set the avatar URL in the character config                        |
| Short conversations (< 20 messages), no token pressure             | `prompting-context-packer.js`                              | Let the platform handle context naturally                         |
| No user-facing controls needed                                     | Any `ui-*` snippet                                         | Keep `customCode` focused on logic, not UI                        |
| No network access (offline embed)                                  | `prewarm-image-cache.js`, `prewarm-audio-cache.js`, `prewarm-scene-assets.js`, `ai-response-pyodide-runner-guarded.js` | Use local/embedded assets only |
| Bot is a simple Q&A / chatbot with no game mechanics               | `transforms-character-state-machine.js`, `ui-shortcut-button-orchestrator.js` | Use basic `reminderMessage` and static shortcut buttons |
| Performance-critical bot on low-end devices                        | LLM-dependent snippets (state machine, style enforcer, classifier, context packer, image prompt builder) | Minimize LLM calls; use rule-based logic instead |
| Production release (end users)                                     | `ui-debug-console-panel.js`                                | Remove debug tooling before publishing                            |
| Message formatting is acceptable as-is                             | `preformat-roleplay-layout-normalizer.js`                  | Don't fix what isn't broken                                       |
| Platform already handles HTML safety                               | `preformat-message-html-sanitizer.js`                      | Verify platform behavior first; add sanitizer only if needed      |

---

## Common Selection Mistakes

### 1. Using a state machine when a mode switcher suffices
If you only need 2–3 fixed modes (e.g., "casual" vs. "formal"), `transforms-mode-switcher.js` is simpler than the full FSM in `transforms-character-state-machine.js`. Reserve the state machine for bots with many states, conditional transitions, or states derived from LLM classification.

### 2. Stacking all three prewarmer snippets
`prewarm-scene-assets.js` is the combined solution that handles images and audio together. Only use `prewarm-image-cache.js` or `prewarm-audio-cache.js` individually if you need *only* images or *only* audio without scene-level grouping.

### 3. Adding UI panels without a way to open them
If you add `ui-slideout-side-panel.js` but forget `ui-toolbar-button-cluster.js` or another trigger mechanism, the panel exists but users can't reach it. Always pair container snippets with trigger snippets.

### 4. Forgetting the init guard
`transforms-state-safe-init-guard.js` is not optional when using stateful snippets. Without it, `customData` may be undefined on first load, causing crashes. Add it first.

### 5. Over-engineering simple bots
A bot that just needs a personality and a greeting doesn't need snippets at all. Use `roleInstruction`, `reminderMessage`, `initialMessages`, and `shortcutButtons` directly. Snippets are for dynamic, programmatic behavior.

### 6. Ignoring LLM latency costs
Each LLM-dependent snippet (state machine, style enforcer, classifier, context packer, image prompt builder) adds an extra LLM call per message. Stacking three or more can triple response time. Choose the most valuable LLM features and skip the rest.

### 7. Using the debug console in production
`ui-debug-console-panel.js` exposes internal state, `customData` contents, and console output. It is a development tool. Remove it or gate it behind a developer flag before publishing.

### 8. Applying both style enforcement and layout normalization at the same processing stage
`prompting-response-style-enforcer.js` works at the prompting level (before the AI responds). `preformat-roleplay-layout-normalizer.js` works at the display level (after the AI responds). Using both at the same stage creates redundant or conflicting transforms. Apply them at their intended stages.

### 9. Not testing init order
Snippets have implicit dependencies. If the scene engine reads state that the init guard hasn't created yet, it crashes. Follow the recommended init order in the Combination Guidance section, and test incrementally.

### 10. Choosing a panel type without considering the use case
- **Floating panel** — best for persistent, repositionable information (stats, map)
- **Modal dialog** — best for blocking interactions that need attention (warnings, forms)
- **Slide-out panel** — best for settings or detail views that don't block chat
- **Bottom drawer** — best for mobile-friendly quick actions
- **Tabbed panel** — best for organizing multiple categories of content

Pick the panel type that matches the interaction pattern, not the one that looks coolest.

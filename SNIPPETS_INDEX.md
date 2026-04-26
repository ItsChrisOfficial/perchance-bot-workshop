# Snippets Index

Operational index for reusable snippet assets and snippet-adjacent workflow references used in this repository.  
Use this file to track what exists, where it lives, and how it should be reused safely.

## Snippet fields (required)

Every snippet entry must include:

- **name**: human-readable snippet name
- **path**: repository-relative file path
- **category**: one of:
  - `export-envelope`
  - `custom-code-transformations`
  - `custom-code-prompting`
  - `custom-code-ui`
  - `custom-code-pregeneration`
  - `custom-code-ai-response`
  - `validation`
  - `json-serialization`
  - `message-objects`
  - `shortcut-buttons`
  - `workflow-docs`
- **purpose**: what the snippet/reference is for
- **offline-safe**: yes or no
- **modifies**: messages, UI, state, prompts, or none
- **caveats**: constraints, limits, or required checks before reuse

## Index entries — Workflow docs

| name | path | category | purpose | offline-safe | modifies | caveats |
|---|---|---|---|---|---|---|
| Snippets Workspace Guide | `snippets/README.md` | workflow-docs | Defines what belongs in `snippets/`, naming rules, and maintenance expectations | yes | none | Guidance-only |

## Index entries — Transformations

| name | path | category | purpose | offline-safe | modifies | caveats |
|---|---|---|---|---|---|---|
| State Safe Init Guard | `snippets/custom-code/transformations/transforms-state-safe-init-guard.js` | custom-code-transformations | Reusable safe initialization pattern for customData | yes | state | Only one snippet should own a given namespace key |
| Character State Machine | `snippets/custom-code/transformations/transforms-character-state-machine.js` | custom-code-transformations | Configurable FSM with LLM mood classification | no (LLM call) | state, messages | Classification adds latency per AI message |
| Mode Switcher | `snippets/custom-code/transformations/transforms-mode-switcher.js` | custom-code-transformations | Toggle conversation modes via shortcut buttons | yes | state, prompts, messages | Overwrites reminderMessage and shortcutButtons |
| Scene Transition Engine | `snippets/custom-code/transformations/transforms-scene-transition-engine.js` | custom-code-transformations | LLM-classified scene changes (background, filter, music) | no (LLM call) | state, messages | Background/music URLs must be accessible |
| Avatar Expression Router | `snippets/custom-code/transformations/transforms-avatar-expression-router.js` | custom-code-transformations | Map AI message emotion to avatar URLs | no (LLM call) | messages | Avatar URLs must be set by user |
| Runtime Theme Shift | `snippets/custom-code/transformations/transforms-runtime-theme-shift.js` | custom-code-transformations | Rolling-window mood tracking → dynamic CSS theme | no (LLM call) | state, messages, UI | Overwrites messageWrapperStyle |

## Index entries — Prompting

| name | path | category | purpose | offline-safe | modifies | caveats |
|---|---|---|---|---|---|---|
| Hidden System Injector | `snippets/custom-code/prompting/prompting-hidden-system-injector.js` | custom-code-prompting | Inject hidden system messages for AI-only context | yes | messages | Injected messages consume context window |
| Response Style Enforcer | `snippets/custom-code/prompting/prompting-response-style-enforcer.js` | custom-code-prompting | LLM-powered style rule enforcement on AI messages | no (LLM call) | messages | Adds latency; may alter intended meaning |
| Last Message Classifier | `snippets/custom-code/prompting/prompting-last-message-classifier.js` | custom-code-prompting | Classify AI messages into categories with color-coded badges | no (LLM call) | messages | One LLM call per AI message |
| Context Packer | `snippets/custom-code/prompting/prompting-context-packer.js` | custom-code-prompting | Periodic context summarization as hidden system messages | no (LLM call) | messages, state | Summaries consume context space |
| Dynamic Reminder Router | `snippets/custom-code/prompting/prompting-dynamic-reminder-router.js` | custom-code-prompting | Intent-based dynamic reminderMessage switching | no (LLM call) | prompts, state | Overwrites reminderMessage |
| Slash Command Interpreter | `snippets/custom-code/prompting/prompting-slash-command-interpreter.js` | custom-code-prompting | Parse and handle custom ! commands from user messages | yes | messages | Command messages are removed from thread |

## Index entries — UI/UX

| name | path | category | purpose | offline-safe | modifies | caveats |
|---|---|---|---|---|---|---|
| Floating Panel Shell | `snippets/custom-code/ui-ux/ui-floating-panel-shell.js` | custom-code-ui | Draggable floating panel in iframe | yes | UI | Requires oc.window.show() |
| Modal Dialog Shell | `snippets/custom-code/ui-ux/ui-modal-dialog-shell.js` | custom-code-ui | Centered modal dialog with overlay | yes | UI | Requires oc.window.show() |
| Slideout Side Panel | `snippets/custom-code/ui-ux/ui-slideout-side-panel.js` | custom-code-ui | Right-side slide-out panel | yes | UI | Requires oc.window.show() |
| Bottom Drawer | `snippets/custom-code/ui-ux/ui-bottom-drawer.js` | custom-code-ui | Pull-up drawer with snap positions | yes | UI | Requires oc.window.show() |
| Toolbar Button Cluster | `snippets/custom-code/ui-ux/ui-toolbar-button-cluster.js` | custom-code-ui | Fixed toolbar with configurable icon buttons | yes | UI | Requires oc.window.show() |
| Toast Notifications | `snippets/custom-code/ui-ux/ui-toast-notifications.js` | custom-code-ui | Auto-dismissing toast notification system | yes | UI | Requires oc.window.show() |
| Tabbed Panel | `snippets/custom-code/ui-ux/ui-tabbed-panel.js` | custom-code-ui | Tabbed content panel | yes | UI, state | Requires oc.window.show() |
| Progress Bar | `snippets/custom-code/ui-ux/ui-progress-bar.js` | custom-code-ui | Animated progress/loading bar | yes | UI | Requires oc.window.show() |
| Confirmation Dialog | `snippets/custom-code/ui-ux/ui-confirmation-dialog.js` | custom-code-ui | Yes/No confirmation dialog with promise API | yes | UI | One dialog at a time |
| Theme Adaptive Message Style | `snippets/custom-code/ui-ux/ui-theme-adaptive-message-style.js` | custom-code-ui | Apply theme-aware CSS per-author via wrapperStyle | yes | messages | May conflict with other wrapperStyle snippets |
| Shortcut Button Orchestrator | `snippets/custom-code/ui-ux/ui-shortcut-button-orchestrator.js` | custom-code-ui | Dynamically manage shortcut buttons based on state | yes | state, UI | Overwrites shortcutButtons |
| Shortcut Image & Comms Pack | `snippets/custom-code/ui-ux/ui-shortcut-image-comms-pack.js` | custom-code-ui | Reply-as slash commands (/sys /ai /user /image), mid-action scene/POV image shortcuts, comms-mode reminder toggle | no (LLM + image calls) | messages, state, prompts, UI | Overwrites shortcutButtons and reminderMessage; image generation is rate-limited (5–15 s); empty-payload /ai falls through to preserve base button |
| Debug Console Panel | `snippets/custom-code/ui-ux/ui-debug-console-panel.js` | custom-code-ui | In-iframe debug console with log capture | yes | UI | Overrides console methods in iframe |

## Index entries — Pregeneration / Prewarming / Preformatting / Prebaking

| name | path | category | purpose | offline-safe | modifies | caveats |
|---|---|---|---|---|---|---|
| Image Cache | `snippets/custom-code/pregeneration/prewarm-image-cache.js` | custom-code-pregeneration | Preload images into browser cache | no (network) | none | URLs must be CORS-friendly |
| Audio Cache | `snippets/custom-code/pregeneration/prewarm-audio-cache.js` | custom-code-pregeneration | Preload audio files into Audio objects | no (network) | none | Browser autoplay policies apply |
| Scene Assets | `snippets/custom-code/pregeneration/prewarm-scene-assets.js` | custom-code-pregeneration | Combined image+audio scene preloader | no (network) | messages | URLs must be accessible |
| Message HTML Sanitizer | `snippets/custom-code/pregeneration/preformat-message-html-sanitizer.js` | custom-code-pregeneration | Sanitize message HTML (strip dangerous tags/attrs) | yes | messages | Regex-based; not full DOM parser |
| Roleplay Layout Normalizer | `snippets/custom-code/pregeneration/preformat-roleplay-layout-normalizer.js` | custom-code-pregeneration | Normalize RP formatting (*actions*, "dialogue") | yes | messages | Regex-based; may miss edge cases |
| Image Prompt Builder | `snippets/custom-code/pregeneration/prebake-image-prompt-builder.js` | custom-code-pregeneration | Build text-to-image prompts from conversation context | no (LLM call) | messages | Generated prompts are reference only |
| Initial Message Seeder | `snippets/custom-code/pregeneration/prebake-initial-message-seeder.js` | custom-code-pregeneration | Programmatically seed initialMessages | yes | prompts | Overwrites initialMessages |
| Lore Loader Helper | `snippets/custom-code/pregeneration/prebake-lore-loader-helper.js` | custom-code-pregeneration | Manage lore entries via customData with auto-injection | yes | messages, state | Keyword matching is not semantic |

## Index entries — AI Response Functionality

| name | path | category | purpose | offline-safe | modifies | caveats |
|---|---|---|---|---|---|---|
| Postprocessor | `snippets/custom-code/ai-response/ai-response-postprocessor.js` | custom-code-ai-response | Extensible post-processing pipeline for AI messages | yes | messages | Processor errors caught individually |
| Regeneration Guard | `snippets/custom-code/ai-response/ai-response-regeneration-guard.js` | custom-code-ai-response | Detect and remove duplicate AI responses | yes | messages | Simple hash comparison; near-dupes may pass |
| Stream Monitor | `snippets/custom-code/ai-response/ai-response-stream-monitor.js` | custom-code-ai-response | Monitor streaming AI messages in real-time | yes | UI | Heavy processing may degrade performance |
| Pyodide Runner (Guarded) | `snippets/custom-code/ai-response/ai-response-pyodide-runner-guarded.js` | custom-code-ai-response | Guarded optional Pyodide (Python) execution | no (network) | none | ~10-20 MB download; JSPI crash risk on Chrome/Edge; Pyodide-optional |

## Supporting reference docs

These docs help you choose, compose, and troubleshoot snippets:

| Question | Reference |
|---|---|
| Which snippet fits my task? | `docs/SNIPPET_SELECTION_GUIDE.md` (30 task-to-snippet scenarios) |
| How do I combine multiple snippets? | `docs/REUSABLE_PATTERN_RECIPES.md` (12 composition recipes) |
| Is this capability realistic in customCode? | `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` (47 capability rows) |
| What prompting approach should I use? | `docs/PROMPTING_PATTERNS.md` (22 patterns) |
| How do I style messages and panels? | `docs/STYLING_RECIPES.md` (22 CSS recipes) |
| What usually goes wrong? | `docs/COMMON_FAILURE_MODES.md` (33 failure modes) |
| Am I ready to merge? | `docs/CUSTOM_CODE_IMPLEMENTATION_CHECKLIST.md` |

## Update rules

1. Add an entry for each new snippet file at creation time.
2. Update or remove entries when snippet files are moved, renamed, or deleted.
3. Keep category values restricted to the canonical list in this document.
4. Keep paths repository-relative and verify each path exists before committing.
5. Keep purpose/reuse/caveats concise and operational so agents can apply snippets safely.
6. If a file is documentation-only but drives snippet usage workflow, categorize it as `workflow-docs`.

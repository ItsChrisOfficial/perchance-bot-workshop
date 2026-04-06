# Monolithic Prompt Guide

How to create a complete, import-ready Perchance bot in a single Copilot Agent session.

---

## The problem this solves

Traditional bot creation in this repo required:

1. Writing a design doc
2. Writing customCode separately
3. Assembling the export by hand
4. Debugging escaping issues
5. Running validation
6. Fixing structural problems

That is 5–6 back-and-forth cycles with the agent. Each cycle adds risk of structural drift and escaping bugs.

The **monolithic prompt workflow** collapses all of that into one agent pass.

---

## How it works

You fill out one brief. The agent reads it and writes a complete, validated, importable `.export.json` with no follow-up.

```
You                               Agent
────                              ─────
Fill out BRIEF.md         →       Parse brief
                                  Compose customCode (as JS)
                                  Assemble export object
                                  Serialize to JSON
                                  Validate (PERCHANCE_IMPORT_VERIFICATION)
                          ←       Write bots/in-progress/<slug>/<slug>.export.json
                          ←       Update BOT_CATALOG.md
                                  Done.
```

---

## Quickstart

### 1. Copy the brief template

```bash
cp shared/prompts/CREATE_BOT_MONOLITHIC.md bots/in-progress/my-bot/BRIEF.md
```

### 2. Fill it out

Open `bots/in-progress/my-bot/BRIEF.md` and fill in:

- `BOT_NAME`, `BOT_SLUG`, `MODEL` — required
- `ROLE_INSTRUCTION` — required (your full system prompt)
- Everything else is optional; leave blank for defaults

### 3. Invoke the agent

In GitHub Copilot Chat (Agent mode `@workspace`):

```
Create this bot from the brief at bots/in-progress/my-bot/BRIEF.md
and write the export to bots/in-progress/my-bot/my-bot.export.json
```

### 4. Import the result

The agent writes the export file. Import it directly at [perchance.org/ai-character-chat](https://perchance.org/ai-character-chat) using the import button.

---

## Brief section reference

| Section | Required | What it controls |
|---|---|---|
| `IDENTITY` | Partially | Name, model, temperature, folder |
| `CHARACTER DESIGN` | `ROLE_INSTRUCTION` required | System prompt, reminder, writing style |
| `PERSONA DETAILS` | Optional | Avatar, background, music, CSS |
| `INITIAL MESSAGES` | Optional | Seeded conversation history |
| `SHORTCUT BUTTONS` | Optional | UI quick-action buttons |
| `FEATURES` | Optional | Auto-select snippets (state machine, toast, etc.) |
| `CUSTOM CODE EXTRA` | Optional | Freeform JS beyond the snippet system |
| `LORE BOOKS` | Optional | External lore book URLs |
| `META / SHARE PAGE` | Optional | og:title, og:description, og:image |

---

## Feature flags explained

Setting a feature flag to `true` in the brief tells the agent to:

1. Check `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` — confirm it's feasible
2. Pull the correct snippet from `snippets/custom-code/`
3. Compose it safely with other active features (checking `docs/COMMON_FAILURE_MODES.md`)
4. Merge everything into one `customCode` block

You do NOT need to know which snippet files to use. The agent handles selection.

### Feature → snippet mapping

| Feature flag | Snippet used |
|---|---|
| `state_machine` | `snippets/custom-code/transformations/transforms-character-state-machine.js` |
| `mode_switcher` | `snippets/custom-code/transformations/transforms-mode-switcher.js` |
| `scene_transitions` | `snippets/custom-code/transformations/transforms-scene-transition-engine.js` |
| `avatar_expressions` | `snippets/custom-code/transformations/transforms-avatar-expression-router.js` |
| `runtime_theme` | `snippets/custom-code/transformations/transforms-runtime-theme-shift.js` |
| `hidden_system_inject` | `snippets/custom-code/prompting/prompting-hidden-system-injector.js` |
| `style_enforcer` | `snippets/custom-code/prompting/prompting-response-style-enforcer.js` |
| `message_classifier` | `snippets/custom-code/prompting/prompting-last-message-classifier.js` |
| `context_packer` | `snippets/custom-code/prompting/prompting-context-packer.js` |
| `dynamic_reminder` | `snippets/custom-code/prompting/prompting-dynamic-reminder-router.js` |
| `slash_commands` | `snippets/custom-code/prompting/prompting-slash-command-interpreter.js` |
| `floating_panel` | `snippets/custom-code/ui-ux/ui-floating-panel-shell.js` |
| `toast_notifications` | `snippets/custom-code/ui-ux/ui-toast-notifications.js` |
| `debug_console` | `snippets/custom-code/ui-ux/ui-debug-console-panel.js` |
| `image_cache` | `snippets/custom-code/pregeneration/prewarm-image-cache.js` |
| `audio_cache` | `snippets/custom-code/pregeneration/prewarm-audio-cache.js` |
| `message_sanitizer` | `snippets/custom-code/pregeneration/preformat-message-html-sanitizer.js` |
| `roleplay_normalizer` | `snippets/custom-code/pregeneration/preformat-roleplay-layout-normalizer.js` |
| `lore_loader` | `snippets/custom-code/pregeneration/prebake-lore-loader-helper.js` |
| `stream_monitor` | `snippets/custom-code/ai-response/ai-response-stream-monitor.js` |
| `regen_guard` | `snippets/custom-code/ai-response/ai-response-regeneration-guard.js` |
| `postprocessor` | `snippets/custom-code/ai-response/ai-response-postprocessor.js` |

---

## Validation

After the agent writes the export, run:

```bash
node scripts/validate-perchance-export.js bots/in-progress/<slug>/<slug>.export.json
python -m unittest tests/test-validate-perchance-export.py
```

Both must pass before promoting to `bots/completed/`.

---

## Promoting to completed

Once validated:

1. Move the folder: `bots/in-progress/<slug>/` → `bots/completed/<slug>/`
2. Update `BOT_CATALOG.md` status to `completed`
3. Update `REPO_MAP.md` if needed
4. Open a PR — the PR template checklist handles the rest

---

## Troubleshooting

### "The export doesn't import"

Run the validator. The most common causes:
- `rowCount` mismatch — check `docs/COMMON_FAILURE_MODES.md` FM-01
- broken `customCode` escaping — the agent should never hand-escape; re-run creation
- missing required character fields — check `docs/EXPORT_FIELD_REFERENCE.md` §5

### "The feature I enabled isn't working"

- Check `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` — it may be marked LLM-dependent (requires network)
- Check `docs/COMMON_FAILURE_MODES.md` for conflicts with other features
- Check that the feature's snippet doesn't require `oc.window.show()` (UI snippets do)

### "The agent asked me a follow-up question instead of building"

Re-read `shared/prompts/CREATE_BOT_MONOLITHIC.md` — make sure `BOT_NAME`, `BOT_SLUG`, `MODEL`, and `ROLE_INSTRUCTION` are filled. Those are the only fields that can block one-pass creation.

---

## Related files

| File | Purpose |
|---|---|
| `shared/prompts/CREATE_BOT_MONOLITHIC.md` | The canonical brief template to fill out |
| `agents/monolithic-bot-builder.md` | Step-by-step agent execution spec |
| `.github/copilot-instructions.md` | Copilot agent global rules |
| `.github/instructions/bots.instructions.md` | Bot workspace path-scoped rules |
| `.github/instructions/monolithic-create.instructions.md` | Monolithic creation path-scoped rules |
| `docs/PERCHANCE_IMPORT_VERIFICATION.md` | Import safety release gate |
| `docs/EXPORT_FIELD_REFERENCE.md` | Every export field explained |
| `bots/templates/perchance-empty-minimal.json` | Baseline export template |

# Bot Catalog

Operational inventory for bot assets across lifecycle states.  
Use this file to track where each bot lives, what it is for, and whether it is ready to move forward.

## Lifecycle contract

- `templates`: reusable starters only, not active bot work.
- `in-progress`: active build/iteration state; must not be treated as released.
- `completed`: release-ready state only; promotion requires documented verification pass.

Promotion to `completed` is a release action, not a filing action.

## Entry fields (required)

Every catalog entry must include:

- **name**: human-readable bot/template name
- **lifecycle state**: `templates`, `in-progress`, or `completed`
- **path**: repository-relative path to the file/folder
- **purpose**: one-line statement of intended use
- **status**: current work status (for example: `ready`, `draft`, `active`, `blocked`, `archived`)
- **verification state**: import/validation status (for example: `not-run`, `in-progress`, `passed`, `failed`)
- **notes**: short operational context (handoff notes, constraints, next action)

## Field value conventions

- `status` recommended values:
  - `draft` (early construction)
  - `active` (current development)
  - `blocked` (waiting on dependency/decision)
  - `ready-for-promotion-review` (candidate prepared, pending release gate confirmation)
  - `ready` (completed and released)
- `verification state` recommended values:
  - `not-run`
  - `in-progress`
  - `passed`
  - `failed`
- `notes` should capture latest validation context (for example: which command passed/failed and next action).

## Entry format (example)

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Example Bot | in-progress | `bots/in-progress/example-bot/` | Active build workspace for a single bot | active | in-progress | Update after each validation pass |

## Templates

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Perchance Empty Minimal Template | templates | `bots/templates/perchance-empty-minimal.json` | Default minimal production-safe single-character export envelope starter | ready | passed (validated) | Use by default for new bot builds to minimize non-runtime placeholder material |
| Perchance Empty Annotated Template | templates | `bots/templates/perchance-empty-annotated.json` | Import-safe teaching template with embedded schema guidance | ready | passed (validated) | Guidance is labeled non-runtime and stored as documentation-only customData |
| Perchance Empty CustomCode Template | templates | `bots/templates/perchance_empty_customcode_template.json` | Legacy canonical single-character export envelope starter | ready | passed (baseline template) | Retained for backward compatibility with earlier workflows |

## In-progress bots

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Nyx — The Archivist | in-progress | `bots/in-progress/nyx-archivist/` | Atmospheric RP archivist bot with state machine, lore injection, context packing, slash commands, toast notifications, regen guard, and postprocessor | active | passed | Validator and unittest passed; 8 features composed from snippet library; customCode syntax verified |
| Perchance Foundry Mentor | in-progress | `bots/in-progress/perchance-foundry-mentor/` | Panel-first Perchance teaching mentor with level-based curriculum, field mapping, code lab, optional aliases, reminder routing, hidden-state injection, sanitizer, and regen guard | active | passed | Export generated via monolithic workflow; validator and unittest passed for current artifact |

## Completed bots

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Reference Minimal Helper | completed | `bots/completed/reference-minimal-helper/` | Known-good minimal importable export reference with small valid customCode | ready | passed | Validator and unittest passed on 2026-04-01; use as completed baseline example |
| Reference Minimal Utility Bot | completed | `bots/completed/reference-minimal-utility-bot/` | Clean low-friction utility bot — simplest high-quality reference example | ready | passed | Validator and unittest passed on 2026-04-02; demonstrates clean roleInstruction/reminder, lightweight slash handling, minimal safe customCode |
| State-Driven Companion Bot | completed | `bots/completed/reference-state-driven-companion-bot/` | Personality bot with persistent thread state, mode switching, and companion level progression | ready | passed | Validator and unittest passed on 2026-04-02; demonstrates customData state management, dynamic reminder injection, mode-driven behavior |
| UI-Heavy Interactive Builder Bot | completed | `bots/completed/reference-ui-builder-bot/` | Interactive project builder with floating side panel — strongest embedded-UI example | ready | passed | Validator and unittest passed on 2026-04-02; demonstrates iframe UI rendering, DOM creation, init guards, command-driven workflow |
| Scene-and-Lore Adventure Bot | completed | `bots/completed/reference-scene-lore-adventure-bot/` | Narrative adventure bot with scene progression, lore discovery, and hidden context injection | ready | passed | Validator and unittest passed on 2026-04-02; demonstrates scene transitions, inventory/quest tracking, hidden system messages, dynamic context |
| Image-Oriented Creative Director Bot | completed | `bots/completed/reference-image-director-bot/` | Art direction bot with runtime image prompt manipulation and style presets | ready | passed | Validator and unittest passed on 2026-04-02; demonstrates imagePromptPrefix/Suffix runtime updates, style presets, prompt history tracking |
| Frontier Foundry v1.1 Phase 1 Foundation | completed | `bots/completed/frontier_foundry_1.1/` | Phase 1 foundation with core state management, world generation, party/resource systems, command parser | ready | passed | Validator and unittest passed on 2026-04-02; Phase 1 checkpoint artifact preserved |
| Frontier Foundry v1.2 Phase 2 UI Application | completed | `bots/completed/frontier_foundry_1.2/` | Phase 2 UI application with 7 functional screens, travel system, camp mechanics, real-time updates | ready | passed | Validator and unittest passed on 2026-04-02; Phase 2 checkpoint artifact preserved |
| Chronicle Foundry v1.3 Final - Living Expedition Engine | completed | `bots/completed/frontier_foundry_1.3/` | Stress-test reference bot combining persistent simulation, rich iframe operations UI, advanced party/NPC systems, faction consequences, contract branching, event engine with cooldowns, scene orchestration, AI response shaping, image prompt workflow, debug tooling, state rollback, action gating, and save/restore | ready | passed | Validator and unittest passed on 2026-04-02; Final release with all 13 advanced systems fully implemented and hardened |

## Update rules (contributors and agents)

1. Add or update an entry whenever a bot/template is added, moved, renamed, validated, or retired.
2. Keep `lifecycle state` aligned with folder location:
   - `bots/templates/` -> `templates`
   - `bots/in-progress/` -> `in-progress`
   - `bots/completed/` -> `completed`
3. Use repository-relative paths only and verify they exist before committing.
4. Keep `status` and `verification state` current after each meaningful workflow step.
5. Keep notes short and operational; remove stale notes when state changes.
6. For single-bot work, maintain one row per bot asset to keep ownership and state unambiguous.

## Promotion metadata requirements (`in-progress` -> `completed`)

When promoting a bot, update catalog rows in the same PR:

1. Move `lifecycle state` to `completed`.
2. Update `path` to `bots/completed/<bot-name>/...`.
3. Set `status` to `ready` only after release criteria are satisfied.
4. Set `verification state` to `passed` only after:
   - `node scripts/validate-perchance-export.js <absolute/path-to-export.json>` passes
   - `python -m unittest tests/test-validate-perchance-export.py` passes
5. Update `notes` with concise validation evidence and promotion context.

Use your platform's absolute path style when running validator commands.

If validation is incomplete, keep the bot in `in-progress` and do not mark `ready`.

## Common catalog mistakes to avoid

- Marking `verification state: passed` without running required validation commands
- Moving path/lifecycle state without updating status and notes
- Leaving stale `in-progress` rows after promotion
- Tracking multiple ambiguous rows for one bot without clear ownership/version context

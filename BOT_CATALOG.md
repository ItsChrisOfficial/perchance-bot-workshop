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

No bot entries currently tracked under `bots/in-progress/`.

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|

## Completed bots

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Reference Minimal Helper | completed | `bots/completed/reference-minimal-helper/` | Known-good minimal importable export reference with small valid customCode | ready | passed | Validator and unittest passed on 2026-04-01; use as completed baseline example |

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

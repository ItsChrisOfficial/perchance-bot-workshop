# Bot Catalog

Operational inventory for bot assets across lifecycle states.  
Use this file to track where each bot lives, what it is for, and whether it is ready to move forward.

## Entry fields (required)

Every catalog entry must include:

- **name**: human-readable bot/template name
- **lifecycle state**: `templates`, `in-progress`, or `completed`
- **path**: repository-relative path to the file/folder
- **purpose**: one-line statement of intended use
- **status**: current work status (for example: `ready`, `draft`, `active`, `blocked`, `archived`)
- **verification state**: import/validation status (for example: `not-run`, `in-progress`, `passed`, `failed`)
- **notes**: short operational context (handoff notes, constraints, next action)

## Entry format (example)

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Example Bot | in-progress | `bots/in-progress/example-bot/` | Active build workspace for a single bot | active | in-progress | Update after each validation pass |

## Templates

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|
| Perchance Empty CustomCode Template | templates | `bots/templates/perchance_empty_customcode_template.json` | Canonical single-character export envelope starter for new bot builds | ready | passed (baseline template) | Source template referenced by root `README.md` workflow |

## In-progress bots

No bot entries currently tracked under `bots/in-progress/`.

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|

## Completed bots

No bot entries currently tracked under `bots/completed/`.

| name | lifecycle state | path | purpose | status | verification state | notes |
|---|---|---|---|---|---|---|

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

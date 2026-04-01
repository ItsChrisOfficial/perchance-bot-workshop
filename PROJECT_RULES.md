# PROJECT_RULES

Hard repository conventions. These are placement and structure rules, not process guidance.

## 1) Workspace ownership

- `bots/` = bot lifecycle assets only (`templates`, `in-progress`, `completed`)
- `snippets/` = reusable fragments/examples
- `shared/` = shared prompts/utilities/schemas
- `docs/` = standards and operational docs
- `scripts/` = repeatable automation
- `archive/` = retired assets only

## 2) Placement rules

- New bot work must start in `bots/in-progress/<bot-name>/`.
- Release-ready bots belong in `bots/completed/<bot-name>/`.
- Starter exports belong in `bots/templates/`.
- Shared logic belongs in `shared/`, not copied across bot folders.
- Keep repo root limited to governance/index files.

## 3) Promotion rules (`in-progress` -> `completed`)

Promote only when all are true:
- export passes `docs/PERCHANCE_IMPORT_VERIFICATION.md` requirements
- `node scripts/validate-perchance-export.js <export>` passes
- related tests pass (`python -m unittest tests/test-validate-perchance-export.py`)
- `BOT_CATALOG.md` is updated to reflect lifecycle state

## 4) Required index updates

When relevant changes occur, update in the same PR:
- `REPO_MAP.md` for structural/file-map changes
- `BOT_CATALOG.md` for bot add/move/retire
- `SNIPPETS_INDEX.md` for snippet add/move/remove
- affected subtree `README.md` when folder purpose or usage changes

## 5) Naming and consistency

- Use kebab-case for new files/folders.
- Keep folders single-purpose and predictable.
- Prefer small, focused files and minimal diffs.

## 6) Placement mistakes to avoid

- Putting active bot drafts in `bots/completed/`.
- Storing reusable helpers inside one bot folder.
- Adding snippets to `shared/` or shared runtime utilities to `snippets/`.
- Dropping new work products into repo root.

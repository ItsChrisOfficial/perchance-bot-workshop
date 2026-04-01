# AGENTS

## Repository purpose

A structured workspace for building, testing, documenting, and maintaining Perchance bots and reusable assets.

## Required folder conventions

- `bots/`: bot lifecycle work (`completed`, `in-progress`, `templates`)
- `snippets/`: reusable code/content fragments grouped by domain/language
- `shared/`: cross-bot prompts, utilities, and schemas
- `docs/`: architecture notes, standards, and workflows
- `scripts/`: repeatable repo automation tasks
- `archive/`: retired historical material only

## Placement rules

- New bot work starts in `bots/in-progress/`.
- Production-ready bots move to `bots/completed/`.
- Starter examples belong in `bots/templates/`.
- Shared reusable logic belongs in `shared/utilities/`.
- Shared prompt assets belong in `shared/prompts/`.
- Do not dump files into the repository root.

## Index update rules

After adding or moving assets, update:

- `REPO_MAP.md`
- `BOT_CATALOG.md` for bot changes
- `SNIPPETS_INDEX.md` for snippet changes
- affected subtree `README.md`

## Consistency rules

- Prefer literal, predictable kebab-case names.
- Keep files small and focused.
- Prefer minimal diffs and preserve architecture unless intentionally refactoring.

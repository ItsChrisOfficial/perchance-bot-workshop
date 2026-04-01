# perchance-bot-workshop

Repository for building, editing, validating, organizing, and exporting **Perchance Advanced AI Character Chat** bots as import-safe JSON artifacts.

## Mission

This project exists to produce bot exports that are:

- structurally valid for Perchance import
- operationally consistent across contributors and agents
- organized by lifecycle so work is easy to find and maintain

## Read these first

Before changing bot exports or workflow docs, read:

1. `docs/PERCHANCE_IMPORT_VERIFICATION.md` (release gate for import safety)
2. `.github/copilot-instructions.md` (hard rules for Perchance export tasks)
3. `AGENTS.md` (repository operating rules for agents)
4. `PROJECT_RULES.md` (placement and naming rules)
5. `REPO_MAP.md` (current structure and index files)
6. `CONTRIBUTING.md` (contribution workflow)

## End-to-end workflow

1. Start from canonical template assets in `bots/templates/`  
   (`bots/templates/perchance_empty_customcode_template.json`).
2. Build active bots in `bots/in-progress/` using shared assets and snippets where useful.
3. Validate structure and behavior against `docs/PERCHANCE_IMPORT_VERIFICATION.md`.
4. Move finished bots to `bots/completed/` when they are release-ready.
5. Move superseded material to `archive/` when it should no longer drive active work.

## Validation and test commands

- Validate a Perchance export JSON:
  - `node scripts/validate-perchance-export.js /absolute/path/to/export.json`
- Validate repository canonical fixture:
  - `node scripts/validate-perchance-export.js tests/fixtures/valid/canonical-valid.json`
- Run validator tests:
  - `python -m unittest tests/test-validate-perchance-export.py`

## How the repo works as a system

- `bots/` holds lifecycle state (template -> active build -> completed output)
- `docs/` defines standards and verification process
- `scripts/` and `tools/` support repeatable validation/maintenance workflows
- `tests/` holds checks and fixtures used to verify output correctness
- `shared/` stores reusable cross-bot assets
- `snippets/` stores small reusable fragments and examples
- `agents/` stores agent-facing guidance and operational notes
- `archive/` stores historical or retired assets

## Placement rules

- Do not dump working files in the repository root.
- Use one bot folder per bot under the correct lifecycle directory.
- Keep names predictable and kebab-case.
- Put reusable assets in `shared/`, not in individual bot folders.
- Put small copy/paste fragments in `snippets/`, not `shared/`.

## Required index updates

Update these when relevant:

- `REPO_MAP.md` for structural changes
- `BOT_CATALOG.md` for bot/template lifecycle changes
- `SNIPPETS_INDEX.md` for snippet additions/removals

## Common mistakes to avoid

- Shipping a bot as a bare character object instead of full export envelope
- Editing bot JSON without checking import verification rules first
- Mixing active bot work into `bots/completed/` too early
- Copying shared helpers into bot folders instead of reusing `shared/`
- Leaving folder purpose unclear by adding files to the wrong workspace

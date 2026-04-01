# AGENTS

Automation rules for coding agents and repo automation.

## Scope

This file governs **how agents operate**. For placement conventions, follow `PROJECT_RULES.md`.

## Mandatory reads before agent edits

1. `PROJECT_RULES.md`
2. `REPO_MAP.md`
3. `CONTRIBUTING.md`
4. `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory** for export JSON or `customCode` tasks)

## Agent execution contract

- Make minimal, scoped diffs.
- Reuse shared assets instead of duplicating helpers.
- Keep filenames/folders kebab-case and predictable.
- If structure changes, update required indexes in the same change.
- Do not mark bot work complete without required validation.

## Validation gate for bot export tasks

If a change touches Perchance export JSON or `customCode`, agents must:
1. Treat `docs/PERCHANCE_IMPORT_VERIFICATION.md` as a release gate.
2. Run `node scripts/validate-perchance-export.js <file>` on changed exports.
3. Run `python -m unittest tests/test-validate-perchance-export.py` before finalizing.
4. Keep canonical envelope/table integrity unless task explicitly requires compatibility changes.

## Automation mistakes to avoid

- Returning snippets when task asks for finished export artifact.
- Moving bots to `completed` before validation.
- Updating bot/snippet files without index updates.
- Creating duplicate utility logic under bot folders instead of shared locations.

# AGENTS

Automation rules for coding agents and repo automation.

## Scope

This file governs **how agents operate**. For placement conventions, follow `PROJECT_RULES.md`.

## Mandatory reads before agent edits

1. `PROJECT_RULES.md`
2. `REPO_MAP.md`
3. `CONTRIBUTING.md`
4. `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory** for export JSON or `customCode` tasks)

## Decision and reference docs for customCode tasks

Before implementing customCode-heavy changes, agents should consult:

- `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` — check whether the requested capability is realistic in Perchance customCode
- `docs/SNIPPET_SELECTION_GUIDE.md` — identify which existing snippets to start from
- `docs/REUSABLE_PATTERN_RECIPES.md` — see how snippets compose into bot designs
- `docs/COMMON_FAILURE_MODES.md` — avoid known pitfalls (duplicate listeners, namespace collisions, reminder overwrites)
- `docs/EXPORT_FIELD_REFERENCE.md` — fast lookup for export JSON field types, locations, and scopes
- `docs/PROMPTING_PATTERNS.md` — select appropriate prompting approach (instruction vs reminder vs hidden system message)
- `docs/STYLING_RECIPES.md` — copy-ready CSS for message styling and iframe UI
- `docs/CUSTOM_CODE_IMPLEMENTATION_CHECKLIST.md` — walk through before marking work complete
- `docs/PYODIDE_COMPATIBILITY_NOTES.md` — consult before adding Pyodide-dependent functionality

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
- Implementing customCode without checking `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` for feasibility.
- Composing multiple snippets without checking `docs/COMMON_FAILURE_MODES.md` for conflicts (especially FM-09, FM-14, FM-17, FM-30–32).

# perchance-bot-workshop

Structured workspace for building and maintaining **Perchance Advanced AI Character Chat** bots as import-safe JSON artifacts.

## Mission

Produce bot exports that are:
- importable
- validated
- organized by lifecycle

## Start here

Read in this order:
1. `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory** when touching export JSON or `customCode`)
2. `PROJECT_RULES.md` (hard placement and structure rules)
3. `CONTRIBUTING.md` (human workflow and PR expectations)
4. `REPO_MAP.md` (current folder map)
5. `AGENTS.md` (automation/agent execution rules)

## Core workflow

1. Start from `bots/templates/`.
2. Build in `bots/in-progress/<bot-name>/`.
3. Validate against `docs/PERCHANCE_IMPORT_VERIFICATION.md`.
4. Run validator/tests.
5. Promote to `bots/completed/<bot-name>/` only when release-ready.
6. Update indexes (`REPO_MAP.md`, `BOT_CATALOG.md`, and `SNIPPETS_INDEX.md` when relevant).

## Template defaults

- Default starter: `bots/templates/perchance-empty-minimal.json`
- Teaching/reference starter: `bots/templates/perchance-empty-annotated.json` (guidance is non-runtime)

## Validation commands

- `node scripts/validate-perchance-export.js /absolute/path/to/export.json`
- `python -m unittest tests/test-validate-perchance-export.py`

## Reference docs

When building or reviewing a bot, these reference docs provide fast lookup and decision support:

| Need | Go to |
|---|---|
| What is possible in customCode? | `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` |
| Which snippet should I use? | `docs/SNIPPET_SELECTION_GUIDE.md` |
| How do I combine snippets? | `docs/REUSABLE_PATTERN_RECIPES.md` |
| What are the export JSON fields? | `docs/EXPORT_FIELD_REFERENCE.md` |
| What prompting approach should I use? | `docs/PROMPTING_PATTERNS.md` |
| How do I style messages and UI? | `docs/STYLING_RECIPES.md` |
| What usually goes wrong? | `docs/COMMON_FAILURE_MODES.md` |
| Am I ready to merge? | `docs/CUSTOM_CODE_IMPLEMENTATION_CHECKLIST.md` |
| How do I plan a new bot? | `docs/BOT_DESIGN_BRIEF_TEMPLATE.md` |
| Should I use Pyodide? | `docs/PYODIDE_COMPATIBILITY_NOTES.md` |
| How do I file an issue? | `docs/ISSUE_INTAKE_TEMPLATES.md` |

## Quick guardrails

- Do not ship bare character JSON; keep full export envelope.
- Do not put active work directly in `bots/completed/`.
- Do not add workspace files to repo root.

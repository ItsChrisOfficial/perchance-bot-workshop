# Contributing

This guide covers the contribution workflow for both human contributors and automated agents.

## Before You Start

Read these documents in order:

1. [`README.md`](../README.md) — repo workflow overview
2. [`PROJECT_RULES.md`](../PROJECT_RULES.md) — placement constraints
3. [`docs/PERCHANCE_IMPORT_VERIFICATION.md`](../docs/PERCHANCE_IMPORT_VERIFICATION.md) — **mandatory** when touching export JSON or `customCode`

## Contribution Workflow

1. **Place files correctly** — follow `PROJECT_RULES.md` workspace ownership rules
2. **Keep changes small** — single-purpose, focused diffs
3. **Reuse shared assets** — don't duplicate helpers across bot folders
4. **Run validation** — when touching export JSON or `customCode`
5. **Update indexes** — `REPO_MAP.md`, `BOT_CATALOG.md`, `SNIPPETS_INDEX.md` as needed
6. **Promote when ready** — move from `in-progress` to `completed` only after full validation

## Placement Rules

| Content Type | Correct Location |
|---|---|
| New bot work | `bots/in-progress/<bot-name>/` |
| Release-ready bots | `bots/completed/<bot-name>/` |
| Starter templates | `bots/templates/` |
| Shared logic/utilities | `shared/` |
| Reusable fragments | `snippets/` |
| Automation scripts | `scripts/` |
| Standards/process docs | `docs/` |
| Retired assets | `archive/` |

### Placement mistakes to avoid

- Creating new bot work directly in `bots/completed/`
- Leaving reusable helper logic in a single bot folder
- Adding new assets at repo root instead of the correct workspace
- Putting snippets in `shared/` or shared utilities in `snippets/`

## Naming Conventions

- Use **kebab-case** for all new files and folders
- Keep folders single-purpose and predictable
- Prefer small, focused files and minimal diffs
- Bot exports: `<bot-name>-vMAJOR.MINOR.PATCH.json`

## Validation Requirements

When export JSON or `customCode` changes:

```bash
# Validate the export
node scripts/validate-perchance-export.js /absolute/path/to/export.json

# Run the test suite
python -m unittest tests/test-validate-perchance-export.py
```

Both must pass. See [Validation and Testing](Validation-and-Testing.md) for details.

## PR Checklist

Every pull request should address these items:

- [ ] Files are placed in correct folders per `PROJECT_RULES.md`
- [ ] `docs/PERCHANCE_IMPORT_VERIFICATION.md` was followed for export/`customCode` changes
- [ ] Validation commands were run and passed (when required)
- [ ] `REPO_MAP.md` updated for structure changes
- [ ] `BOT_CATALOG.md` updated for bot add/move/retire
- [ ] `SNIPPETS_INDEX.md` updated for snippet changes
- [ ] Relevant subtree `README.md` updated when folder usage changed
- [ ] Bot promotion to `completed` only done after validation and readiness

The repository includes a PR template at `.github/pull_request_template.md` with this checklist.

## Index Update Matrix

| Change | Files to Update |
|---|---|
| New/moved/removed top-level folder | `REPO_MAP.md` |
| Bot added/moved/retired | `BOT_CATALOG.md` |
| Snippet added/moved/removed | `SNIPPETS_INDEX.md` |
| Folder purpose changed | Affected subtree `README.md` |
| Bot promoted to completed | `BOT_CATALOG.md` + bot's `RELEASE.md` |

## Agent-Specific Rules

Automated agents (GitHub Copilot, etc.) must also follow these rules from `AGENTS.md`:

- Make minimal, scoped diffs
- Reuse shared assets instead of duplicating helpers
- Keep filenames/folders kebab-case and predictable
- Update required indexes in the same change
- Do not mark bot work complete without required validation
- Treat `docs/PERCHANCE_IMPORT_VERIFICATION.md` as a release gate for any export work

## Code Documentation

The `docs/Code_Documentation/` directory contains reference documentation for Perchance platform features:

- Custom code APIs and examples
- Initial messages format
- Message styling
- Memories and lore
- Text-to-image and TTS plugins
- Python (Pyodide) integration

Use these as reference when building bot behavior.

# CONTRIBUTING

Human contribution workflow and pull request expectations.

## Before you start

1. Read `README.md` for repo workflow.
2. Read `PROJECT_RULES.md` for placement constraints.
3. If touching export JSON or `customCode`, read `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory**).

## Contribution workflow

1. Put files in the correct workspace/folder.
2. Keep changes small and single-purpose.
3. Reuse shared assets; avoid duplicate helpers.
4. Run required validation commands.
5. Update required indexes/docs in the same PR.
6. If a bot is release-ready, promote from `bots/in-progress/` to `bots/completed/`.

## Required validation

When export JSON or `customCode` changes:
- `node scripts/validate-perchance-export.js /absolute/path/to/export.json`
- `python -m unittest tests/test-validate-perchance-export.py`

## PR checklist

- [ ] Files are placed in correct folders per `PROJECT_RULES.md`
- [ ] `docs/PERCHANCE_IMPORT_VERIFICATION.md` was followed for export/`customCode` changes
- [ ] Validation commands were run and passed (when required)
- [ ] `REPO_MAP.md` updated for structure changes
- [ ] `BOT_CATALOG.md` updated for bot add/move/retire
- [ ] `SNIPPETS_INDEX.md` updated for snippet changes
- [ ] Relevant subtree `README.md` updated when folder usage changed
- [ ] Bot promotion to `completed` only done after validation and readiness

## Common placement errors to avoid

- Creating new bot work directly in `bots/completed/`
- Leaving reusable helper logic in a single bot folder
- Adding new assets at repo root instead of the correct workspace

## Summary

- What changed and why.

## Validation

- [ ] `node scripts/validate-perchance-export.js /absolute/path/to/export.json` (if export JSON or `customCode` changed)
- [ ] `python -m unittest tests/test-validate-perchance-export.py` (if export JSON or `customCode` changed)

## Placement and index checks

- [ ] Files are placed per `PROJECT_RULES.md`
- [ ] `REPO_MAP.md` updated for structural/file-map changes
- [ ] `BOT_CATALOG.md` updated for bot add/move/retire
- [ ] `SNIPPETS_INDEX.md` updated for snippet add/move/remove
- [ ] Relevant subtree `README.md` updated when folder usage changed

## Bot lifecycle and release checks

- [ ] `docs/PERCHANCE_IMPORT_VERIFICATION.md` applied for export/`customCode` changes
- [ ] In-progress bot state/notes updated when applicable
- [ ] Promotion to `bots/completed/` done only after validation and readiness
- [ ] Completed bot includes release notes/checklist evidence (`bots/completed/RELEASE_TEMPLATE.md` used when applicable)

# RELEASE TEMPLATE

Use this template inside each completed bot folder as `RELEASE.md`.

## Bot

- Name:
- Lifecycle state: completed
- Export artifact path:
- Release version:
- Release date:

## Verification evidence

- [ ] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [ ] `python -m unittest tests/test-validate-perchance-export.py` passed
- [ ] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context:
- Known constraints:
- Next maintenance action (if any):

## Bot

- Name: UI-Heavy Interactive Builder Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-ui-builder-bot/reference-ui-builder-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Strongest iframe UI example — demonstrates a floating side panel with real-time project state, open/close behavior, init guards, DOM creation with unique IDs, HTML escaping, and command-driven workflow (project → type → features → review → confirm). Shows how to build functional embedded UI without external dependencies.
- Known constraints: Panel is DOM-injected; styling uses light-dark() for theme compatibility. UI state tracked in `oc.thread.customData`. No persistence beyond the thread.
- Next maintenance action (if any): Keep aligned with validator rule updates.

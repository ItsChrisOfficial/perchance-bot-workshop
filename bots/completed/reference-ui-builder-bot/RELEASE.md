## Bot

- Name: UI-Heavy Interactive Builder Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-ui-builder-bot/reference-ui-builder-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js bots/completed/reference-ui-builder-bot/reference-ui-builder-bot.json` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Reference example demonstrating the strongest embedded-UI pattern — floating panel with open/close behavior, checklist workflow with progress bar, init guards preventing duplicate DOM elements, event delegation for dynamic content, theme-safe CSS using `light-dark()`, and slash commands (/checklist, /add, /progress) for panel control. Best example of iframe UI rendering in customCode.
- Known constraints: Panel is appended to document.body which may interact differently across Perchance UI versions. Checklist state is per-thread via customData.
- Next maintenance action (if any): Monitor for DOM API compatibility changes in Perchance runtime.

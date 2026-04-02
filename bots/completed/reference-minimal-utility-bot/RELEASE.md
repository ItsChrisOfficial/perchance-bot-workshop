## Bot

- Name: Reference Minimal Utility Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-minimal-utility-bot/reference-minimal-utility-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js bots/completed/reference-minimal-utility-bot/reference-minimal-utility-bot.json` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Reference example bot demonstrating the simplest high-quality pattern — clean roleInstruction/reminder usage, lightweight slash-command handling via customCode, strong formatting discipline, and minimal safe customCode with init guards. Serves as the ideal starting point for new contributors.
- Known constraints: Minimal customCode by design. Slash commands are informational only (/help) and do not intercept AI generation.
- Next maintenance action (if any): Keep aligned with validator rule updates.

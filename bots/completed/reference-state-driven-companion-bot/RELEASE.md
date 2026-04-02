## Bot

- Name: State-Driven Companion Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-state-driven-companion-bot/reference-state-driven-companion-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Demonstrates persistent thread state management via `oc.thread.customData`, mode switching (casual/focused/creative/supportive), companion level progression, dynamic reminder injection, and conflict-safe namespaced customCode.
- Known constraints: State is per-thread only; mode switching is slash-command driven. Companion level progression is based on interaction count thresholds.
- Next maintenance action (if any): Keep aligned with validator rule updates.

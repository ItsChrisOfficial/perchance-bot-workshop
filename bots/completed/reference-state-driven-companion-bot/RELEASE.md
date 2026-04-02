## Bot

- Name: State-Driven Companion Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-state-driven-companion-bot/reference-state-driven-companion-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js bots/completed/reference-state-driven-companion-bot/reference-state-driven-companion-bot.json` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Reference example demonstrating persistent thread state via `oc.thread.customData`, mood-based state machine with 5 moods, dynamic reminder routing via `MessageAdding`, interaction counting, and slash-command mood switching. Strongest example of state-driven behavior patterns.
- Known constraints: State is per-thread only (lost on thread deletion). Mood transitions are user-initiated via /mood commands; no automatic mood detection from message sentiment.
- Next maintenance action (if any): Keep aligned with validator rule updates.

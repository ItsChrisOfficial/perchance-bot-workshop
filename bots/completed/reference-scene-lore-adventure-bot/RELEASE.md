## Bot

- Name: Scene-and-Lore Adventure Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-scene-lore-adventure-bot/reference-scene-lore-adventure-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js bots/completed/reference-scene-lore-adventure-bot/reference-scene-lore-adventure-bot.json` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Reference example demonstrating narrative progression with a 5-location scene graph, lore discovery system, dynamic reminder injection via `MessageAdding`, turn-based pacing hints, visited-location tracking, and hidden system context for AI scene awareness. Best example of scene/lore progression and structured narrative play.
- Known constraints: Scene graph is embedded in customCode (5 locations). Adding new scenes requires editing customCode directly. Lore discovery is per-thread.
- Next maintenance action (if any): Keep aligned with validator rule updates.

## Bot

- Name: Scene-and-Lore Adventure Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-scene-lore-adventure-bot/reference-scene-lore-adventure-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Narrative adventure bot demonstrating scene progression, lore discovery, inventory and quest tracking, hidden system context injection, dynamic reminder construction from game state, and structured scene data. Uses initial messages (AI greeting + hidden system message) to set the adventure opening.
- Known constraints: Five hardcoded scenes; lore is embedded in customCode scene data. Turn count and scene visits are per-thread state. Image prompt prefix/suffix are set for fantasy-style illustrations.
- Next maintenance action (if any): Keep aligned with validator rule updates.

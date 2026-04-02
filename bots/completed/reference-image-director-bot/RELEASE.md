## Bot

- Name: Image-Oriented Creative Director Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-image-director-bot/reference-image-director-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Image/prompt-centric bot demonstrating runtime imagePromptPrefix/Suffix manipulation via style presets, prompt history tracking, dynamic style switching, and art-direction workflow. Shows how to use customCode to modify image generation parameters dynamically. Six style presets: cinematic, anime, oil_painting, concept_art, watercolor, pixel_art.
- Known constraints: Style presets are hardcoded in customCode; image prompt values are applied via `oc.character.imagePromptPrefix/Suffix` modification at runtime. Prompt history is capped at 30 entries per thread.
- Next maintenance action (if any): Keep aligned with validator rule updates.

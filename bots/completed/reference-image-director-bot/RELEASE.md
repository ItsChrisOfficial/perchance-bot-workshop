## Bot

- Name: Image-Oriented Creative Director Bot
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-image-director-bot/reference-image-director-bot.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js bots/completed/reference-image-director-bot/reference-image-director-bot.json` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Reference example demonstrating image prompt orchestration — 5 style presets (photorealistic, anime, oil painting, concept art, watercolor), runtime imagePromptPrefix/Suffix management, prompt history tracking, negative prompt generation, and dynamic art-direction context via reminder injection. Best example of image-related customCode patterns.
- Known constraints: Style presets are embedded in customCode. Image prompt fields are updated at runtime; initial values match the default photorealistic preset. Prompt history is per-thread.
- Next maintenance action (if any): Keep aligned with validator rule updates and any new image-related Perchance API surfaces.

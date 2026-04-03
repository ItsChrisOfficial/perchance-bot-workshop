# RELEASE TEMPLATE

Use this template inside each completed bot folder as `RELEASE.md`.

## Bot

- Name: Chronicle Foundry v2.0 Final - Compiled Living Expedition Engine
- Lifecycle state: completed
- Export artifact path: `bots/completed/frontier-foundry-final/frontier-foundry-final-v2.0.0.json`
- Release version: v2.0.0
- Release date: 2026-04-03

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Build details

- Build script: `build-final.js`
- Source: Compiled from Phase 3 final (`frontier_foundry_1.3/frontier_foundry_1.3.json`)
- Build chain: Phase 1 (v1.1) → Phase 2 (v1.2) → Phase 3 (v1.3) → Final (v2.0.0)
- CustomCode: 68,046 characters
- File size: 81 KB

## Corrections applied during compilation

- Fixed `imagePromptTriggers` field type from array to string (per `docs/EXPORT_FIELD_REFERENCE.md` §6)
- Updated `customData.PUBLIC.schema_version` to `2.0.0-final`
- Added `source_phases` tracking in `customData.PUBLIC`

## Capabilities (13 systems)

1. Full UI application (7-screen iframe interface)
2. Advanced party/NPC system with traits
3. Relationship dynamics
4. Faction consequences
5. Contract branching
6. Event engine with cooldowns
7. Scene orchestration
8. AI response shaping
9. Image prompt workflow
10. Debug inspection
11. State rollback
12. Action gating
13. Save/restore

## Notes

- Promotion context: Compiled from three progressive phase artifacts into single validated release
- Known constraints: Uses `openai-gpt-4o` model; customCode ~68K chars (well within limits)
- Next maintenance action (if any): None planned

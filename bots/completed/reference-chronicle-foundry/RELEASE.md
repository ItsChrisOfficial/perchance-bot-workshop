## Bot

- Name: Chronicle Foundry: Living Expedition Engine
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-chronicle-foundry/reference-chronicle-foundry.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [x] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Stress-test reference implementation combining persistent narrative orchestration, deterministic seeded world generation, multi-screen iframe operations UI, travel/camp turn simulation, weather and supply pressure, party relationship dynamics, faction consequence propagation, branching contract engine, weighted encounter resolution with cooldowns, hidden context packing, command-safe interception, snapshot rollback, debug inspection tooling, and runtime image prompt shaping.
- Known constraints: No external services are required; all systems run in Perchance customCode constraints. Deterministic seed drives world topology while stochastic event weighting drives ongoing variability. UI is iframe-scoped and designed for Perchance runtime limits.
- Why this is a stress-test reference: It intentionally couples many interdependent subsystems (state, simulation, UI, prompting, events, contracts, factions, save/restore, diagnostics, and image workflow) so contributors can study a full production-style architecture rather than isolated snippets.
- Next maintenance action (if any): Re-validate against future validator/schema updates and keep command/UI affordances aligned with any Perchance runtime API changes.

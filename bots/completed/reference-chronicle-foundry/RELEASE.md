## Bot

- Name: Chronicle Foundry: Living Expedition Engine
- Lifecycle state: completed
- Export artifact path: `bots/completed/reference-chronicle-foundry/reference-chronicle-foundry.json`
- Release version: v1.0.0
- Release date: 2026-04-02

## Verification evidence

- [ ] `node scripts/validate-perchance-export.js <absolute-path-to-export.json>` passed
- [ ] `python -m unittest tests/test-validate-perchance-export.py` passed
- [ ] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied

## Notes

- Promotion context: Pass 1 foundation complete — import-safe export envelope, schema-versioned persistent expedition state, migration/recovery guards, deterministic world seed+region graph generation, resource/party/faction/contract models, event logging, snapshot/restore scaffolding, base command layer, hidden runtime context injection, and safe reset/new-expedition flow.
- Known constraints: Pass 1 iframe is intentionally minimal status shell; full multi-panel application, advanced simulation/event orchestration polish, and image/runtime shaping expansions are scheduled for Pass 2 and Pass 3.
- Next maintenance action (if any): Implement Pass 2 full iframe application shell and deeper simulation wiring, then Pass 3 advanced behavior, hardening, and final catalog/release validation.

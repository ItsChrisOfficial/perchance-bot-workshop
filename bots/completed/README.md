# bots/completed

## Purpose

Store finished bot outputs that are validated and ready for reference or delivery.

## Who should use this folder

- Maintainers publishing finalized bot artifacts
- Contributors referencing known-good completed bots

## Release criteria (must be true before a bot is placed here)

Promotion from `bots/in-progress/` is allowed only when all are true:

- Export satisfies `docs/PERCHANCE_IMPORT_VERIFICATION.md` release gate requirements.
- `node scripts/validate-perchance-export.js <absolute/path/to/export.json>` passes.
- `python -m unittest tests/test-validate-perchance-export.py` passes.
- Bot folder contains a final export artifact with clear versioned naming.
- Validation state is documented in bot notes and reflected in `BOT_CATALOG.md`.
- Lifecycle move and metadata updates are committed together.

## What belongs here

- Completed bot folders and final export artifacts
- Final bot-specific docs/notes with validation evidence and release state
- Release-ready artifacts that passed import-safety checks

## What does not belong here

- Drafts, experiments, or partially working bots
- Generic snippets or shared utilities
- Active iteration notes (keep those in `../in-progress`)
- Temporary scratch files, ad-hoc test exports, or unreviewed alternates
- Any bot lacking documented verification state

## Forbidden in completed bots

- ambiguous artifact names (`final`, `latest`, `new`, `fixed2`)
- unresolved TODO markers for release-critical bot work
- undocumented validator/test status
- mixed lifecycle state inside one bot folder (draft + released artifacts without clear labeling)

## Naming rules

- One folder per bot in kebab-case.
- Keep final export names explicit and versioned.
- Use predictable file naming: `<bot-name>-vMAJOR.MINOR.PATCH.json`.

## Recommended folder structure

```text
bots/completed/<bot-name>/
├── <bot-name>-v1.0.0.json
└── RELEASE.md
```

`RELEASE.md` should include promotion date, validator/test pass state, and any narrow usage notes.

## Versioning rules (completed)

- First completed release should be `v1.0.0` unless project context requires otherwise.
- Use patch increments for compatible fixes (`v1.0.1`), minor for additive compatible updates, major for breaking behavior/contract shifts.
- Keep older released versions only when required for compatibility/reference; otherwise keep a single current release artifact.

## When to use it

- After a bot passes verification and is considered complete
- When preserving a stable completed reference

## How it interacts with the rest of the repo

- Receives promoted work from `bots/in-progress/`
- Should remain aligned with import verification standards in `docs/`
- Bot lifecycle changes must be reflected in `BOT_CATALOG.md`
- Promotion should also update any affected lifecycle README metadata and notes in the same PR

## Common mistakes to avoid

- Treating completed bots as active scratch space
- Storing unfinished exports here
- Omitting catalog updates when adding or replacing completed bots
- Promoting without validator/test confirmation
- Promoting without documenting verification state

## Promotion checklist

- [ ] Final export chosen and clearly versioned
- [ ] Import verification standard applied (`docs/PERCHANCE_IMPORT_VERIFICATION.md`)
- [ ] `node scripts/validate-perchance-export.js <absolute-path>` passed
- [ ] `python -m unittest tests/test-validate-perchance-export.py` passed
- [ ] Scratch/draft artifacts removed from bot folder
- [ ] `BOT_CATALOG.md` updated (state/path/status/verification/notes)
- [ ] Bot notes include release and validation state

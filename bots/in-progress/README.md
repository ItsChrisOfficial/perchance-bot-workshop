# bots/in-progress

## Purpose

Active workspace for bots currently being built, edited, and validated.

## Who should use this folder

- Contributors doing day-to-day bot development
- Agents implementing bot updates before release

## Required bot folder contents (must exist while in progress)

Each bot in this folder must use one folder:

- `bots/in-progress/<bot-name>/`

Inside that folder, keep at minimum:

- one primary export JSON artifact under active development
- a short status note file (`STATUS.md` or `README.md`) with:
  - lifecycle state (`in-progress`)
  - current status (`active`, `blocked`, or `ready-for-promotion-review`)
  - verification state (`not-run`, `in-progress`, `passed`, or `failed`)
  - next action

Keep catalog metadata aligned in `BOT_CATALOG.md` for the same bot row.

## Optional during active work

Allowed while in progress (only if bot-specific and temporary to active work):

- draft notes/checklists tied to the bot
- intermediate validation logs or QA notes
- alternate candidate exports for evaluation

Optional files must stay scoped to the bot folder and be removed or finalized before promotion.

## What does not belong here

- Final approved bots (move those to `../completed`)
- Global shared utilities or snippets
- Canonical templates (use `../templates`)
- Untracked scratch artifacts (for example: random temp files, orphaned drafts, ad-hoc exports with unclear status)
- Files that hide lifecycle state (for example: `final-final.json`, `new2.json`)

## Naming rules

- One folder per bot in kebab-case.
- Use stable names; avoid `temp`/`final` naming patterns.
- Keep export filenames predictable and versioned (see versioning rules below).

## Recommended folder structure

```text
bots/in-progress/<bot-name>/
├── <bot-name>__v0.1.0-draft.json
├── STATUS.md
└── notes/                  (optional, bot-specific)
```

Keep structure small and explicit; one bot folder should not contain unrelated experiments.

## Versioning rules (in-progress)

- Use semantic-style bot artifact versions in filenames when practical:
  - `<bot-name>__vMAJOR.MINOR.PATCH-<stage>.json`
  - example: `travel-guide-bot__v0.3.0-rc1.json`
- Use pre-release stages during active work: `draft`, `alpha`, `beta`, `rcN`.
- Increment version when behavior, structure, or release readiness changes meaningfully.
- Do not use ambiguous suffixes like `final`, `latest`, `new`, `fixed2`.

## When to use it

- After selecting a baseline from `bots/templates/`
- During active editing and import-safety verification

## How it interacts with the rest of the repo

- Starts from template assets in `bots/templates/`
- Uses standards in `docs/PERCHANCE_IMPORT_VERIFICATION.md`
- Can use shared assets from `shared/` and reusable fragments from `snippets/`
- Promotes release-ready bots to `bots/completed/`

## Common mistakes to avoid

- Moving bots to completed before verification is done
- Copying shared helpers into bot folders instead of reusing `shared/`
- Leaving ambiguous draft names that hide lifecycle status
- Failing to maintain verification state in both bot status notes and `BOT_CATALOG.md`
- Leaving scratch files that make release state unclear

## Promotion pre-check (from in-progress)

A bot is eligible for promotion review only when all are true:

- lifecycle status is explicitly marked `ready-for-promotion-review`
- final candidate export is clearly identified
- verification state is documented as `passed` with command evidence
- no stray scratch files remain in the bot folder

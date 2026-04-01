# bots/completed

## Purpose

Store finished bot outputs that are validated and ready for reference or delivery.

## Who should use this folder

- Maintainers publishing finalized bot artifacts
- Contributors referencing known-good completed bots

## What belongs here

- Completed bot folders and exports
- Final bot-specific docs and notes
- Release-ready artifacts that passed import-safety checks

## What does not belong here

- Drafts, experiments, or partially working bots
- Generic snippets or shared utilities
- Active iteration notes (keep those in `../in-progress`)

## Naming rules

- One folder per bot in kebab-case.
- Include version/date suffix only when needed.

## When to use it

- After a bot passes verification and is considered complete
- When preserving a stable completed reference

## How it interacts with the rest of the repo

- Receives promoted work from `bots/in-progress/`
- Should remain aligned with import verification standards in `docs/`
- Bot lifecycle changes must be reflected in `BOT_CATALOG.md`

## Common mistakes to avoid

- Treating completed bots as active scratch space
- Storing unfinished exports here
- Omitting catalog updates when adding or replacing completed bots

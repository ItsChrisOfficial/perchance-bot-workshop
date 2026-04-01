# bots/in-progress

## Purpose

Active workspace for bots currently being built, edited, and validated.

## Who should use this folder

- Contributors doing day-to-day bot development
- Agents implementing bot updates before release

## What belongs here

- Draft bot folders
- Iteration notes tied to active bot work
- Bot-specific validation artifacts that are still in progress

## What does not belong here

- Final approved bots (move those to `../completed`)
- Global shared utilities or snippets
- Canonical templates (use `../templates`)

## Naming rules

- One folder per bot in kebab-case.
- Use stable names; avoid `temp`/`final` naming patterns.

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

# bots/templates

## Purpose

Reusable starter layouts for creating new bots.

## What belongs here

- Bot folder templates
- Starter exports and skeleton docs

## What does not belong here

- Production bot outputs
- In-progress experiments

## Naming rules

- Template folders should be descriptive and kebab-case.
- Keep templates generic and reusable.

## Agent workflow rules

- Start from templates when creating new bots.
- Keep templates minimal and framework-agnostic.
- Update `BOT_CATALOG.md` when new templates are added.

## Standard bot folder template

Each bot folder should include:

- `README.md` - bot purpose and usage
- `bot.export.json` - primary bot export (or equivalent)
- `assets/` - bot-local assets only
- `docs/` - bot-specific notes
- `tests/` - bot-specific validation notes/tests

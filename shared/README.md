# shared

## Purpose

Reusable cross-bot assets used by multiple bots, scripts, or workflows.

## Who should use this folder

- Contributors building more than one bot
- Agents extracting duplicated logic into reusable assets

## What belongs here

- `prompts/` shared prompt assets
- `utilities/` reusable helper modules
- `schemas/` shared data contracts and formats
- Other stable assets intentionally reused across projects

## What does not belong here

- Bot-specific implementation details
- Draft or experimental files tied to one bot
- Small copy/paste snippets better suited to `snippets/`

## When to use it

- When the same logic/content is needed by multiple bots or workflows
- When centralizing shared contracts to avoid drift

## Naming rules

- Use explicit kebab-case names.
- Keep shared APIs stable and documented.

## How it interacts with the rest of the repo

- `bots/` can reference shared prompts/utilities/schemas
- `scripts/` may consume shared helpers for validation/processing
- `docs/` should describe assumptions when shared contracts change

## Common mistakes to avoid

- Placing single-bot files here just because they are convenient
- Duplicating utility functions in bot folders and `scripts/`
- Changing shared contracts without updating dependent docs/workflows

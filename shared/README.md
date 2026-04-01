# shared

## Purpose

Reusable assets consumed across multiple bots and workflows.

## What belongs here

- `prompts/` shared prompt assets
- `utilities/` reusable helper modules
- `schemas/` shared data contracts and formats

## What does not belong here

- Bot-specific implementation details
- Draft or experimental files tied to one bot

## Naming rules

- Use explicit kebab-case names.
- Keep shared APIs stable and documented.

## Agent workflow rules

- Prefer shared assets over copy-paste.
- Avoid duplicate helpers across bot folders.

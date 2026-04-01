# snippets

## Purpose

Small reusable fragments and examples for fast composition during bot and tooling work.

## Who should use this folder

- Contributors who need copy/paste starter fragments
- Agents assembling repeated small patterns quickly

## What belongs here

- Focused code/content fragments
- Example patterns that are intentionally small and composable
- Snippets that are not full shared libraries or complete bots

## What does not belong here

- Full bot projects
- Shared production utilities better placed in `shared/utilities/`
- Canonical standards docs (use `docs/`)

## When to use it

- During implementation when a small reusable fragment is enough
- When capturing repeatable micro-patterns without creating a shared module

## Naming rules

- Use descriptive kebab-case names.
- Keep snippets small and focused.

## How it interacts with the rest of the repo

- Supports work in `bots/`, `scripts/`, and `tools/` as a fragment library
- Complements `shared/`: snippets are lightweight examples, shared assets are stable reusable components
- Requires `SNIPPETS_INDEX.md` updates when snippet inventory changes

## Common mistakes to avoid

- Storing complete project files as snippets
- Treating snippets as durable shared APIs
- Forgetting to update `SNIPPETS_INDEX.md`

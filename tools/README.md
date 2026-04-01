# tools

## Purpose

Helper utilities and tooling resources broader than a one-off script.

## Who should use this folder

- Contributors maintaining local/tooling support for the repo
- Agents working on reusable helper tooling outside single-task scripts

## What belongs here

- Tool configuration references
- Operational helper docs for development tooling
- Reusable local tooling assets that support multiple workflows

## What does not belong here

- Bot project files
- Shared runtime helper code (use `shared/utilities/`)
- Task-specific automation scripts (use `scripts/`)

## When to use it

- When support resources are tooling-oriented and reused across activities
- When the asset is broader than a single automation script

## Naming rules

- Use explicit kebab-case names.
- Keep one concern per file.

## How it interacts with the rest of the repo

- Complements `scripts/` by providing broader tooling support
- Should align with standards in `docs/` and repository rules in root files
- Can support validation and maintenance flows touching `bots/` and `tests/`

## Common mistakes to avoid

- Putting script-like one-off automation here instead of `scripts/`
- Mixing bot runtime artifacts into tooling directories
- Adding tooling complexity without clear operational value

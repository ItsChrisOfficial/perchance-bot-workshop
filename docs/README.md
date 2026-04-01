# docs

## Purpose

Canonical standards and process documentation for Perchance bot development and release safety.

## Who should use this folder

- Contributors implementing or reviewing bot changes
- Agents that modify bot exports or workflow files
- Maintainers defining operational standards

## What belongs here

- Architecture decisions and structure docs
- Verification standards and release-gate checklists
- Repeatable contributor and agent workflows

## What does not belong here

- Bot runtime files
- Generic snippets
- Shared executable helpers

## When to use it

- Before editing Perchance export JSON
- When validating whether a bot is release-ready
- When documenting durable process changes

## Naming rules

- Use concise kebab-case filenames.
- Prefer one focused topic per file.

## How it interacts with the rest of the repo

- Governs bot lifecycle work in `bots/`
- Informs what scripts/tests should validate
- Complements top-level governance in `AGENTS.md`, `PROJECT_RULES.md`, and `.github` instructions

## Key file in this folder

- `PERCHANCE_IMPORT_VERIFICATION.md`: mandatory release gate for import-safe exports.

## Common mistakes to avoid

- Treating standards here as optional guidance
- Documenting workflows that contradict current repository structure
- Keeping outdated process docs after repo changes

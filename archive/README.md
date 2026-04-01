# archive

## Purpose

Historical storage for inactive, deprecated, superseded, or reference-only assets.

## Who should use this folder

- Maintainers preserving history
- Contributors who need old context without affecting active workflow

## What belongs here

- Deprecated bot versions
- Superseded docs kept for history
- Old references not used in active workflow
- Retained artifacts that are intentionally not part of current production flow

## What does not belong here

- Active bot work
- Current standards or instructions
- Shared active utilities
- Files required for current template -> in-progress -> completed pipeline

## When to use it

- When replacing active assets and keeping an audit trail
- When retiring bots or materials that should not drive new work

## How it interacts with the rest of the repo

- Receives material from active areas when those assets are retired
- Must not be treated as the default source for new bot work
- Current standards remain in `docs/`, `AGENTS.md`, and `.github` instructions

## Naming rules

- Prefix items with date when helpful (`yyyy-mm-name`).
- Use kebab-case names.

## Common mistakes to avoid

- Reviving archived files as active defaults without explicit review
- Moving active or unfinished work here prematurely
- Storing reusable shared assets here instead of `shared/`

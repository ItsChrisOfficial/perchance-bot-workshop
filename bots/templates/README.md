# bots/templates

## Purpose

Canonical starter assets for new Perchance bot builds, including import-safe export templates.

## Who should use this folder

- Contributors starting a new bot
- Agents generating a new bot export baseline

## What belongs here

- Starter export JSON templates
- Reusable bot scaffolding intended for new builds
- Template-level README guidance for bot creation

## What does not belong here

- Active bot iterations (use `bots/in-progress/`)
- Finalized delivery bots (use `bots/completed/`)
- One-off experimental drafts

## When to use it

- At bot kickoff, before any custom behavior is implemented
- When you need a known-good export envelope baseline

## How it interacts with the rest of the repo

- Feeds new work into `bots/in-progress/`
- Must align with `docs/PERCHANCE_IMPORT_VERIFICATION.md`
- Template and lifecycle changes must be reflected in `BOT_CATALOG.md`

## Templates in this repo

- `perchance-empty-minimal.json` is the default production-safe baseline for new bot builds.
- `perchance-empty-annotated.json` is the teaching/reference variant with schema guidance labeled as non-runtime notes.
- `perchance_empty_customcode_template.json` is retained as a legacy baseline reference.

## Default selection guidance

- Use `perchance-empty-minimal.json` by default when starting new bot exports.
- Use `perchance-empty-annotated.json` only when you need embedded schema/runtime guidance during authoring or onboarding.

## Naming rules

- Template folders should be descriptive and kebab-case.
- Keep templates generic and reusable.

## Common mistakes to avoid

- Replacing the canonical Perchance export envelope with a bare character object
- Treating templates as active working bot folders
- Embedding project-specific temporary logic into templates

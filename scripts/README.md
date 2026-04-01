# scripts

## Purpose

Automation for repeatable repository tasks such as validation, transformation, export handling, and maintenance.

## Who should use this folder

- Maintainers and contributors running repeatable project tasks
- Agents implementing or invoking deterministic repo automation

## What belongs here

- Validation scripts
- Build/transform helpers
- Repo maintenance scripts
- Scripted checks tied to repository workflows

## What does not belong here

- One-off local experiments
- Shared library code better suited for `shared/utilities/`
- Long-form policy documentation (use `docs/`)

## When to use it

- When a task is repeatable and should be automated instead of done manually
- When validation/transformation logic needs to be run consistently

## How it interacts with the rest of the repo

- Supports `bots/` workflows by automating checks and transformations
- May consume reusable logic from `shared/`
- Should be reflected in docs when scripts become workflow-critical

## Perchance export validator

- Script: `scripts/validate-perchance-export.js`
- Validates a Perchance export JSON against repository import-safety requirements.
- Fails with actionable errors and non-zero exit code when checks fail.

### Local usage

- Validate one export file:
  - `node /home/runner/work/perchance-bot-workshop/perchance-bot-workshop/scripts/validate-perchance-export.js /absolute/path/to/export.json`
- Validate canonical fixture in this repo:
  - `node /home/runner/work/perchance-bot-workshop/perchance-bot-workshop/scripts/validate-perchance-export.js /home/runner/work/perchance-bot-workshop/perchance-bot-workshop/tests/fixtures/valid/canonical-valid.json`

## Naming rules

- Use explicit kebab-case script names.
- Name scripts by action (e.g., `validate-...`, `build-...`).

## Common mistakes to avoid

- Creating duplicate helper logic that should live in `shared/`
- Keeping undocumented assumptions in script behavior
- Adding one-off throwaway scripts to version control

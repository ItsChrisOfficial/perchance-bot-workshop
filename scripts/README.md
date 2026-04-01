# scripts

## Purpose

Automation scripts for repeatable repository tasks.

## What belongs here

- Validation scripts
- Build/transform helpers
- Repo maintenance scripts

## What does not belong here

- One-off local experiments
- Shared library code better suited for `shared/utilities/`

## Naming rules

- Use explicit kebab-case script names.
- Name scripts by action (e.g., `validate-...`, `build-...`).

## Agent workflow rules

- Reuse existing scripts before creating new ones.
- Keep scripts deterministic and documented.

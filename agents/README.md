# agents

## Purpose

Agent-facing operational guidance for working safely in this repository.

## Who should use this folder

- Copilot/task agents operating in this repo
- Maintainers writing or updating agent workflow notes

## What belongs here

- Agent workflow guidance
- Agent-specific checklists
- Notes that clarify how agents should interact with repo standards

## What does not belong here

- Bot source/export files
- Reusable snippets (use `snippets/`)
- Shared runtime assets (use `shared/`)
- Canonical standards docs (use `docs/`)

## When to use it

- When documenting how agents should execute tasks in this project
- When clarifying guardrails that complement `AGENTS.md` and `.github` instructions

## How it interacts with the rest of the repo

- References root governance files (`AGENTS.md`, `PROJECT_RULES.md`, `REPO_MAP.md`)
- Should align with `.github/copilot-instructions.md`
- Should never replace canonical import verification rules in `docs/`

## Naming rules

- Use kebab-case file and folder names.
- Keep documents short and task-oriented.

## Common mistakes to avoid

- Adding active bot artifacts here
- Duplicating instruction text that already exists in canonical docs
- Writing agent notes that conflict with import verification standards

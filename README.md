# perchance-bot-workshop

Structured workspace for building and maintaining **Perchance Advanced AI Character Chat** bots as import-safe JSON artifacts.

## Mission

Produce bot exports that are:
- importable
- validated
- organized by lifecycle

## Start here

Read in this order:
1. `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory** when touching export JSON or `customCode`)
2. `PROJECT_RULES.md` (hard placement and structure rules)
3. `CONTRIBUTING.md` (human workflow and PR expectations)
4. `REPO_MAP.md` (current folder map)
5. `AGENTS.md` (automation/agent execution rules)

## Core workflow

1. Start from `bots/templates/`.
2. Build in `bots/in-progress/<bot-name>/`.
3. Validate against `docs/PERCHANCE_IMPORT_VERIFICATION.md`.
4. Run validator/tests.
5. Promote to `bots/completed/<bot-name>/` only when release-ready.
6. Update indexes (`REPO_MAP.md`, `BOT_CATALOG.md`, and `SNIPPETS_INDEX.md` when relevant).

## Validation commands

- `node scripts/validate-perchance-export.js /absolute/path/to/export.json`
- `python -m unittest tests/test-validate-perchance-export.py`

## Quick guardrails

- Do not ship bare character JSON; keep full export envelope.
- Do not put active work directly in `bots/completed/`.
- Do not add workspace files to repo root.

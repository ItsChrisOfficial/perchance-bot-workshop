# GitHub Copilot Instructions

This repository is organized for predictable, low-friction collaboration between humans and AI agents.

## Core rules

- Make minimal, focused diffs.
- Preserve existing structure unless intentionally refactoring.
- Do not place new work in the repository root.
- Use explicit names; avoid vague names like `misc`, `temp`, or `final-final`.
- Prefer reusable code in `shared/` over copy-paste.
- Explain assumptions in docs, not code comments.
- When adding major files/folders, update:
  - `REPO_MAP.md`
  - `BOT_CATALOG.md` (for bots)
  - `SNIPPETS_INDEX.md` (for snippets)
  - relevant subtree `README.md`

## Placement rules

- Finished bots: `bots/completed/`
- Active bot work: `bots/in-progress/`
- Reusable bot starters: `bots/templates/`
- Shared prompts/utilities/schemas: `shared/`
- Reusable code snippets: `snippets/`
- Operational docs and standards: `docs/`
- Automation/tooling scripts: `scripts/`
- General tooling config/helpers: `tools/`
- Historical retired content: `archive/`

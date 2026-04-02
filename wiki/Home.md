# Perchance Bot Workshop Wiki

Welcome to the **Perchance Bot Workshop** — a structured workspace for building and maintaining **Perchance Advanced AI Character Chat** bots as import-safe JSON artifacts.

## Mission

Produce bot exports that are:

- **Importable** — every export uses the correct Perchance envelope structure
- **Validated** — automated checks enforce structural and behavioral correctness
- **Organized** — bots follow a clear lifecycle from template → in-progress → completed

## Quick Navigation

| Page | Description |
|---|---|
| [Getting Started](Getting-Started.md) | First-time setup, prerequisites, and onboarding |
| [Repository Structure](Repository-Structure.md) | Directory map and workspace descriptions |
| [Bot Lifecycle](Bot-Lifecycle.md) | Templates → in-progress → completed workflow |
| [Perchance Export Format](Perchance-Export-Format.md) | Export envelope, canonical tables, and data contracts |
| [Custom Code Guide](Custom-Code-Guide.md) | Writing and serializing `customCode` safely |
| [Validation and Testing](Validation-and-Testing.md) | Validator scripts, test fixtures, and CI |
| [Contributing](Contributing.md) | Contribution workflow, PR checklist, and conventions |
| [FAQ](FAQ.md) | Common questions and troubleshooting |

## Core Workflow at a Glance

```text
1. Start from a template       →  bots/templates/
2. Build in progress folder    →  bots/in-progress/<bot-name>/
3. Validate the export         →  scripts + tests
4. Promote when release-ready  →  bots/completed/<bot-name>/
5. Update indexes              →  REPO_MAP.md, BOT_CATALOG.md
```

## Key Files

| File | Purpose |
|---|---|
| `README.md` | Repo entry point and workflow overview |
| `PROJECT_RULES.md` | Hard placement and structure rules |
| `CONTRIBUTING.md` | Human contribution workflow |
| `AGENTS.md` | Agent/automation behavior contract |
| `REPO_MAP.md` | Current folder map |
| `BOT_CATALOG.md` | Operational bot inventory |
| `SNIPPETS_INDEX.md` | Reusable snippet inventory |
| `docs/PERCHANCE_IMPORT_VERIFICATION.md` | **Mandatory** import verification standard |

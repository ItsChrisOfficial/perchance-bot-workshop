# Repository Structure

This page describes every top-level workspace and its purpose.

## Directory Map

```text
perchance-bot-workshop/
├── .github/              # GitHub config, PR templates, CI workflows, Copilot instructions
├── agents/               # Agent workspace guidance
├── archive/              # Retired historical assets
├── bots/                 # Bot lifecycle workspaces
│   ├── templates/        #   Starter export templates
│   ├── in-progress/      #   Active bot development
│   └── completed/        #   Release-ready validated bots
├── docs/                 # Standards and verification docs
│   └── Code_Documentation/  # Perchance platform reference docs (legacy name)
├── scripts/              # Automation scripts (validation, transforms)
├── shared/               # Shared prompts, utilities, schemas
├── snippets/             # Small reusable fragments and examples
├── tests/                # Validator tests and fixtures
│   └── fixtures/         #   Valid and invalid test cases
├── tools/                # Tooling notes and support resources
└── wiki/                 # This wiki
```

## Root Governance Files

| File | Purpose |
|---|---|
| `README.md` | Mission statement and entry workflow |
| `PROJECT_RULES.md` | Hard placement and structure rules |
| `CONTRIBUTING.md` | Human contribution workflow and PR checklist |
| `AGENTS.md` | Agent/automation behavior contract |
| `REPO_MAP.md` | Current folder map (keep updated) |
| `BOT_CATALOG.md` | Operational bot inventory by lifecycle state |
| `SNIPPETS_INDEX.md` | Reusable snippet inventory |

## Workspace Details

### `bots/`

The core workspace organized by lifecycle stage:

- **`templates/`** — Canonical starter assets. Contains import-safe export envelopes. Use `perchance-empty-minimal.json` by default for new builds.
- **`in-progress/`** — Active development. One folder per bot in kebab-case. Must not be treated as released.
- **`completed/`** — Release-ready bots only. Promotion requires documented verification. Each bot folder should contain a versioned export JSON and a `RELEASE.md`.

### `docs/`

Standards and process documentation:

- `PERCHANCE_IMPORT_VERIFICATION.md` — **Mandatory release gate** for any export JSON work. Defines the export envelope contract, canonical tables, and verification checklist.
- `Code_Documentation/` — Reference documentation for Perchance platform features (custom code, messages, styling, plugins, etc.).

### `scripts/`

Repeatable automation:

- `validate-perchance-export.js` — Validates a Perchance export JSON against import-safety requirements. Fails with actionable errors and non-zero exit code.

### `shared/`

Cross-bot reusable assets organized into:

- `prompts/` — shared prompt assets
- `utilities/` — reusable helper modules
- `schemas/` — shared data contracts and formats

### `snippets/`

Small reusable fragments for fast composition. Indexed in `SNIPPETS_INDEX.md`. Categories include: `export-envelope`, `custom-code-ui`, `validation`, `json-serialization`, `message-objects`, `shortcut-buttons`, `workflow-docs`.

### `tests/`

Verification assets:

- `test-validate-perchance-export.py` — Python unittest suite for the export validator
- `fixtures/valid/` — Known-good test exports
- `fixtures/invalid/` — Intentionally broken exports for failure testing

### `tools/`

Helper utilities and tooling resources broader than one-off scripts.

### `archive/`

Historical storage for inactive, deprecated, or superseded assets. Not a source for new work.

## Naming Conventions

- **Folders and files:** kebab-case (e.g., `my-bot-name`, `validate-perchance-export.js`)
- **Bot exports:** `<bot-name>-vMAJOR.MINOR.PATCH.json`
- **Governance files:** UPPER_CASE with underscores (e.g., `PROJECT_RULES.md`)

## Index Update Requirements

When making structural changes, update these files in the same PR:

| Change | Update |
|---|---|
| Top-level folder added/removed | `REPO_MAP.md` |
| Bot added/moved/retired | `BOT_CATALOG.md` |
| Snippet added/moved/removed | `SNIPPETS_INDEX.md` |
| Folder purpose changed | Affected subtree `README.md` |

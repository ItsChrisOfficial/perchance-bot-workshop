# Getting Started

This guide walks you through setting up your environment and creating your first Perchance bot export.

## Prerequisites

- **Node.js** — required to run the export validator (`scripts/validate-perchance-export.js`)
- **Python 3** — required to run validation tests (`tests/test-validate-perchance-export.py`)
- **Git** — for cloning and contributing to the repository
- A text editor or IDE with JSON support

## Required Reading

Before making any changes, read these documents in order:

1. [`docs/PERCHANCE_IMPORT_VERIFICATION.md`](../docs/PERCHANCE_IMPORT_VERIFICATION.md) — **mandatory** when touching export JSON or `customCode`
2. [`PROJECT_RULES.md`](../PROJECT_RULES.md) — hard placement and structure rules
3. [`CONTRIBUTING.md`](../CONTRIBUTING.md) — human workflow and PR expectations
4. [`REPO_MAP.md`](../REPO_MAP.md) — current folder map
5. [`AGENTS.md`](../AGENTS.md) — automation/agent execution rules

## Your First Bot: Step by Step

### 1. Clone the repository

```bash
git clone https://github.com/ItsChrisOfficial/perchance-bot-workshop.git
cd perchance-bot-workshop
```

### 2. Choose a starter template

The repository provides starter templates in `bots/templates/`:

| Template | When to Use |
|---|---|
| `perchance-empty-minimal.json` | **Default** — use this for new bot builds |
| `perchance-empty-annotated.json` | When you need embedded schema guidance during authoring |
| `perchance_empty_customcode_template.json` | Legacy baseline (retained for backward compatibility) |

### 3. Create your bot workspace

```bash
mkdir bots/in-progress/my-bot-name
cp bots/templates/perchance-empty-minimal.json bots/in-progress/my-bot-name/my-bot-name-v0.1.0.json
```

Use **kebab-case** for folder and file names.

### 4. Edit your bot

Open the copied JSON file and modify the character row inside `data.data[0].rows[0]`. Key fields to customize:

- `name` — your bot's display name
- `roleInstruction` — the core behavior prompt
- `reminderMessage` — recurring context reminder
- `customCode` — runtime JavaScript (see [Custom Code Guide](Custom-Code-Guide.md))
- `initialMessages` — seeded conversation starters
- `shortcutButtons` — quick-action buttons

> **Important:** Only modify row content. Do not change the export envelope structure unless explicitly required.

### 5. Validate your export

```bash
node scripts/validate-perchance-export.js "$(pwd)/bots/in-progress/my-bot-name/my-bot-name-v0.1.0.json"
```

Run the test suite:

```bash
python -m unittest tests/test-validate-perchance-export.py
```

Both must pass before promotion.

### 6. Promote to completed (when ready)

See the full [Bot Lifecycle](Bot-Lifecycle.md) guide for promotion requirements.

## What's Next

- Learn the [Repository Structure](Repository-Structure.md)
- Understand the [Perchance Export Format](Perchance-Export-Format.md)
- Read the [Contributing](Contributing.md) guide before opening a PR

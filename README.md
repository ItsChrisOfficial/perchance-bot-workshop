# 🤖 Perchance Bot Workshop

A structured repository for creating, testing, and maintaining **Perchance Advanced AI Character Chat** bot exports using GitHub Copilot agents.

## Repository Structure

```
├── .github/
│   ├── copilot-instructions.md        # Copilot agent mandatory instructions
│   ├── ISSUE_TEMPLATE/                # Issue templates for bot requests
│   │   ├── new-bot-request.md
│   │   ├── bot-bug-report.md
│   │   └── bot-feature-request.md
│   └── PULL_REQUEST_TEMPLATE.md       # PR checklist enforcing import safety
├── docs/
│   ├── PERCHANCE_IMPORT_VERIFICATION.md  # Import verification standard (release gate)
│   ├── PERCHANCE_CUSTOM_CODE_GUIDE.md    # Guide for writing customCode
│   └── CONTRIBUTING.md                   # Contribution guidelines
├── templates/
│   ├── perchance_empty_customcode_template.json  # Empty bot export template
│   └── perchance_starter_bot_template.json       # Starter bot with example content
├── snippets/
│   ├── README.md                      # Index of available snippets
│   ├── custom-code/                   # Reusable customCode JavaScript snippets
│   │   ├── message-event-handler.js
│   │   ├── dynamic-shortcut-buttons.js
│   │   ├── window-ui-panel.js
│   │   └── message-rendering-pipeline.js
│   └── role-instructions/             # Reusable roleInstruction fragments
│       ├── personality-templates.md
│       └── formatting-instructions.md
├── bots/
│   ├── completed/                     # Finished, verified, importable bot exports
│   │   └── .gitkeep
│   └── in-progress/                   # Work-in-progress bot exports (drafts)
│       └── .gitkeep
├── scripts/
│   ├── validate-export.js             # Export validation script
│   └── build-export.js                # Build helper: JS source → serialized export
└── .gitignore
```

## Quick Start

### Creating a New Bot

1. Copy `templates/perchance_empty_customcode_template.json` as your starting point.
2. Modify character row content (name, roleInstruction, initialMessages, etc.).
3. Write `customCode` as normal JavaScript in a separate `.js` file if needed.
4. Use `scripts/build-export.js` to serialize the final export.
5. Validate with `scripts/validate-export.js`.
6. Place the finished export in `bots/completed/`.

### Using Copilot Agents

This repo is configured so that GitHub Copilot agents automatically follow the Perchance import verification standard. When asking Copilot to create or modify a bot:

- It will start from a known-good template
- It will produce a **fully importable** Perchance export JSON
- It will validate structural integrity before finishing
- It will never output partial snippets as a "finished" bot

See `.github/copilot-instructions.md` for the full agent instruction set.

## Key Principles

1. **Import safety over everything** — A bot isn't done until it imports correctly.
2. **Start from templates** — Never invent export envelopes from scratch.
3. **Serialize programmatically** — Never hand-escape `customCode` into JSON.
4. **Validate before shipping** — Run the verification checklist on every export.

## Documentation

- [Import Verification Standard](docs/PERCHANCE_IMPORT_VERIFICATION.md) — The release gate for all exports.
- [Custom Code Guide](docs/PERCHANCE_CUSTOM_CODE_GUIDE.md) — How to write safe `customCode`.
- [Contributing](docs/CONTRIBUTING.md) — How to contribute bots and snippets.

## License

See [LICENSE](LICENSE) for details.
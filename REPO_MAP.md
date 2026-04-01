# Repository Map

## Top-level

- `.github/` - Copilot and path-scoped agent instructions
- `agents/` - Agent workspace guidance
- `archive/` - Archived/retired assets
- `bots/` - Bot lifecycle workspaces
- `docs/` - Architecture, standards, and workflow docs
- `scripts/` - Automation scripts
- `shared/` - Shared prompts, utilities, and schemas
- `snippets/` - Reusable snippets by category/language
- `tests/` - Test assets and test-specific docs
- `tools/` - Tooling notes and support files

## Notable validation assets

- `scripts/validate-perchance-export.js` - canonical Perchance export validator
- `tests/test-validate-perchance-export.py` - validator test suite
- `tests/fixtures/valid/canonical-valid.json` - known-good canonical fixture
- `tests/fixtures/invalid/` - intentionally broken fixtures for negative validation cases
- `.github/workflows/ci.yml` - CI workflow that runs validator checks and tests on push/PR

## Index files

- `BOT_CATALOG.md` - catalog of bot assets
- `SNIPPETS_INDEX.md` - catalog of snippet assets
- `PROJECT_RULES.md` - operational repo rules
- `AGENTS.md` - repository instructions for coding agents

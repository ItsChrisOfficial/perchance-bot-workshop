# REPO_MAP

Current repository layout and quick reference.

## Top-level map

- `.github/` - Copilot and path-scoped instructions
- `agents/` - agent workspace guidance
- `archive/` - retired historical assets
- `bots/` - bot lifecycle workspaces (`templates`, `in-progress`, `completed`)
- `docs/` - standards and verification docs
- `scripts/` - automation scripts
- `shared/` - shared prompts/utilities/schemas
- `snippets/` - reusable snippets
- `tests/` - validator tests and fixtures
- `tools/` - tooling notes/support

## Validation quick reference

- Standard: `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory** for export JSON/`customCode` changes)
- Validator: `scripts/validate-perchance-export.js`
- Validator tests: `tests/test-validate-perchance-export.py`
- CI: `.github/workflows/ci.yml`

## Governance quick reference

- `README.md` - mission and entry workflow
- `AGENTS.md` - agent/automation behavior contract
- `PROJECT_RULES.md` - hard placement/convention rules
- `CONTRIBUTING.md` - human contribution workflow and PR checklist

## Keep this file current

Update this file whenever top-level structure changes or when major folders/files are added, moved, or retired.

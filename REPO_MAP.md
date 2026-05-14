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
- `wiki/` - repository wiki pages (Home, Getting Started, Bot Lifecycle, Export Format, etc.)

## Notable workflow templates

- `.github/pull_request_template.md` - repository PR checklist template aligned with contribution/release gates
- `bots/completed/RELEASE_TEMPLATE.md` - completed-bot release note/checklist template to copy as per-bot `RELEASE.md`

## Validation quick reference

- Standard: `docs/PERCHANCE_IMPORT_VERIFICATION.md` (**mandatory** for export JSON/`customCode` changes)
- Validator: `scripts/validate-perchance-export.js`
- Validator tests: `tests/test-validate-perchance-export.py`
- CI: `.github/workflows/ci.yml`
- Wiki sync: `.github/workflows/sync-wiki.yml` (pushes `wiki/` contents to GitHub Wiki on main-branch changes)

## Reference docs in `docs/`

- `docs/PERCHANCE_IMPORT_VERIFICATION.md` - mandatory import/export verification standard
- `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` - decision table: what is possible in customCode
- `docs/SNIPPET_SELECTION_GUIDE.md` - task-to-snippet mapping (30 scenarios)
- `docs/COMMON_FAILURE_MODES.md` - failure diagnosis and prevention (33 failure modes)
- `docs/EXPORT_FIELD_REFERENCE.md` - fast field lookup for export JSON structure
- `docs/CUSTOM_CODE_IMPLEMENTATION_CHECKLIST.md` - operational merge gate checklist
- `docs/BOT_DESIGN_BRIEF_TEMPLATE.md` - bot planning template with worked example
- `docs/REUSABLE_PATTERN_RECIPES.md` - snippet composition recipes (12 patterns)
- `docs/PROMPTING_PATTERNS.md` - prompt engineering patterns for customCode (22 patterns)
- `docs/STYLING_RECIPES.md` - CSS recipes for messages, panels, and UI (22 recipes)
- `docs/PYODIDE_COMPATIBILITY_NOTES.md` - Pyodide feasibility and constraints
- `docs/ISSUE_INTAKE_TEMPLATES.md` - issue templates for bugs, snippets, bots, docs, and repo improvements
- `docs/Code_Documentation/` - Perchance platform reference docs (custom code, messages, styling, Pyodide, etc.)

## GitHub configuration

- `.github/CODEOWNERS` - ownership assignments for repo areas
- `.github/copilot-instructions.md` - Copilot agent instructions
- `.github/instructions/` - path-scoped agent instructions (bots, docs, repo)
- `.github/pull_request_template.md` - PR checklist template
- `.github/workflows/ci.yml` - CI pipeline
- `.github/workflows/sync-wiki.yml` - wiki sync from `wiki/` to GitHub Wiki

## Governance quick reference

- `README.md` - mission and entry workflow
- `AGENTS.md` - agent/automation behavior contract
- `PROJECT_RULES.md` - hard placement/convention rules
- `CONTRIBUTING.md` - human contribution workflow and PR checklist

## In-progress bots (notable)

- `bots/in-progress/nsfw-dating-sim/` - Adult NSFW hentai dating sim RPG; 4 files: customCode.js, shortcut-buttons.txt, BRIEF.md, nsfw-dating-sim.export.json

## Keep this file current

Update this file whenever top-level structure changes or when major folders/files are added, moved, or retired.

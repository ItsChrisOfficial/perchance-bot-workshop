# Validation and Testing

This repository enforces import safety through automated validation. Every export must pass these checks before it is considered finished.

## Validation Commands

### Export validator

Validates a single Perchance export JSON against import-safety requirements:

```bash
node scripts/validate-perchance-export.js /absolute/path/to/export.json
```

- Fails with **actionable error messages** describing what's wrong and how to fix it
- Returns **non-zero exit code** on failure
- Must be run with an **absolute path** to the export file

### Validation test suite

Runs the Python unittest suite that exercises the validator against known-good and known-bad fixtures:

```bash
python -m unittest tests/test-validate-perchance-export.py
```

### Both commands must pass

No bot can be promoted to `completed` unless **both** commands succeed.

## What the Validator Checks

The export validator (`scripts/validate-perchance-export.js`) performs these checks:

### A. JSON structure

- File parses as valid JSON
- Root has `formatName`, `formatVersion`, and `data`
- `formatName === "dexie"`
- `formatVersion === 1`
- `data.databaseName === "chatbot-ui-v1"`
- `data.databaseVersion === 90`
- `data.tables` is an array
- `data.data` is an array

### B. Table integrity

- All 9 canonical tables are present
- Every table has a matching `data.data` entry
- Every `rows` value is an array
- Every `rowCount` matches `rows.length`

### C. Character integrity

- `characters` table contains the expected character rows
- `name` exists and is a string
- `roleInstruction` exists and is a string
- `customCode` exists and is a string
- `initialMessages` is an array
- `shortcutButtons` is an array

### D. Message integrity

- Every seeded message has string `content`
- Every seeded message has valid `author` (`"user"`, `"ai"`, or `"system"`)
- Every `hiddenFrom` is an array if present
- Every `expectsReply` is boolean or omitted

### E. Shortcut integrity

- Every shortcut is an object
- `name` is a string
- `message` is a string
- `insertionType` is `"replace"`, `"prepend"`, or `"append"`
- `autoSend` and `clearAfterSend` are booleans

### F. Custom code integrity

- `customCode` is a string type
- Extracted `customCode` passes JavaScript syntax validation

## Test Fixtures

The test suite uses fixtures in `tests/fixtures/`:

### Valid fixtures (`tests/fixtures/valid/`)

- `canonical-valid.json` — a known-good minimal export

### Invalid fixtures (`tests/fixtures/invalid/`)

Each fixture is intentionally broken for one specific reason:

| Fixture file | What it tests |
|---|---|
| `broken-json.json` | JSON parse failure |
| `missing-table.json` | Incomplete canonical table set |
| `rowcount-mismatch.json` | `rowCount` / `rows.length` inconsistency |
| `invalid-message-author.json` | Invalid `author` enum value in seeded message |
| `invalid-shortcut-insertion-type.json` | Invalid `insertionType` enum value in shortcut button |
| `malformed-customcode.json` | JavaScript syntax failure in `customCode` |
| `customcode-not-string.json` | `customCode` stored as non-string type |

## CI Integration

The repository includes a CI workflow at `.github/workflows/ci.yml` that runs validation checks automatically on pushes and pull requests.

## Validation Workflow

### During development

Run the validator frequently as you build your bot:

```bash
# Validate your export
node scripts/validate-perchance-export.js "$(pwd)/bots/in-progress/my-bot/my-bot-v0.1.0.json"
```

### Before promotion

Run the full validation suite:

```bash
# 1. Validate the specific export
node scripts/validate-perchance-export.js "$(pwd)/bots/in-progress/my-bot/my-bot-v1.0.0.json"

# 2. Run the test suite
python -m unittest tests/test-validate-perchance-export.py

# 3. Apply the PERCHANCE_IMPORT_VERIFICATION.md checklist manually
```

### After promotion

Document validation evidence in the bot's `RELEASE.md`:

```markdown
## Verification evidence

- [x] `node scripts/validate-perchance-export.js <path>` passed
- [x] `python -m unittest tests/test-validate-perchance-export.py` passed
- [x] `docs/PERCHANCE_IMPORT_VERIFICATION.md` checklist applied
```

## Troubleshooting Validation Failures

| Error | Likely cause | Fix |
|---|---|---|
| JSON parse error | Malformed JSON (trailing commas, unescaped chars) | Use a JSON linter/formatter |
| Missing table | Not all 9 canonical tables included | Start from a template that includes all tables |
| rowCount mismatch | Added/removed rows without updating table metadata | Ensure `rowCount` matches `rows.length` |
| Invalid author | Message uses author other than `user`/`ai`/`system` | Fix the `author` field |
| Invalid insertionType | Button uses type other than `replace`/`prepend`/`append` | Fix the `insertionType` field |
| customCode not a string | `customCode` stored as object, number, or null | Ensure it's a string value |
| JS syntax error | `customCode` has unterminated string, missing bracket, etc. | Syntax-check your JavaScript separately |

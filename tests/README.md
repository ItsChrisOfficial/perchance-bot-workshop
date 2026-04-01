# tests

## Purpose

Verification assets for checking repository workflows and output correctness.

## Who should use this folder

- Contributors validating bot-export quality
- Maintainers defining repeatable checks for repository workflows
- Agents implementing or updating test logic/fixtures

## What belongs here

- Integration or validation test files
- Test fixtures and test documentation
- Checks that support import-safety and workflow correctness

## Perchance export validation tests

- Test file: `tests/test-validate-perchance-export.py`
- Fixture roots:
  - `tests/fixtures/valid/`
  - `tests/fixtures/invalid/`

### Covered fixture cases

- valid canonical export
- broken JSON
- missing canonical table
- rowCount mismatch
- invalid seeded message author
- invalid shortcut insertionType
- malformed customCode JavaScript

### Local usage

- Run validation tests:
  - `python -m unittest /home/runner/work/perchance-bot-workshop/perchance-bot-workshop/tests/test-validate-perchance-export.py`

## What does not belong here

- Production bot exports
- Shared runtime utilities
- Ad hoc experiments not tied to a repeatable check

## When to use it

- When adding or updating automated/manual checks for repo workflows
- When creating fixtures for validation of export structure or related behavior

## Naming rules

- Use clear test-oriented names.
- Mirror target area names where practical.

## How it interacts with the rest of the repo

- Verifies outcomes from work in `bots/`, `scripts/`, and `tools/`
- Should align with release standards in `docs/PERCHANCE_IMPORT_VERIFICATION.md`
- May rely on fixtures derived from templates or completed examples

## Common mistakes to avoid

- Treating tests as optional when changing validation-sensitive workflows
- Keeping fixtures without documenting what they verify
- Placing production artifacts in test directories

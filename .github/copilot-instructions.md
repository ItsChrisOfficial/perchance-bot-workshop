# GitHub Copilot Repository Instructions

These instructions are mandatory for any task that creates, edits, patches, reviews, or exports a **Perchance Advanced AI Character Chat** bot JSON in this repository.

## Required reading before work starts

Before making changes to any Perchance export JSON or any source that will be compiled into one, read:

- `docs/PERCHANCE_IMPORT_VERIFICATION.md`

Do not treat that file as optional background material. It is the release standard.

## Primary rule

When a task involves a Perchance bot export, your job is not finished when the prose, UI plan, or JavaScript looks correct.

Your job is finished only when the final output is a **fully importable Perchance export JSON** that satisfies the verification document.

## Hard requirements

### 1. Preserve the Perchance export envelope

Unless the user explicitly requests a different export strategy, preserve the known-good import structure:

- root export envelope
- canonical table list
- matching `rowCount` values
- `data.data` entries for each table

Do not replace a valid export envelope with a bare character object.

### 2. Always produce a finished artifact

If the user asks for a finished bot/export, do not stop at:

- pseudocode
- partial snippets
- patch fragments
- commentary describing what should be changed
- a character object without the export envelope

Return the finished export file content or modify the repository files so the finished export exists.

### 3. Treat import safety as a release gate

Before considering work complete, verify at minimum:

- the JSON parses
- the export envelope matches the repository baseline
- all required tables exist
- `rowCount` values match actual row lengths
- the character row is present and complete
- `initialMessages` is an array
- `shortcutButtons` is an array
- `customCode` is a string
- extracted `customCode` is valid JavaScript after serialization

If any check fails, fix the export before finishing.

### 4. Never handwave `customCode`

`customCode` must survive two parsers:

- JSON parsing
- JavaScript parsing

Write JavaScript normally first, then serialize the whole export object programmatically whenever possible.

Do **not** rely on hand-escaped giant JSON strings if avoidable.

### 5. Preserve object contracts

For seeded messages, only use valid message objects.

At minimum:

- `content` must be a string
- `author` must be `"user"`, `"ai"`, or `"system"`
- `hiddenFrom` must be an array if present
- `expectsReply` must be boolean or omitted

For shortcut buttons:

- use object entries
- keep `name`, `message`, `insertionType`, `autoSend`, and `clearAfterSend` well-formed
- only use `replace`, `prepend`, or `append` for `insertionType`

### 6. Do not casually alter baseline compatibility values

Do not change these unless the task explicitly requires it and compatibility has been re-verified:

- `formatName`
- `formatVersion`
- `databaseName`
- `databaseVersion`
- canonical table names
- canonical table schemas

### 7. Single-bot tasks should stay single-bot

If the user asks for one finished importable bot JSON, keep the export to one character row unless they explicitly request multiple bots.

### 8. Preserve runtime behavior unless asked to change it

When patching an existing export:

- preserve working structures
- preserve known-good envelope and table layout
- preserve unrelated working features
- change only what the user asked to change, plus whatever is required to keep the export valid and importable

## Output discipline

When a user asks for the final export:

- do not output explanations instead of the file
- do not output a “how to finish” guide instead of the file
- do not leave TODO placeholders in release output
- do not leave incomplete handlers, stubs, or broken escaping in `customCode`

## Conflict resolution

If there is tension between:

- fancy implementation ideas
- fast drafting
- concise output
- import safety

then choose **import safety**.

## Working method

Preferred workflow for Perchance export work:

1. Start from a known-good export template already in the repo.
2. Modify character content and behavior carefully.
3. Keep `customCode` as normal source during editing.
4. Serialize to JSON programmatically.
5. Parse the final JSON back.
6. Validate the extracted `customCode`.
7. Re-check structural integrity.
8. Only then treat the export as complete.

## Final instruction

For Perchance bot tasks in this repository, never optimize for “looks done.”

Optimize for **imports correctly, runs correctly, and is complete**.

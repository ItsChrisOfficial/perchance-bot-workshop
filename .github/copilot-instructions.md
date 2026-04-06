# GitHub Copilot Repository Instructions

These instructions are mandatory for any task that creates, edits, patches, reviews, or exports a **Perchance Advanced AI Character Chat** bot JSON in this repository.

---

## ⚡ Real-Time Monolithic Creation Mode (PRIMARY WORKFLOW)

When a user asks to **create a new bot**, the default workflow is **monolithic prompt → single-pass JSON output**.

**Do not ask follow-up questions. Do not output partial artifacts. Do not output pseudocode.**

### Monolithic creation trigger phrases

Any of these mean: use the monolithic workflow immediately.

- "create a bot"
- "make a bot"
- "build a bot"
- "new bot"
- "generate a bot"
- "I want a bot that..."
- "write me a character"
- any request supplying a `shared/prompts/CREATE_BOT_MONOLITHIC.md`-style filled brief

### Monolithic creation execution order

1. Read `shared/prompts/CREATE_BOT_MONOLITHIC.md` to load the canonical brief schema.
2. Extract all values from the user's brief (or infer sensible defaults for any missing field).
3. Build `customCode` as normal JavaScript source first, then attach it as a string.
4. Assemble the full export object in memory using `bots/templates/perchance-empty-minimal.json` as the structural baseline.
5. Serialize to JSON (programmatically — never hand-escape).
6. Parse back and verify.
7. Run the mental checklist from `docs/PERCHANCE_IMPORT_VERIFICATION.md` §Release Checklist.
8. Output **only the finished, importable JSON file** to `bots/in-progress/<bot-name>/<bot-name>.export.json`.
9. Update `BOT_CATALOG.md` and `REPO_MAP.md` in the same change.

> **Speed rule:** Steps 1–9 happen in a single agent pass. The user should not need to send a second message to get a valid export.

---

## Required reading before any work starts

- `docs/PERCHANCE_IMPORT_VERIFICATION.md` — release gate, not optional
- `docs/EXPORT_FIELD_REFERENCE.md` — field types, locations, constraints

---

## Primary rule

Your job is finished only when the final output is a **fully importable Perchance export JSON** that satisfies `docs/PERCHANCE_IMPORT_VERIFICATION.md`.

"Looks right" is not done. "Imports and runs correctly" is done.

---

## Hard requirements

### 1. Preserve the Perchance export envelope

Always use the full Dexie envelope:

```json
{
  "formatName": "dexie",
  "formatVersion": 1,
  "data": {
    "databaseName": "chatbot-ui-v1",
    "databaseVersion": 90,
    "tables": [...],
    "data": [...]
  }
}
```

Never replace this with a bare character object.

### 2. Always produce a finished artifact

If the user asks for a finished bot, never stop at:
- pseudocode
- partial snippets
- patch fragments
- commentary
- a character object without the export envelope

Return the finished export file or write it to the correct location.

### 3. Import safety is the release gate

Before marking work complete, verify:

- JSON parses
- export envelope matches baseline
- all 9 canonical tables present
- `rowCount` values match actual row lengths
- character row is present and complete
- `initialMessages` is an array
- `shortcutButtons` is an array
- `customCode` is a string and valid JS after parse

### 4. Never handwave `customCode`

Write JS normally first. Attach to the export object as a string. Serialize the whole export programmatically. Never hand-escape.

### 5. Valid message objects only

- `content`: string (required)
- `author`: `"user"` | `"ai"` | `"system"` (required)
- `hiddenFrom`: array if present
- `expectsReply`: boolean or omitted

### 6. Valid shortcut buttons only

Each button needs: `name`, `message`, `insertionType` (`"replace"` | `"prepend"` | `"append"`), `autoSend` (boolean), `clearAfterSend` (boolean).

### 7. Never alter baseline compatibility values

Do not change: `formatName`, `formatVersion`, `databaseName`, `databaseVersion`, table names, or table schemas — unless the task explicitly requires it.

### 8. Single-bot tasks stay single-bot

One character row unless the user explicitly requests multiple.

### 9. Patch tasks preserve working structure

Change only what was asked. Preserve everything else.

---

## Output discipline

When a user asks for the final export:

- output the file, not an explanation of the file
- no TODO placeholders in release output
- no incomplete handlers or stubs in `customCode`
- no "insert this manually" instructions

---

## Conflict resolution

When there is tension between speed, conciseness, and import safety → **import safety wins**.

---

## Canonical working method

1. Clone `bots/templates/perchance-empty-minimal.json` as the structural baseline.
2. Replace character row content with the new bot's data.
3. Write `customCode` as normal JS source.
4. Attach as string to the character object.
5. Serialize entire export to JSON programmatically.
6. Parse it back.
7. Syntax-check extracted `customCode`.
8. Run `docs/PERCHANCE_IMPORT_VERIFICATION.md` §Release Checklist.
9. Only then treat the export as complete.

---

## Agent capability lookup (use these before implementing)

| Question | Go to |
|---|---|
| Is this capability realistic in customCode? | `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` |
| Which snippet fits this task? | `docs/SNIPPET_SELECTION_GUIDE.md` |
| How do I combine snippets safely? | `docs/REUSABLE_PATTERN_RECIPES.md` |
| What usually breaks? | `docs/COMMON_FAILURE_MODES.md` |
| What prompting approach? | `docs/PROMPTING_PATTERNS.md` |
| How do I style messages? | `docs/STYLING_RECIPES.md` |
| Am I ready to merge? | `docs/CUSTOM_CODE_IMPLEMENTATION_CHECKLIST.md` |
| What does this JSON field do? | `docs/EXPORT_FIELD_REFERENCE.md` |
| How do I plan a new bot? | `docs/BOT_DESIGN_BRIEF_TEMPLATE.md` |

---

## Final instruction

Never optimize for "looks done."

Optimize for **imports correctly, runs correctly, and is complete** — delivered in a **single agent pass**.

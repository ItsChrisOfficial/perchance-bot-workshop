# FAQ

Frequently asked questions and common troubleshooting scenarios.

## General

### What is this repository for?

This repository is a structured workspace for building **Perchance Advanced AI Character Chat** bots as import-safe JSON export artifacts. It provides templates, validation tools, and a lifecycle workflow to ensure every bot export is correctly structured and importable.

### What is a Perchance export?

A Perchance export is a JSON file that follows the Dexie database export format used by Perchance's AI Character Chat system. It contains a root envelope with database metadata, a canonical set of 9 tables, and corresponding data entries. The `characters` table holds the bot definition, including its `customCode`, `initialMessages`, and `shortcutButtons`.

### Can I just write a character JSON object and import it?

**No.** A bare character object is the most common failure. Perchance requires the full export envelope structure with all canonical tables. Always start from one of the templates in `bots/templates/`.

### Which template should I use?

Use `perchance-empty-minimal.json` for all new bot builds. Use `perchance-empty-annotated.json` only if you need embedded schema guidance while learning the format.

## Bot Development

### How do I start a new bot?

1. Copy a template to `bots/in-progress/<bot-name>/`
2. Edit the character row fields (`name`, `roleInstruction`, `customCode`, etc.)
3. Run validation frequently
4. See [Getting Started](Getting-Started.md) for the full walkthrough

### How do I write customCode?

Write JavaScript as normal source code first, then let a JSON serializer handle the escaping. Never hand-paste JavaScript into a JSON string. See the [Custom Code Guide](Custom-Code-Guide.md) for detailed instructions.

### What `oc` APIs can I use in customCode?

Key APIs include:
- `oc.thread.on("MessageAdded", ...)` — event handlers
- `oc.thread.messages.push(...)` — add messages
- `oc.character.name` / `oc.character.roleInstruction` — character properties
- `oc.generateText(...)` — text generation
- `oc.textToImage(...)` — image generation

See the [Custom Code Guide](Custom-Code-Guide.md) and `docs/Code_Documentation/` for full reference.

### How do I add initial messages?

`initialMessages` must be an array of message objects, each with at least `content` (string) and `author` (one of `"user"`, `"ai"`, or `"system"`):

```json
"initialMessages": [
  {
    "content": "Welcome! I'm your helper bot.",
    "author": "ai"
  }
]
```

### How do I add shortcut buttons?

`shortcutButtons` must be an array of button objects:

```json
"shortcutButtons": [
  {
    "name": "Say hello",
    "message": "Hello!",
    "insertionType": "replace",
    "autoSend": true,
    "clearAfterSend": true
  }
]
```

`insertionType` must be `"replace"`, `"prepend"`, or `"append"`.

## Validation

### How do I validate my bot export?

Run both commands:

```bash
node scripts/validate-perchance-export.js /absolute/path/to/export.json
python -m unittest tests/test-validate-perchance-export.py
```

### The validator says "rowCount mismatch" — what does that mean?

The `rowCount` in `data.tables` doesn't match the actual number of rows in the corresponding `data.data` entry. If your characters table says `"rowCount": 1`, the matching rows array must contain exactly 1 item.

### The validator says "customCode is not a string" — what happened?

The `customCode` field must be a JSON string type. It might have been accidentally set to a number, object, or null. Ensure it's a string, even if empty (`""`).

### The validator reports a JS syntax error in customCode — how do I fix it?

The JavaScript inside `customCode` has a syntax problem. Common causes:
- Unterminated string literal or template literal
- Missing closing bracket or parenthesis
- Broken escaping from hand-assembled JSON

Extract the `customCode` from the JSON, save it as a `.js` file, and check it with `node --check file.js` or your editor's syntax checker.

### My export looks correct but still fails — what should I check?

1. Did you use all 9 canonical tables?
2. Does every `rowCount` match its `rows.length`?
3. Is `initialMessages` an array (not a string or object)?
4. Is `shortcutButtons` an array?
5. Does every message have a valid `author`?
6. Is `customCode` a string?

## Lifecycle and Promotion

### When can I promote a bot to completed?

When **all** of these are true:
- Export satisfies `docs/PERCHANCE_IMPORT_VERIFICATION.md`
- `validate-perchance-export.js` passes
- `test-validate-perchance-export.py` passes
- Bot folder has a versioned export artifact
- `RELEASE.md` is created from the template

See [Bot Lifecycle](Bot-Lifecycle.md) for the full checklist.

### What goes in RELEASE.md?

Copy `bots/completed/RELEASE_TEMPLATE.md` into your bot folder and fill in:
- Bot name, export path, version, and date
- Verification evidence (which commands passed)
- Promotion context and any known constraints

### Do I need to update BOT_CATALOG.md?

**Yes.** Update it whenever you add, move, or retire a bot. Include lifecycle state, path, status, verification state, and operational notes.

## Repository

### Where do shared utilities go?

In `shared/` — organized into `prompts/`, `utilities/`, and `schemas/`. Do not duplicate helper logic across individual bot folders.

### Where do reusable code snippets go?

In `snippets/`. Update `SNIPPETS_INDEX.md` when adding or changing snippets.

### What goes in archive?

Retired, deprecated, or superseded assets. Do not use archive as a source for new work.

### Can I add files to the repo root?

No. The repo root is limited to governance and index files. Place work products in the appropriate workspace folder.

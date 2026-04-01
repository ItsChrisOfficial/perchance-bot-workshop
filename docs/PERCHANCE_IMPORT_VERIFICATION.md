# Perchance Advanced AI Character Chat Import Verification Standard

## Purpose

This document is the hard verification standard for any JSON export intended to be imported into **Perchance Advanced AI Character Chat**.

It exists to stop a recurring failure mode:

- valid-looking JSON that is not a valid **Perchance export structure**
- valid-looking character data that is wrapped in the wrong export envelope
- custom JavaScript that works in isolation but breaks once string-escaped into JSON
- partial exports that omit required tables, inconsistent `rowCount` values, or malformed message/button objects
- bots that are text-complete but not **import-complete**

This standard must be followed whenever:

- creating a new bot export
- patching an existing export
- merging generated code into a Perchance export file
- preparing a final JSON artifact for release
- reviewing PRs that touch export JSON or `customCode`

This file is intended to be treated as a **release gate**, not a suggestion.

---

## Operating Rule

A bot is **not done** when the role text, UI plan, or custom code is written.

A bot is only done when all of the following are true:

1. The export is valid JSON.
2. The export matches the known-good Perchance import envelope.
3. The data tables and row counts are internally consistent.
4. The character row contains the fields needed by the intended bot.
5. The embedded `customCode` is valid JavaScript after JSON serialization.
6. The resulting file can be imported without structural failure.

If any one of those is false, the export is unfinished.

---

## Source Baseline Used For This Standard

This standard is based on the uploaded Perchance documentation and known-good export examples in this repository context, including:

- a working Perchance export envelope using `formatName: "dexie"`, `formatVersion: 1`, `databaseName: "chatbot-ui-v1"`, and `databaseVersion: 90`
- example exports containing `characters`, `threads`, `messages`, `misc`, `summaries`, `memories`, `lore`, `textEmbeddingCache`, and `textCompressionCache`
- Perchance docs describing valid message objects, `initialMessages`, `shortcutButtons`, `customCode`, and `oc` usage

This means the safest approach is not to invent a new export shape. It is to preserve the known-good shape and only change the row content that the bot actually needs.

---

## Non-Negotiable Export Contract

### 1. Root export envelope must match the Perchance export pattern

The export must use the same top-level envelope shape as a known-good Perchance export.

Required root structure:

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

### 2. Do not output a bare character object

This is the most common failure.

Do **not** output only:

```json
{
  "name": "Bot Name",
  "roleInstruction": "..."
}
```

That may be valid JSON, but it is **not** a valid Perchance export file.

### 3. Do not output a partial export envelope unless the platform is known to accept it

Unless explicitly verified otherwise, use the full table envelope from a known-good export.

### 4. Do not change baseline envelope identifiers casually

Do not rename:

- `formatName`
- `formatVersion`
- `databaseName`
- `databaseVersion`
- table names
- table schemas

These are compatibility-sensitive.

When in doubt, preserve the baseline exactly.

---

## Canonical Table Set

For maximum import safety, exports should preserve this canonical table list in `data.tables`:

1. `characters`
2. `threads`
3. `messages`
4. `misc`
5. `summaries`
6. `memories`
7. `lore`
8. `textEmbeddingCache`
9. `textCompressionCache`

### Recommended baseline

```json
"tables": [
  {
    "name": "characters",
    "schema": "++id,modelName,fitMessagesInContextMethod,uuid,creationTime,lastMessageTime,folderPath",
    "rowCount": 1
  },
  {
    "name": "threads",
    "schema": "++id,name,characterId,creationTime,lastMessageTime,lastViewTime,folderPath",
    "rowCount": 0
  },
  {
    "name": "messages",
    "schema": "++id,threadId,characterId,creationTime,order",
    "rowCount": 0
  },
  {
    "name": "misc",
    "schema": "key",
    "rowCount": 0
  },
  {
    "name": "summaries",
    "schema": "hash,threadId",
    "rowCount": 0
  },
  {
    "name": "memories",
    "schema": "++id,[summaryHash+threadId],[characterId+status],[threadId+status],[threadId+index],threadId",
    "rowCount": 0
  },
  {
    "name": "lore",
    "schema": "++id,bookId,bookUrl",
    "rowCount": 0
  },
  {
    "name": "textEmbeddingCache",
    "schema": "++id,textHash,&[textHash+modelName]",
    "rowCount": 0
  },
  {
    "name": "textCompressionCache",
    "schema": "++id,uncompressedTextHash,&[uncompressedTextHash+modelName+tokenLimit]",
    "rowCount": 0
  }
]
```

### Rule

`rowCount` must equal the actual number of rows in the matching entry inside `data.data`.

If `tables[n].rowCount` says `1`, then the corresponding `rows` array must contain exactly `1` row.

---

## Canonical `data.data` Layout

Each table listed in `data.tables` should have a corresponding object in `data.data`.

Recommended pattern:

```json
"data": [
  {
    "tableName": "characters",
    "inbound": true,
    "rows": [ ... ]
  },
  {
    "tableName": "threads",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "messages",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "misc",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "summaries",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "memories",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "lore",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "textEmbeddingCache",
    "inbound": true,
    "rows": []
  },
  {
    "tableName": "textCompressionCache",
    "inbound": true,
    "rows": []
  }
]
```

### Rules

- `tableName` values must match the `tables.name` values exactly.
- Every table should appear exactly once.
- `rows` must always be an array.
- Empty tables must still use `[]`, not `null`, omitted keys, or placeholder strings.

---

## Single-Character Export Rule

If the requested output is a **single importable bot JSON**, the safest baseline is:

- `characters.rowCount = 1`
- one character row in `data.data[characters].rows`
- all other tables present and usually empty unless the design explicitly requires seeded thread/message/lore/cache data

If the user explicitly requests a multi-character export, then adjust the `characters` table and its `rowCount` accordingly.

Do not accidentally ship multiple character rows when the task is for one bot.

---

## Character Row: Required Core Fields

At minimum, the character row should contain the fields the platform and bot behavior depend on.

### Core identity/config fields

- `name`
- `roleInstruction`
- `reminderMessage`
- `fitMessagesInContextMethod`
- `autoGenerateMemories`
- `customCode`
- `modelName`
- `temperature`
- `maxTokensPerMessage`
- `textEmbeddingModelName`
- `initialMessages`
- `shortcutButtons`
- `loreBookUrls`
- `avatar`
- `scene`
- `userCharacter`
- `systemCharacter`
- `streamingResponse`
- `folderPath`
- `customData`
- `creationTime`
- `lastMessageTime`

### Common presentation/authoring fields

- `maxParagraphCountPerMessage`
- `generalWritingInstructions`
- `messageWrapperStyle`
- `imagePromptPrefix`
- `imagePromptSuffix`
- `imagePromptTriggers`
- `messageInputPlaceholder`
- `metaTitle`
- `metaDescription`
- `metaImage`
- `uuid`

### Strong recommendation

Use a known-good character row as the structural template and replace values, rather than inventing keys ad hoc.

---

## Message Object Contract

Perchance documentation shows that thread messages are objects where `content` and `author` are required, and `author` must be one of:

- `"user"`
- `"ai"`
- `"system"`

### Valid message fields

Use these only where needed:

- `content` - required
- `author` - required
- `name`
- `hiddenFrom`
- `expectsReply`
- `customData`
- `avatar`
- `wrapperStyle`
- `instruction`
- `scene`

### Rules

- `content` must be a string.
- `author` must be a valid string literal from the allowed set.
- `hiddenFrom`, if present, must be an array.
- `expectsReply`, if present, must be `true`, `false`, or omitted.
- HTML in `content` is allowed, but it still has to survive JSON serialization correctly.

---

## Initial Messages Contract

`initialMessages` is an array of message objects.

### Rules

- It must be an array, even if empty.
- Every entry must satisfy the message object contract.
- Do not place invalid author labels into `initialMessages`.
- Do not mix plain-text “transcript format” with object-array format in the exported JSON.

### Important distinction

Perchance documentation discusses a text authoring format like:

```text
[AI]: ...
[USER]: ...
[SYSTEM]: ...
```

That is a **writing format** for editor fields and examples.

The exported JSON must still contain proper structured objects, not raw bracket-prefixed transcript text unless that text is intentionally the content of a field.

---

## Shortcut Button Contract

Perchance docs show `shortcutButtons` as an array of objects like:

```json
{
  "autoSend": false,
  "insertionType": "replace",
  "message": "/ai be silly",
  "name": "silly response",
  "clearAfterSend": true
}
```

### Required rules

- `shortcutButtons` must be an array.
- Empty is acceptable: `[]`.
- Each shortcut must be an object.
- Each shortcut should have:
  - `name`
  - `message`
  - `insertionType`
  - `autoSend`
  - `clearAfterSend`
- `insertionType` must be one of:
  - `"replace"`
  - `"prepend"`
  - `"append"`

### Practical rule

If runtime code builds thread buttons dynamically through `oc.thread.shortcutButtons`, the exported character-level `shortcutButtons` array may legitimately be empty. That is valid.

---

## `customCode` Contract

This is where most exports break.

`customCode` must satisfy **two** conditions at the same time:

1. It must be a valid JSON string value.
2. Once unescaped by JSON parsing, it must still be valid JavaScript for Perchance’s custom code environment.

### Hard rules

- `customCode` must be stored as a JSON string, never as a raw object or array.
- Do not manually “fake-escape” JavaScript line by line unless absolutely necessary.
- Prefer writing JavaScript as normal source text first, then JSON-serializing the final object so escaping is handled automatically.
- Do not hand-assemble giant export strings with concatenation if a serializer is available.
- Do not leave unterminated template literals, strings, regexes, or comments inside `customCode`.
- Do not break JavaScript by inserting unescaped newlines into quoted strings.
- Do not break JSON by leaving raw newlines, raw tabs, or unescaped quotes inside the serialized `customCode` string.

### Safe generation pattern

#### Correct workflow

1. Write the JavaScript as normal source.
2. Place that source into the `customCode` field in memory as a normal string.
3. Serialize the entire export object with a JSON serializer.
4. Validate the resulting JSON by parsing it back.
5. Extract `customCode` and run a JavaScript syntax check.

#### Wrong workflow

- write JSON by hand
- paste raw JS into it
- guess the escaping
- assume it will import

That is how broken exports get shipped.

---

## Perchance Custom Code Environment Rules

Perchance docs and examples show custom code using the `oc` object and patterns such as:

- `oc.thread.on("MessageAdded", ...)`
- `oc.thread.messages.push(...)`
- `oc.thread.messages.splice(...)`
- `oc.character.name = ...`
- `oc.character.roleInstruction = ...`
- `oc.character.customCode = ...`
- `oc.generateText(...)`
- `oc.textToImage(...)`
- `oc.messageRenderingPipeline.push(...)`
- `oc.window.show()` / `oc.window.hide()`

### Practical authoring rules

- Keep top-level code self-contained.
- Prefer an IIFE wrapper for larger systems:

```js
(() => {
  // bot code here
})();
```

- Avoid polluting the global scope unless a global function is intentionally needed for UI button handlers.
- If globals are needed for onclick handlers, make them deliberate and namespaced.
- Treat every object added to `oc.thread.messages` as a fully-formed message object.
- System UI messages should usually use:
  - `author: "system"`
  - `expectsReply: false`
  - `hiddenFrom: ["ai"]` or `hiddenFrom: ["user"]` where appropriate

### Stability rules

- Guard against duplicate initialization.
- Do not assume optional nested objects already exist.
- Use initialization helpers such as:

```js
oc.thread.customData ||= {};
```

- Avoid brittle DOM dependencies unless the feature truly requires iframe UI.
- Do not leave debug-only logs, dead handlers, or partial functions in final release code.

---

## Known-Good Export Behavior Patterns Worth Preserving

The uploaded working examples show several stable patterns worth copying when relevant:

### Pattern A: export envelope preserved, behavior changed inside the row

This is correct.

### Pattern B: empty non-character tables retained

This is correct.

### Pattern C: runtime buttons built in custom code via `oc.thread.shortcutButtons`

This is correct.

### Pattern D: staged UI/system messages use structured message objects, not random text blobs

This is correct.

### Pattern E: large custom code is wrapped and stateful, but still stored as one serialized string

This is correct.

---

## Common Failure Cases

### Failure 1: Bare JSON character object

**Problem:** valid JSON, invalid import file.

### Failure 2: Missing tables

**Problem:** character row exists, but envelope is incomplete.

### Failure 3: `rowCount` mismatch

**Problem:** importer sees structural inconsistency.

### Failure 4: `customCode` broken after escaping

**Problem:** JSON parses or JS runs incorrectly, or both.

### Failure 5: Invalid message objects

Examples:

- missing `author`
- invalid `author`
- `hiddenFrom` as string instead of array
- `initialMessages` not an array

### Failure 6: Shortcut buttons malformed

Examples:

- object missing `message`
- boolean fields stored as strings
- invalid `insertionType`

### Failure 7: Partial patch output instead of finished export

**Problem:** agent returns code snippets or delta instructions instead of the final importable JSON.

### Failure 8: Export assembled manually instead of serialized

**Problem:** quote escaping and newline escaping break the file.

### Failure 9: “Looks right” but was never parsed back

**Problem:** no round-trip validation was done.

### Failure 10: “Works in JS source” but not inside JSON string form

**Problem:** JS was not syntax-checked after extraction from the serialized JSON.

---

## Release Checklist

Every export must pass this checklist before it is considered finished.

### A. JSON structure

- [ ] File parses with a JSON parser.
- [ ] Root has `formatName`, `formatVersion`, and `data`.
- [ ] `formatName === "dexie"`.
- [ ] `formatVersion === 1`.
- [ ] `data.databaseName === "chatbot-ui-v1"`.
- [ ] `data.databaseVersion === 90`.
- [ ] `data.tables` is an array.
- [ ] `data.data` is an array.

### B. Table integrity

- [ ] Canonical table set is present.
- [ ] Every table has one matching `data.data` entry.
- [ ] Every `rows` value is an array.
- [ ] Every `rowCount` matches `rows.length`.

### C. Character integrity

- [ ] `characters` table contains the expected number of character rows.
- [ ] `name` exists and is a string.
- [ ] `roleInstruction` exists and is a string.
- [ ] `customCode` exists and is a string.
- [ ] `initialMessages` is an array.
- [ ] `shortcutButtons` is an array.
- [ ] `avatar`, `scene`, `userCharacter`, `systemCharacter`, and `customData` are objects where expected.

### D. Message integrity

- [ ] Every seeded message has string `content`.
- [ ] Every seeded message has valid `author`.
- [ ] Every `hiddenFrom` is an array if present.
- [ ] Every `expectsReply` is boolean or omitted.

### E. Shortcut integrity

- [ ] Every shortcut is an object.
- [ ] `name` is a string.
- [ ] `message` is a string.
- [ ] `insertionType` is valid.
- [ ] `autoSend` and `clearAfterSend` are booleans.

### F. Custom code integrity

- [ ] Extracted `customCode` is non-empty when bot behavior depends on it.
- [ ] Extracted `customCode` passes JavaScript syntax validation.
- [ ] No obvious dead partial blocks remain.
- [ ] No unfinished TODO placeholders remain in release output.

### G. Final-output discipline

- [ ] Output is the finished export file, not commentary.
- [ ] No pseudocode remains.
- [ ] No “insert this manually” instructions remain.
- [ ] No partial patch fragments remain.

---

## Required Validation Procedure

This is the minimum verification flow.

### Step 1: Parse the JSON

Use a real parser.

### Step 2: Verify root envelope values

Check the exact baseline values.

### Step 3: Verify table names and row counts

Cross-check `tables` against `data.data`.

### Step 4: Verify the character row shape

Check required character fields and arrays.

### Step 5: Extract `customCode`

Read it back **after** JSON parse, not from the pre-serialized source object.

### Step 6: JavaScript syntax-check `customCode`

Use a JS parser or syntax check.

### Step 7: Validate seeded message/button objects

Check all nested arrays and enums.

### Step 8: Only then mark the export finished

Not before.

---

## Suggested CI Validation Logic

This repository should eventually enforce these checks automatically.

### Minimum CI assertions

A validator should fail the build if any of the following is true:

- JSON parse fails
- root envelope values differ from baseline
- expected tables are missing
- `rowCount` mismatches occur
- `characters.rows.length` is not what the task requires
- `customCode` is not a string
- `customCode` fails JS syntax validation
- `initialMessages` is not an array
- `shortcutButtons` is not an array
- any seeded message has invalid `author`
- any shortcut has invalid `insertionType`

### Strong recommendation

Implement validation with a dedicated script and make CI call that script. Do not try to encode the entire validation policy inline in YAML only.

---

## Implementation Rules For Agents and Contributors

### Rule 1

Start from a known-good export template whenever possible.

### Rule 2

Modify the **row content**, not the export envelope, unless the task explicitly requires schema-level changes.

### Rule 3

Serialize programmatically.

### Rule 4

Never trust hand-escaped `customCode`.

### Rule 5

Never ship a partial export.

### Rule 6

Never claim import safety without running the verification checklist.

### Rule 7

If a user asks for “the finished JSON,” return the finished JSON export, not a code patch or tutorial.

### Rule 8

If a user asks for a patch, preserve the import structure unless they explicitly request a different export strategy.

### Rule 9

If a requested feature conflicts with import safety, fix the structure first.

### Rule 10

Import correctness outranks cleverness.

---

## Practical Build Strategy

For any new bot, use this workflow:

1. Clone a known-good export envelope.
2. Replace the character row content with the new bot’s data.
3. Write `customCode` as normal JavaScript source.
4. Attach it to the character object as a string.
5. Serialize the whole export with a JSON serializer.
6. Parse it back.
7. Syntax-check extracted `customCode`.
8. Run structural verification.
9. Only then export the artifact.

That is the safe path.

---

## Final Standard

A Perchance bot export is acceptable only if it is:

- structurally correct
- internally consistent
- properly serialized
- syntactically valid as both JSON and embedded JavaScript
- complete as a final artifact

Anything less is unfinished.

# Perchance Export Format

This page documents the **Perchance Advanced AI Character Chat** export JSON structure. Every bot export must conform to this format to be importable.

> **Mandatory reference:** [`docs/PERCHANCE_IMPORT_VERIFICATION.md`](../docs/PERCHANCE_IMPORT_VERIFICATION.md) is the authoritative release gate for export correctness.

## Root Envelope

Every export must use this top-level structure:

```json
{
  "formatName": "dexie",
  "formatVersion": 1,
  "data": {
    "databaseName": "chatbot-ui-v1",
    "databaseVersion": 90,
    "tables": [ ... ],
    "data": [ ... ]
  }
}
```

### Hard rules

- `formatName` must be `"dexie"`
- `formatVersion` must be `1`
- `databaseName` must be `"chatbot-ui-v1"`
- `databaseVersion` must be `90`
- Do **not** change these values unless the task explicitly requires it and compatibility has been re-verified

### Common mistake: bare character object

This is **not** a valid export:

```json
{
  "name": "Bot Name",
  "roleInstruction": "..."
}
```

A valid export always includes the full envelope with tables and data arrays.

## Canonical Table Set

Exports must include these 9 tables in `data.tables`:

| # | Table | Schema |
|---|---|---|
| 1 | `characters` | `++id,modelName,fitMessagesInContextMethod,uuid,creationTime,lastMessageTime,folderPath` |
| 2 | `threads` | `++id,name,characterId,creationTime,lastMessageTime,lastViewTime,folderPath` |
| 3 | `messages` | `++id,threadId,characterId,creationTime,order` |
| 4 | `misc` | `key` |
| 5 | `summaries` | `hash,threadId` |
| 6 | `memories` | `++id,[summaryHash+threadId],[characterId+status],[threadId+status],[threadId+index],threadId` |
| 7 | `lore` | `++id,bookId,bookUrl` |
| 8 | `textEmbeddingCache` | `++id,textHash,&[textHash+modelName]` |
| 9 | `textCompressionCache` | `++id,uncompressedTextHash,&[uncompressedTextHash+modelName+tokenLimit]` |

### Table entry format

Each table in `data.tables`:

```json
{
  "name": "characters",
  "schema": "++id,modelName,...",
  "rowCount": 1
}
```

### Data entry format

Each table in `data.data`:

```json
{
  "tableName": "characters",
  "inbound": true,
  "rows": [ ... ]
}
```

### Row count rule

`rowCount` in `data.tables` must **exactly match** the length of the corresponding `rows` array in `data.data`.

### Empty tables

Empty tables must use `[]` for `rows`, never `null` or omitted.

## Single-Character Export

For a single bot export:

- `characters.rowCount = 1`
- One character row in the characters data entry
- All other tables present (usually empty)

Do not accidentally ship multiple character rows when the task is for one bot.

## Character Row Fields

### Core identity and config

| Field | Type | Purpose |
|---|---|---|
| `name` | string | Bot display name |
| `roleInstruction` | string | Core behavior prompt |
| `reminderMessage` | string | Recurring context reminder |
| `customCode` | string | Runtime JavaScript |
| `initialMessages` | array | Seeded conversation starters |
| `shortcutButtons` | array | Quick-action buttons |
| `modelName` | string | AI model identifier |
| `temperature` | number | Response randomness |
| `maxTokensPerMessage` | number | Max response length |
| `fitMessagesInContextMethod` | string | Context window strategy |
| `autoGenerateMemories` | string | Memory generation setting |
| `textEmbeddingModelName` | string | Embedding model |
| `loreBookUrls` | array | Lore book references |
| `avatar` | object | Bot avatar config |
| `scene` | object | Scene/background config |
| `userCharacter` | object | User character config |
| `systemCharacter` | object | System character config |
| `streamingResponse` | boolean | Enable streaming |
| `folderPath` | string | Organization path |
| `customData` | object | Custom metadata |
| `creationTime` | number | Timestamp |
| `lastMessageTime` | number | Timestamp |

### Presentation and authoring

`maxParagraphCountPerMessage`, `generalWritingInstructions`, `messageWrapperStyle`, `imagePromptPrefix`, `imagePromptSuffix`, `imagePromptTriggers`, `messageInputPlaceholder`, `metaTitle`, `metaDescription`, `metaImage`, `uuid`

## Message Object Contract

Messages in `initialMessages` must be structured objects:

```json
{
  "content": "Hello! How can I help you?",
  "author": "ai"
}
```

### Required fields

| Field | Type | Rules |
|---|---|---|
| `content` | string | Required |
| `author` | string | Required — must be `"user"`, `"ai"`, or `"system"` |

### Optional fields

| Field | Type | Rules |
|---|---|---|
| `hiddenFrom` | array | If present, must be an array |
| `expectsReply` | boolean | If present, must be `true` or `false` |
| `name` | string | Display name override |
| `customData` | object | Custom metadata |
| `avatar` | object | Avatar override |
| `wrapperStyle` | string | CSS styling |
| `instruction` | string | Per-message instruction |
| `scene` | object | Scene override |

### Important distinction

Perchance supports a text authoring format (`[AI]: ...`, `[USER]: ...`), but exported JSON must use **structured objects**, not bracket-prefixed transcript text.

## Shortcut Button Contract

`shortcutButtons` is an array of button objects:

```json
{
  "name": "silly response",
  "message": "/ai be silly",
  "insertionType": "replace",
  "autoSend": false,
  "clearAfterSend": true
}
```

### Rules

| Field | Type | Rules |
|---|---|---|
| `name` | string | Button label |
| `message` | string | Text to insert/send |
| `insertionType` | string | Must be `"replace"`, `"prepend"`, or `"append"` |
| `autoSend` | boolean | Auto-submit on click |
| `clearAfterSend` | boolean | Clear input after send |

An empty `shortcutButtons` array (`[]`) is valid — runtime code can build buttons dynamically via `oc.thread.shortcutButtons`.

## Release Checklist Summary

Every export must pass before it is considered finished:

- [ ] JSON parses successfully
- [ ] Root envelope values match baseline
- [ ] All 9 canonical tables present
- [ ] `rowCount` matches `rows.length` for every table
- [ ] Character row has required fields
- [ ] `initialMessages` is an array with valid message objects
- [ ] `shortcutButtons` is an array with valid button objects
- [ ] `customCode` is a string containing valid JavaScript
- [ ] Output is a finished export file (not commentary or snippets)

See [Validation and Testing](Validation-and-Testing.md) for how to automate these checks.

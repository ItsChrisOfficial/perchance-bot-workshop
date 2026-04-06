# Perchance AI Character Chat — Export Field Reference

Fast-lookup reference for every field in a Perchance Advanced AI Character Chat export JSON.
Canonical source: [`docs/PERCHANCE_IMPORT_VERIFICATION.md`](PERCHANCE_IMPORT_VERIFICATION.md).

---

## 1. Purpose / How to Use

Use this document to:

- Look up a field's type, location, and scope without reading prose.
- Verify whether a field is required or optional before editing an export.
- Understand what part of the platform a field affects (import, runtime, display, AI behavior).
- Cross-reference field names alphabetically via the quick-lookup index in §15.

> **Convention:** "Required" means the field must be present for a structurally valid, importable export. "Optional" means the platform tolerates its absence.

---

## 2. Root Export Envelope

| Field | Type | Required | Value / Constraint | Affects | Scope | Caveats |
|---|---|---|---|---|---|---|
| `formatName` | string | **yes** | Must be `"dexie"` | Import parsing | Export-wide | Do not change; compatibility-sensitive |
| `formatVersion` | number | **yes** | Must be `1` | Import parsing | Export-wide | Do not change |
| `data` | object | **yes** | Contains `databaseName`, `databaseVersion`, `tables`, `data` | Import parsing | Export-wide | Must not be `null` or array |

### `data` object (inside root)

| Field | Type | Required | Value / Constraint | Affects | Scope | Caveats |
|---|---|---|---|---|---|---|
| `data.databaseName` | string | **yes** | Must be `"chatbot-ui-v1"` | Import parsing | Export-wide | Do not change |
| `data.databaseVersion` | number | **yes** | Must be `90` | Import parsing | Export-wide | Do not change |
| `data.tables` | array | **yes** | Array of table descriptor objects | Import structure | Export-wide | Must list all 9 canonical tables |
| `data.data` | array | **yes** | Array of table data objects | Import data | Export-wide | Must have one entry per table |

**Example — minimal root:**

```json
{
  "formatName": "dexie",
  "formatVersion": 1,
  "data": {
    "databaseName": "chatbot-ui-v1",
    "databaseVersion": 90,
    "tables": [],
    "data": []
  }
}
```

---

## 3. `data.tables` Entry Fields

Each element in the `data.tables` array is a table descriptor.

| Field | Type | Required | Description | Caveats |
|---|---|---|---|---|
| `name` | string | **yes** | Table name; must match a canonical table name exactly | Case-sensitive |
| `schema` | string | **yes** | Dexie index schema string | Do not alter unless task explicitly requires it |
| `rowCount` | number | **yes** | Number of rows in the matching `data.data` entry | Must equal `rows.length` of the corresponding data entry |

### Canonical Tables and Schemas

| # | `name` | `schema` |
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

---

## 4. `data.data` Entry Fields

Each element in the `data.data` array pairs with a table descriptor.

| Field | Type | Required | Description | Caveats |
|---|---|---|---|---|
| `tableName` | string | **yes** | Must exactly match a `data.tables[].name` value | Case-sensitive |
| `inbound` | boolean | **yes** | Always `true` for standard exports | Do not omit |
| `rows` | array | **yes** | Array of row objects for this table | Must be `[]` for empty tables, never `null` |

**Rule:** `rows.length` must equal the corresponding `data.tables` entry's `rowCount`.

---

## 5. Character Row Fields — Identity & Config

These fields live inside a row object in `data.data` where `tableName === "characters"`.

| Field | Type | Required | Affects | Scope | Caveats | Example |
|---|---|---|---|---|---|---|
| `name` | string | **yes** | Display, AI context | Character-wide | Used as character display name | `"Aria"` |
| `roleInstruction` | string | **yes** | AI behavior | Character-wide | Primary system prompt; can be long | — |
| `reminderMessage` | string | **yes** | AI behavior | Character-wide | Appended after context window messages | — |
| `customCode` | string | **yes** | Runtime behavior | Character-wide | Must be valid JS after JSON parse; see §12 | — |
| `modelName` | string | **yes** | AI model selection | Character-wide | e.g. `"gpt-4o"` | — |
| `temperature` | number | recommended | AI output randomness | Character-wide | Typically `0.0`–`2.0` | `0.85` |
| `maxTokensPerMessage` | number | recommended | AI output length | Character-wide | Max tokens the model returns per reply | `800` |
| `fitMessagesInContextMethod` | string | **yes** | Context window strategy | Character-wide | Indexed in table schema | `"summarizeOld"` |
| `autoGenerateMemories` | string | recommended | Memory system | Character-wide | `"none"`, or other valid value | `"none"` |
| `textEmbeddingModelName` | string | recommended | Embedding model | Character-wide | Used for RAG / memory retrieval | — |
| `initialMessages` | array | **yes** | Seeded conversation | Future threads | Must be array of message objects; see §8 | `[]` |
| `shortcutButtons` | array | **yes** | UI buttons | Future threads | Must be array of button objects; see §10 | `[]` |
| `loreBookUrls` | array | recommended | Lore retrieval | Character-wide | URLs to external lore books | `[]` |
| `streamingResponse` | boolean | recommended | Display | Character-wide | Whether AI responses stream token-by-token | `true` |
| `folderPath` | string | recommended | Organization | Character-wide | Folder path in character list UI | `""` |
| `customData` | object | recommended | Persistent state | Character-wide | Arbitrary key/value; see §11 | `{}` |
| `creationTime` | number | **yes** | Sorting, metadata | Character-wide | Unix timestamp (ms) | `1700000000000` |
| `lastMessageTime` | number | **yes** | Sorting, metadata | Character-wide | Unix timestamp (ms); indexed in schema | `1700000000000` |
| `avatar` | object | recommended | Display | Character-wide | See §7 for nested structure | — |
| `scene` | object | recommended | Display | Character-wide | See §7 for nested structure | — |
| `userCharacter` | object | recommended | AI context, display | Character-wide | See §7 for nested structure | — |
| `systemCharacter` | object | recommended | AI context, display | Character-wide | See §7 for nested structure | — |

---

## 6. Character Row Fields — Presentation & Authoring

| Field | Type | Required | Affects | Scope | Caveats | Example |
|---|---|---|---|---|---|---|
| `maxParagraphCountPerMessage` | number | optional | AI output formatting | Character-wide | Guides paragraph count per AI reply | `4` |
| `generalWritingInstructions` | string | optional | AI behavior | Character-wide | Extra writing-style guidance for the model | — |
| `messageWrapperStyle` | string | optional | Display styling | Character-wide | CSS applied to all messages; see §13 | — |
| `imagePromptPrefix` | string | optional | Image generation | Character-wide | Prepended to generated image prompts | — |
| `imagePromptSuffix` | string | optional | Image generation | Character-wide | Appended to generated image prompts | — |
| `imagePromptTriggers` | string | optional | Image generation | Character-wide | Conditions that trigger image generation | — |
| `messageInputPlaceholder` | string | optional | Display | Character-wide | Placeholder text in message input box | `"Type a message..."` |
| `metaTitle` | string | optional | Share-link metadata | Character-wide | HTML `<title>` for share page | — |
| `metaDescription` | string | optional | Share-link metadata | Character-wide | `<meta name="description">` for share page | — |
| `metaImage` | string | optional | Share-link metadata | Character-wide | URL for `og:image` on share page | — |
| `uuid` | string | recommended | Identity, deduplication | Character-wide | Unique identifier; indexed in schema | — |

---

## 7. Character Row Fields — Nested Objects

### `avatar`

| Field | Type | Required | Affects | Example |
|---|---|---|---|---|
| `url` | string | recommended | Character avatar image URL | `"https://example.com/avatar.png"` |
| `size` | number | optional | Avatar display size | `1` |
| `shape` | string | optional | Avatar shape | `"circle"` |

### `scene`

| Field | Type | Required | Affects | Example |
|---|---|---|---|---|
| `background` | object | optional | Chat background | `{ "url": "https://..." }` |
| `music` | object | optional | Background audio | `{ "url": "https://...", "volume": 0.5 }` |

### `userCharacter`

| Field | Type | Required | Affects | Example |
|---|---|---|---|---|
| `name` | string | optional | User's display name in chat | `"Traveler"` |
| `avatar` | object | optional | User's avatar | `{ "url": "https://..." }` |

### `systemCharacter`

| Field | Type | Required | Affects | Example |
|---|---|---|---|---|
| `name` | string | optional | System narrator display name | `"Narrator"` |
| `avatar` | object | optional | System narrator avatar | `{ "url": "https://..." }` |

---

## 8. Message Object Fields

Used inside `initialMessages` and at runtime in `oc.thread.messages`.

| Field | Type | Required | Affects | Allowed Values | Caveats |
|---|---|---|---|---|---|
| `content` | string | **yes** | Message text displayed / sent to AI | Any string | HTML allowed; must survive JSON serialization |
| `author` | string | **yes** | Routing, display | `"user"`, `"ai"`, `"system"` | No other values accepted |
| `name` | string | optional | Display name override | Any string | Overrides character/user name for this message |
| `hiddenFrom` | array | optional | Visibility | Array of `"user"` / `"ai"` | Must be array if present, never a string |
| `expectsReply` | boolean | optional | Conversation flow | `true` / `false` | If omitted, platform uses default; system messages often set `false` |
| `customData` | object | optional | Per-message state | Any object | Arbitrary key/value storage |
| `avatar` | object | optional | Per-message avatar | `{ "url": "..." }` | Overrides character avatar for this message |
| `wrapperStyle` | string | optional | Per-message styling | CSS string | See §13 |
| `instruction` | string | optional | AI behavior | Any string | Per-message instruction injected into context; see §12 |
| `scene` | object | optional | Per-message scene | `{ "background": {...} }` | Changes background/music for this message |

---

## 9. Initial Messages — Behavior Notes

| Aspect | Detail |
|---|---|
| **Location** | `characterRow.initialMessages` |
| **Type** | Array of message objects (§8) |
| **When applied** | Copied into every **new** thread created for this character |
| **Existing threads** | Not affected by changes to `initialMessages` |
| **Empty array** | Valid; new threads start blank |
| **Author mix** | Can contain `"user"`, `"ai"`, and `"system"` messages in any order |
| **Text format vs. object format** | Export JSON must use object arrays, not `[AI]: ...` transcript text |
| **`hiddenFrom` usage** | Use `["ai"]` to show text to user only; use `["user"]` to inject AI-only context |
| **`expectsReply: false`** | Useful on system messages to prevent the AI from auto-replying to setup text |
| **Ordering** | Array order = display order in new thread |

---

## 10. Shortcut Button Fields

Each element in `characterRow.shortcutButtons`.

| Field | Type | Required | Affects | Allowed Values | Caveats | Example |
|---|---|---|---|---|---|---|
| `name` | string | **yes** | Button label | Any string | Displayed on UI button | `"Silly mode"` |
| `message` | string | **yes** | Text sent / inserted | Any string | Supports `/ai` and `/user` prefixes | `"/ai be silly"` |
| `insertionType` | string | **yes** | How message is placed | `"replace"`, `"prepend"`, `"append"` | `"replace"` clears input box first | `"replace"` |
| `autoSend` | boolean | **yes** | Whether message sends immediately | `true` / `false` | `true` = no user confirmation | `false` |
| `clearAfterSend` | boolean | **yes** | Whether input clears after send | `true` / `false` | Usually `true` | `true` |

**Runtime note:** `oc.thread.shortcutButtons` can be set dynamically in `customCode`. If buttons are built at runtime, the exported `shortcutButtons` array may be `[]`.

---

## 11. `customData` Storage Locations

| Location | Access Path | Scope | Persists Across Threads | Preserved on Share | Typical Use |
|---|---|---|---|---|---|
| Character-level | `oc.character.customData` | Character-wide | Yes | No (local only) | Local preferences, accumulated state |
| Character-level PUBLIC | `oc.character.customData.PUBLIC` | Character-wide | Yes | **Yes** | State that must survive share-link import |
| Thread-level | `oc.thread.customData` | Current thread only | No | N/A | Per-conversation state, game state, counters |
| Message-level | `message.customData` | Single message | N/A | N/A | Per-message metadata |

**Initialization pattern:**

```js
oc.thread.customData ??= {};
oc.character.customData ??= {};
oc.character.customData.PUBLIC ??= {};
```

---

## 12. Instruction / Reminder Behavior

| Field | Location | When Injected | Scope | Caveats |
|---|---|---|---|---|
| `roleInstruction` | `oc.character.roleInstruction` | Sent as system prompt at context start | All threads for this character | Changing at runtime affects future AI calls only |
| `reminderMessage` | `oc.character.reminderMessage` | Appended after context messages, before AI reply | All threads for this character | Useful for "always remember" rules |
| `instruction` (message-level) | `message.instruction` | Injected into context for the specific message | Single message | Per-message override; does not replace roleInstruction |

**Runtime mutation:**

```js
// Change role instruction at runtime (affects future AI calls)
oc.character.roleInstruction = "New instruction text";

// Change reminder at runtime
oc.character.reminderMessage = "Always stay in character.";
```

---

## 13. `wrapperStyle` / `messageWrapperStyle` Styling

| Field | Location | Scope | Type | Affects |
|---|---|---|---|---|
| `messageWrapperStyle` | Character row | All messages (default) | string (CSS) | Default wrapper CSS for all messages in this character's threads |
| `wrapperStyle` | Message object | Single message | string (CSS) | Per-message CSS override; takes precedence over `messageWrapperStyle` |

**Example — character-wide default:**

```json
"messageWrapperStyle": "background: #1a1a2e; border-radius: 8px; padding: 10px;"
```

**Example — per-message override:**

```json
{
  "content": "⚠️ System alert.",
  "author": "system",
  "wrapperStyle": "background: #ff000020; border: 1px solid red;"
}
```

---

## 14. Share-Link Persistence Behavior

| Data | Persists on Share? | Mechanism |
|---|---|---|
| `roleInstruction` | Yes | Part of character row |
| `reminderMessage` | Yes | Part of character row |
| `customCode` | Yes | Part of character row |
| `initialMessages` | Yes | Part of character row |
| `shortcutButtons` | Yes | Part of character row |
| `avatar`, `scene` | Yes | Part of character row |
| `oc.character.customData` | **No** | Local-only storage |
| `oc.character.customData.PUBLIC` | **Yes** | Explicitly shared subset |
| `oc.thread.customData` | **No** | Thread-local; not part of character export |
| Thread messages | **No** | Thread-local; not part of character export |
| Runtime `oc.thread.shortcutButtons` changes | **No** | Thread-local; rebuilt by `customCode` on load |

**Rule:** If state must survive sharing, store it in `oc.character.customData.PUBLIC`.

---

## 15. Quick Field-Lookup Index (Alphabetical)

| Field | Location | Type | Req? | Section |
|---|---|---|---|---|
| `autoGenerateMemories` | Character row | string | rec | §5 |
| `autoSend` | Shortcut button | boolean | yes | §10 |
| `author` | Message object | string | yes | §8 |
| `avatar` (character) | Character row | object | rec | §7 |
| `avatar` (message) | Message object | object | opt | §8 |
| `avatar` (userCharacter) | `userCharacter` nested | object | opt | §7 |
| `clearAfterSend` | Shortcut button | boolean | yes | §10 |
| `content` | Message object | string | yes | §8 |
| `creationTime` | Character row | number | yes | §5 |
| `customCode` | Character row | string | yes | §5 |
| `customData` (character) | Character row | object | rec | §5, §11 |
| `customData` (message) | Message object | object | opt | §8, §11 |
| `customData` (thread) | `oc.thread.customData` | object | opt | §11 |
| `customData.PUBLIC` | `oc.character.customData.PUBLIC` | object | opt | §11, §14 |
| `data` (root) | Root envelope | object | yes | §2 |
| `data.data` | Root → `data` | array | yes | §4 |
| `data.databaseName` | Root → `data` | string | yes | §2 |
| `data.databaseVersion` | Root → `data` | number | yes | §2 |
| `data.tables` | Root → `data` | array | yes | §3 |
| `expectsReply` | Message object | boolean | opt | §8 |
| `fitMessagesInContextMethod` | Character row | string | yes | §5 |
| `folderPath` | Character row | string | rec | §5 |
| `formatName` | Root envelope | string | yes | §2 |
| `formatVersion` | Root envelope | number | yes | §2 |
| `generalWritingInstructions` | Character row | string | opt | §6 |
| `hiddenFrom` | Message object | array | opt | §8 |
| `imagePromptPrefix` | Character row | string | opt | §6 |
| `imagePromptSuffix` | Character row | string | opt | §6 |
| `imagePromptTriggers` | Character row | string | opt | §6 |
| `inbound` | `data.data` entry | boolean | yes | §4 |
| `initialMessages` | Character row | array | yes | §5, §9 |
| `insertionType` | Shortcut button | string | yes | §10 |
| `instruction` | Message object | string | opt | §8, §12 |
| `lastMessageTime` | Character row | number | yes | §5 |
| `loreBookUrls` | Character row | array | rec | §5 |
| `maxParagraphCountPerMessage` | Character row | number | opt | §6 |
| `maxTokensPerMessage` | Character row | number | rec | §5 |
| `message` | Shortcut button | string | yes | §10 |
| `messageInputPlaceholder` | Character row | string | opt | §6 |
| `messageWrapperStyle` | Character row | string | opt | §6, §13 |
| `metaDescription` | Character row | string | opt | §6 |
| `metaImage` | Character row | string | opt | §6 |
| `metaTitle` | Character row | string | opt | §6 |
| `modelName` | Character row | string | yes | §5 |
| `name` (character) | Character row | string | yes | §5 |
| `name` (shortcut) | Shortcut button | string | yes | §10 |
| `name` (message) | Message object | string | opt | §8 |
| `name` (table) | `data.tables` entry | string | yes | §3 |
| `reminderMessage` | Character row | string | yes | §5, §12 |
| `roleInstruction` | Character row | string | yes | §5, §12 |
| `rowCount` | `data.tables` entry | number | yes | §3 |
| `rows` | `data.data` entry | array | yes | §4 |
| `scene` (character) | Character row | object | rec | §7 |
| `scene` (message) | Message object | object | opt | §8 |
| `schema` | `data.tables` entry | string | yes | §3 |
| `shortcutButtons` | Character row | array | yes | §5, §10 |
| `streamingResponse` | Character row | boolean | rec | §5 |
| `systemCharacter` | Character row | object | rec | §7 |
| `tableName` | `data.data` entry | string | yes | §4 |
| `temperature` | Character row | number | rec | §5 |
| `textEmbeddingModelName` | Character row | string | rec | §5 |
| `userCharacter` | Character row | object | rec | §7 |
| `uuid` | Character row | string | rec | §6 |
| `wrapperStyle` | Message object | string | opt | §8, §13 |

> **Key:** yes = required, rec = recommended, opt = optional.

---

## 16. Type Safety Table

Every field in a Perchance export must use the exact primitive JSON type listed below. Using the wrong type — even one that "looks right" (e.g. `"0.8"` instead of `0.8`) — will cause import failure with Dexie/typeson errors such as `"Unregistered type: Number"`.

### Rules

1. **Use only primitive types.** Never use boxed constructors (`new Number`, `new String`, `new Boolean`).
2. **Numbers must be finite.** No `NaN`, no `Infinity`, no `-Infinity`.
3. **Strings must be string primitives.** Never store a number where a string is expected (or vice versa).
4. **Booleans must be `true` or `false`.** Never use `0`/`1` or `"true"`/`"false"`.
5. **Arrays must be `[]` when empty.** Never use `null` or omit them.
6. **Objects must be `{}` when empty.** Never use `null` or an array where a plain object is expected.
7. **`undefined` must not appear.** JSON.stringify strips it, but verify after serialization.

### Root / Envelope Fields

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `formatName` | string | number, null | Must be `"dexie"` |
| `formatVersion` | number (finite integer) | string `"1"`, null | Must be `1` |
| `data` | object | null, array | — |
| `data.databaseName` | string | number, null | Must be `"chatbot-ui-v1"` |
| `data.databaseVersion` | number (finite integer) | string `"90"`, null | Must be `90` |
| `data.tables` | array | null, object | — |
| `data.data` | array | null, object | — |

### Table Descriptor Fields

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `name` | string | number, null | Case-sensitive; must match canonical name |
| `schema` | string | number, null | Do not alter |
| `rowCount` | number (finite integer) | string, null, NaN | Must equal `rows.length` |

### Data Entry Fields

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `tableName` | string | number, null | Must match `data.tables[].name` |
| `inbound` | boolean | number `0`/`1`, string | Must be `true` |
| `rows` | array | null, object | Must be `[]` for empty tables |

### Character Row — Identity & Config

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `name` | string | number, null | Required |
| `roleInstruction` | string | number, null | Required |
| `reminderMessage` | string | number, null | — |
| `customCode` | string | number, null, object | Must be valid JS after parse |
| `modelName` | string | number, null | e.g. `"perchance-ai"` |
| `temperature` | number (finite) | string `"0.8"`, boolean | Typically 0.0–2.0 |
| `maxTokensPerMessage` | number (finite) | string, boolean | — |
| `fitMessagesInContextMethod` | string | number, boolean | e.g. `"summarizeOld"` |
| `autoGenerateMemories` | string | number, boolean | e.g. `"none"` |
| `textEmbeddingModelName` | string | number, null | — |
| `initialMessages` | array | null, string | Must be `[]` if empty |
| `shortcutButtons` | array | null, string | Must be `[]` if empty |
| `loreBookUrls` | array | null, string | Must be `[]` if empty |
| `streamingResponse` | boolean | number `0`/`1`, string | — |
| `folderPath` | string | number, null | — |
| `customData` | object | null, array | — |
| `creationTime` | number (finite) | string, null | Unix ms timestamp |
| `lastMessageTime` | number (finite) | string, null | Unix ms timestamp |
| `avatar` | object | null, array | — |
| `scene` | object | null, array | — |
| `userCharacter` | object | null, array | — |
| `systemCharacter` | object | null, array | — |

### Character Row — Presentation

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `maxParagraphCountPerMessage` | number (finite) | string | — |
| `generalWritingInstructions` | string | number, null | — |
| `messageWrapperStyle` | string | number, null | CSS string |
| `imagePromptPrefix` | string | number, null | — |
| `imagePromptSuffix` | string | number, null | — |
| `imagePromptTriggers` | string | number, null, array | Not an array |
| `messageInputPlaceholder` | string | number, null | — |
| `metaTitle` | string | number, null | — |
| `metaDescription` | string | number, null | — |
| `metaImage` | string | number, null | URL string |
| `uuid` | string or null | number | May be null in templates |

### Message Object

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `content` | string | number, null | Required |
| `author` | string | number, null | Must be `"user"`, `"ai"`, or `"system"` |
| `name` | string | number | Optional |
| `hiddenFrom` | array | string `"ai"` | Must be array if present: `["ai"]` |
| `expectsReply` | boolean | number `0`/`1`, string | Optional |
| `customData` | object | null, array | Optional |

### Shortcut Button

| Field | Expected JSON Type | Forbidden Types | Notes |
|---|---|---|---|
| `name` | string | number, null | Required |
| `message` | string | number, null | Required |
| `insertionType` | string | number | Must be `"replace"`, `"prepend"`, or `"append"` |
| `autoSend` | boolean | number `0`/`1`, string | Required |
| `clearAfterSend` | boolean | number `0`/`1`, string | Required |

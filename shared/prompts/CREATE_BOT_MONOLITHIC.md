# CREATE_BOT_MONOLITHIC — Monolithic Bot Creation Brief

Fill out every section below and hand this file to a Copilot agent (or paste its contents as your prompt).  
The agent will produce a complete, validated, import-ready Perchance JSON export in one pass.

**Do not leave `[REQUIRED]` fields blank.** Optional fields may be left empty — the agent will use defaults.

---

## HOW TO USE

1. Copy this file to `bots/in-progress/<your-bot-name>/BRIEF.md`.
2. Fill in every field.
3. In Copilot Chat (Agent mode), type:  
   `Create this bot from BRIEF.md and write the export to bots/in-progress/<your-bot-name>/<your-bot-name>.export.json`
4. The agent produces one complete, importable `.export.json` — no follow-up needed.

---

## BOT BRIEF

### IDENTITY

```
BOT_NAME:           [REQUIRED — display name, e.g. "Aria"]
BOT_SLUG:           [REQUIRED — kebab-case folder/file name, e.g. "aria"]
MODEL:              [REQUIRED — e.g. "gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet"]
TEMPERATURE:        [optional — 0.0–2.0, default 0.85]
MAX_TOKENS:         [optional — default 800]
FOLDER_PATH:        [optional — UI folder, default ""]
UUID:               [optional — leave blank to auto-generate]
```

---

### CHARACTER DESIGN

```
ROLE_INSTRUCTION:
[REQUIRED — The full system prompt. Write it as you want it to appear.
 No length limit. Use newlines freely. This becomes roleInstruction in the export.]




REMINDER_MESSAGE:
[optional — Appended after context window messages before each AI reply.
 Use for "always remember" rules or tone reinforcement.]


GENERAL_WRITING_INSTRUCTIONS:
[optional — Extra style guidance for the AI model.]


MAX_PARAGRAPHS_PER_MESSAGE:  [optional — default 4]
```

---

### PERSONA DETAILS

```
USER_NAME:          [optional — user's display name in chat, e.g. "Traveler"]
USER_AVATAR_URL:    [optional]
CHAR_AVATAR_URL:    [optional]
CHAR_AVATAR_SHAPE:  [optional — "circle" or "square", default "circle"]
SCENE_BG_URL:       [optional — background image URL]
SCENE_MUSIC_URL:    [optional — background audio URL]
SCENE_MUSIC_VOLUME: [optional — 0.0–1.0, default 0.4]
MESSAGE_INPUT_PLACEHOLDER: [optional — placeholder text in input box]
MESSAGE_WRAPPER_STYLE:     [optional — CSS string applied to all messages]
```

---

### INITIAL MESSAGES

List messages that seed every new thread. Use the format below.
Author must be `user`, `ai`, or `system`.
Leave blank for no seeded messages.

```
INITIAL_MESSAGES:
- author: ai
  content: "[Opening line from the character]"

- author: system
  content: "[Optional setup context, hidden from AI]"
  hiddenFrom: ["ai"]
  expectsReply: false
```

---

### SHORTCUT BUTTONS

List UI shortcut buttons. Leave blank for none.
`insertionType`: `replace` | `prepend` | `append`

```
SHORTCUT_BUTTONS:
- name: "Example Button"
  message: "/ai [instruction for AI]"
  insertionType: replace
  autoSend: true
  clearAfterSend: true
```

---

### FEATURES (optional — leave blank to skip)

Check any features you want. The agent will select and compose the correct snippets.

```
FEATURES:
  state_machine:        false   # Character FSM with mood classification
  mode_switcher:        false   # Toggle conversation modes
  scene_transitions:    false   # LLM-classified scene/background changes
  avatar_expressions:   false   # Map AI emotion → avatar URL
  runtime_theme:        false   # Rolling-window mood → dynamic CSS theme
  hidden_system_inject: false   # Inject hidden system messages
  style_enforcer:       false   # LLM-powered style rule enforcement
  message_classifier:   false   # Classify AI messages with color badges
  context_packer:       false   # Periodic context summarization
  dynamic_reminder:     false   # Intent-based reminderMessage switching
  slash_commands:       false   # Parse ! commands from user messages
  floating_panel:       false   # Draggable floating UI panel
  toast_notifications:  false   # Auto-dismissing toast system
  debug_console:        false   # In-iframe debug console
  image_cache:          false   # Preload images on load
  audio_cache:          false   # Preload audio on load
  message_sanitizer:    false   # Strip dangerous HTML from messages
  roleplay_normalizer:  false   # Normalize *action* "dialogue" formatting
  lore_loader:          false   # Keyword-triggered lore injection
  stream_monitor:       false   # Monitor streaming AI messages
  regen_guard:          false   # Detect and remove duplicate AI responses
  postprocessor:        false   # Extensible AI message post-processing pipeline
```

---

### CUSTOM CODE (advanced — optional)

If you want custom JavaScript beyond the snippet system, paste it here.  
Write it as normal JS source — the agent will serialize it correctly.

```
CUSTOM_CODE_EXTRA:
// paste JS here, or leave blank
```

---

### LORE BOOKS (optional)

```
LORE_BOOK_URLS:
  - ""
```

---

### META / SHARE PAGE (optional)

```
META_TITLE:       [optional — HTML title for share page]
META_DESCRIPTION: [optional — og:description for share page]
META_IMAGE_URL:   [optional — og:image for share page]
```

---

## FIELD DEFAULTS

When a field is blank, the agent uses these defaults:

| Field | Default |
|---|---|
| `TEMPERATURE` | `0.85` |
| `MAX_TOKENS` | `800` |
| `FOLDER_PATH` | `""` |
| `MAX_PARAGRAPHS_PER_MESSAGE` | `4` |
| `CHAR_AVATAR_SHAPE` | `"circle"` |
| `SCENE_MUSIC_VOLUME` | `0.4` |
| `fitMessagesInContextMethod` | `"summarizeOld"` |
| `autoGenerateMemories` | `"none"` |
| `streamingResponse` | `true` |
| `initialMessages` | `[]` |
| `shortcutButtons` | `[]` |
| `loreBookUrls` | `[]` |
| `customData` | `{}` |
| `CUSTOM_CODE_EXTRA` | `""` (no custom code block) |

---

## AGENT OUTPUT CONTRACT

When processing this brief, the agent MUST:

1. Produce one complete `<bot-slug>.export.json` with a valid Dexie envelope.
2. Satisfy ALL checks in `docs/PERCHANCE_IMPORT_VERIFICATION.md` §Release Checklist.
3. Write the file to `bots/in-progress/<bot-slug>/<bot-slug>.export.json`.
4. Update `BOT_CATALOG.md` with status `in-progress`.
5. NOT output commentary in place of the file.
6. NOT leave TODOs, stubs, or placeholder text in the export.
7. NOT ask follow-up questions — infer from defaults if a field is missing.

---

## FIELD TYPE CONSTRAINTS

Every export field must use the exact primitive JSON type below. Using the wrong type causes Perchance import failures (`"Unregistered type"` errors). See `docs/EXPORT_FIELD_REFERENCE.md` §16 for full details.

| Brief Field | Export Field | Required JSON Type | Forbidden Types |
|---|---|---|---|
| `BOT_NAME` | `name` | string | number, null |
| `MODEL` | `modelName` | string | number, null |
| `TEMPERATURE` | `temperature` | number (finite) | string `"0.8"` |
| `MAX_TOKENS` | `maxTokensPerMessage` | number (finite) | string |
| `FOLDER_PATH` | `folderPath` | string | number, null |
| `UUID` | `uuid` | string or null | number |
| `ROLE_INSTRUCTION` | `roleInstruction` | string | number, null |
| `REMINDER_MESSAGE` | `reminderMessage` | string | number, null |
| `GENERAL_WRITING_INSTRUCTIONS` | `generalWritingInstructions` | string | number, null |
| `MAX_PARAGRAPHS_PER_MESSAGE` | `maxParagraphCountPerMessage` | number (finite) | string |
| — | `fitMessagesInContextMethod` | string | number, boolean |
| — | `autoGenerateMemories` | string | number, boolean |
| — | `streamingResponse` | boolean | number `0`/`1`, string |
| — | `creationTime` | number (finite, ms) | string, null |
| — | `lastMessageTime` | number (finite, ms) | string, null |
| `INITIAL_MESSAGES` | `initialMessages` | array | null |
| `SHORTCUT_BUTTONS` | `shortcutButtons` | array | null |
| `LORE_BOOK_URLS` | `loreBookUrls` | array | null |
| — | `customData` | object | null, array |
| — | `avatar` | object | null, array |
| — | `scene` | object | null, array |
| — | `userCharacter` | object | null, array |
| — | `systemCharacter` | object | null, array |
| — | `customCode` | string | number, null, object |
| button `autoSend` | `autoSend` | boolean | number, string |
| button `clearAfterSend` | `clearAfterSend` | boolean | number, string |
| button `insertionType` | `insertionType` | string (`"replace"`, `"prepend"`, `"append"`) | number |
| message `author` | `author` | string (`"user"`, `"ai"`, `"system"`) | number |
| message `content` | `content` | string | number, null |
| message `hiddenFrom` | `hiddenFrom` | array | string |
| message `expectsReply` | `expectsReply` | boolean | number, string |

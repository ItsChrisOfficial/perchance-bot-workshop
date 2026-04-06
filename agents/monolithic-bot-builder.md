# Monolithic Bot Builder — Agent Execution Spec

This document defines how an automated agent (GitHub Copilot Agent, Codex, or any AI coding agent) executes the monolithic bot creation workflow in this repository.

---

## Purpose

The monolithic builder converts a filled `CREATE_BOT_MONOLITHIC.md` brief into a complete, validated, import-ready Perchance JSON export **in a single agent session** — no back-and-forth, no partial outputs, no deferred validation.

---

## Trigger conditions

Execute the monolithic workflow when:

- A `BRIEF.md` or `CREATE_BOT_MONOLITHIC.md`-style document is referenced or pasted
- The user says "create a bot", "build a bot", "make a bot", "generate a bot", or equivalent
- A task says "from brief", "from spec", or "from this description"

If trigger conditions are met, skip all preamble and begin at Step 1.

---

## Execution steps

### Step 1 — Load brief

Read the brief. Extract every named field. For missing fields, apply defaults from `shared/prompts/CREATE_BOT_MONOLITHIC.md` §Field Defaults.

**Do not ask for clarification.** Missing optional fields → use defaults. Missing required fields → use the most reasonable inference and note it in `BRIEF.md`.

---

### Step 2 — Capability check (features only)

If any `FEATURES` field is `true`:

1. Open `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md`.
2. Verify the feature is marked feasible.
3. Open `docs/SNIPPET_SELECTION_GUIDE.md` and identify the correct snippet.
4. If combining multiple features, open `docs/COMMON_FAILURE_MODES.md` and check FM-09, FM-14, FM-17, FM-30–32 for conflicts.

If a feature is marked infeasible → skip it and note the skip in `BRIEF.md`.

---

### Step 3 — Build customCode

Compose the full `customCode` JavaScript as **normal source text** (not an escaped string).

#### Required structure

```js
(() => {
  // ── INIT ──────────────────────────────────────────────────
  oc.thread.customData ??= {};
  oc.character.customData ??= {};
  oc.character.customData.PUBLIC ??= {};

  // ── SNIPPET BLOCKS ────────────────────────────────────────
  // (one block per active feature, assembled from snippets/)

  // ── EXTRA CUSTOM CODE ─────────────────────────────────────
  // (CUSTOM_CODE_EXTRA field contents, if any)

  // ── EVENT LISTENERS ───────────────────────────────────────
  oc.thread.on("MessageAdded", async ({ message }) => {
    if (message.author !== "ai") return;
    // per-message processing...
  });
})();
```

#### Rules

- IIFE wrapper required for all non-trivial bots
- One initialization guard per namespace key
- No duplicate event listener registrations
- No debug logs in final output
- No dead handlers or TODO comments

---

### Step 4 — Assemble export object

Clone the envelope from `bots/templates/perchance-empty-minimal.json`.

Replace the character row with:

```json
{
  "name":                       "<BOT_NAME>",
  "roleInstruction":             "<ROLE_INSTRUCTION>",
  "reminderMessage":             "<REMINDER_MESSAGE>",
  "customCode":                  "<customCode as string>",
  "modelName":                   "<MODEL>",
  "temperature":                 <TEMPERATURE>,
  "maxTokensPerMessage":         <MAX_TOKENS>,
  "fitMessagesInContextMethod":  "summarizeOld",
  "autoGenerateMemories":        "none",
  "streamingResponse":           true,
  "initialMessages":             [...],
  "shortcutButtons":             [...],
  "loreBookUrls":                [...],
  "avatar":                      { "url": "<CHAR_AVATAR_URL>", "shape": "<CHAR_AVATAR_SHAPE>" },
  "scene":                       { "background": { "url": "<SCENE_BG_URL>" }, "music": { "url": "<SCENE_MUSIC_URL>", "volume": <VOLUME> } },
  "userCharacter":               { "name": "<USER_NAME>", "avatar": { "url": "<USER_AVATAR_URL>" } },
  "systemCharacter":             { "name": "System" },
  "customData":                  {},
  "generalWritingInstructions":  "<GENERAL_WRITING_INSTRUCTIONS>",
  "maxParagraphCountPerMessage": <MAX_PARAGRAPHS>,
  "messageWrapperStyle":         "<MESSAGE_WRAPPER_STYLE>",
  "messageInputPlaceholder":     "<MESSAGE_INPUT_PLACEHOLDER>",
  "metaTitle":                   "<META_TITLE>",
  "metaDescription":             "<META_DESCRIPTION>",
  "metaImage":                   "<META_IMAGE_URL>",
  "folderPath":                  "<FOLDER_PATH>",
  "uuid":                        "<UUID or crypto.randomUUID()>",
  "creationTime":                <Date.now()>,
  "lastMessageTime":             <Date.now()>
}
```

Set `data.tables[0].rowCount = 1`.

---

### Step 5 — Serialize

Serialize the full export object with `JSON.stringify(exportObj, null, 2)`.

**Never hand-assemble JSON strings.** Never concatenate raw JS into a JSON string value.

---

### Step 6 — Validate

Run through `docs/PERCHANCE_IMPORT_VERIFICATION.md` §Release Checklist sections A–G:

- [ ] JSON parses
- [ ] `formatName === "dexie"`, `formatVersion === 1`
- [ ] `databaseName === "chatbot-ui-v1"`, `databaseVersion === 90`
- [ ] All 9 canonical tables present
- [ ] `rowCount` matches `rows.length` for every table
- [ ] Character row has all required fields
- [ ] `initialMessages` is an array
- [ ] `shortcutButtons` is an array
- [ ] `customCode` is a non-empty string (if bot uses custom behavior)
- [ ] Extracted `customCode` passes JS syntax check
- [ ] All seeded messages have valid `author` and string `content`
- [ ] All shortcut buttons have valid `insertionType`

If any check fails → fix before writing output.

---

### Step 7 — Write output files

```
bots/in-progress/<bot-slug>/
├── <bot-slug>.export.json   ← the complete importable export
└── BRIEF.md                 ← filled brief + any agent notes
```

Update `BOT_CATALOG.md`: add a row with `status: in-progress`.

---

### Step 8 — Stop

Do not output the JSON as a chat code block.  
Do not explain what you did after writing the files.  
Do not ask "would you like me to also...".  
The files ARE the deliverable.

---

## Error handling

| Situation | Action |
|---|---|
| Required field missing, cannot infer | Use `"[UNSET]"` as placeholder, write a warning to `BRIEF.md`, complete the rest of the export |
| Feature infeasible per capability matrix | Skip the feature, note it in `BRIEF.md` |
| Snippet conflict detected (FM-09, FM-14, etc.) | Pick the most compatible option, note the conflict in `BRIEF.md` |
| customCode fails JS syntax check | Fix the syntax before writing the export |
| Approaching session timeout (55 min) | Commit what is done as a PR; document remaining work in PR description |

---

## Quick validation script

```bash
node scripts/validate-perchance-export.js bots/in-progress/<bot-slug>/<bot-slug>.export.json
python -m unittest tests/test-validate-perchance-export.py
```

Run both before marking a bot ready for promotion review.

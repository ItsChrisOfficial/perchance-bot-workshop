---
applyTo: "shared/prompts/**,bots/in-progress/**"
---

# Monolithic Prompt Creation — Path-Scoped Agent Instructions

Applies when working inside `shared/prompts/` or creating new bots from a monolithic brief.

---

## What is a monolithic prompt?

A monolithic prompt is a single, self-contained brief that contains **everything** the agent needs to produce a complete, validated, import-ready Perchance JSON export in **one pass** — with no follow-up questions, no partial outputs, and no separate validation step.

The canonical brief schema lives at: `shared/prompts/CREATE_BOT_MONOLITHIC.md`

---

## Agent execution contract for monolithic creation

When given a filled brief (or enough user input to infer all required fields):

### Step 1 — Parse the brief

Extract every field from the `## BOT BRIEF` section. For any field left blank or omitted, apply the default from `shared/prompts/CREATE_BOT_MONOLITHIC.md` §Field Defaults.

### Step 2 — Select snippets (optional features)

If the brief requests features from the FEATURES section:

- Check `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` — confirm the feature is realistic
- Check `docs/SNIPPET_SELECTION_GUIDE.md` — pick the right snippet
- Check `docs/COMMON_FAILURE_MODES.md` — FM-09, FM-14, FM-17, FM-30–32 for multi-snippet conflicts

### Step 3 — Build customCode as JS source

Write the JavaScript as normal source code. Do NOT write it as an escaped JSON string yet.

Structure:
```js
(() => {
  // --- INIT ---
  oc.thread.customData ??= {};
  oc.character.customData ??= {};
  oc.character.customData.PUBLIC ??= {};

  // --- FEATURE CODE ---
  // (snippets assembled here)

  // --- EVENT LISTENERS ---
  oc.thread.on("MessageAdded", async ({ message }) => {
    // ...
  });
})();
```

### Step 4 — Assemble the export object

Clone the structure of `bots/templates/perchance-empty-minimal.json`. Replace character row values. Attach `customCode` as a string. Set `creationTime` and `lastMessageTime` to `Date.now()`.

### Step 5 — Serialize to JSON

Use a JSON serializer. Never hand-escape.

### Step 6 — Parse back and verify

Run the `docs/PERCHANCE_IMPORT_VERIFICATION.md` §Release Checklist mentally (or via the validator script).

### Step 7 — Write output

Write to: `bots/in-progress/<bot-name>/<bot-name>.export.json`

Write companion: `bots/in-progress/<bot-name>/BRIEF.md`

Update: `BOT_CATALOG.md` (add entry with status `in-progress`)

### Step 8 — Stop

Do not emit commentary after the file is written. The file IS the deliverable.

---

## Speed contract

The entire Steps 1–8 must complete in a **single agent response**. If the agent cannot complete the full export in one pass, it must write what it has (clearly marked incomplete) and document exactly what remains.

---

## What NOT to do

- Do NOT output the JSON as a code block in the chat and call it done — write it to the file
- Do NOT ask "should I also add X?" — if X is in the brief, build it; if not, skip it
- Do NOT leave placeholder comments like `// TODO: add personality` in the export
- Do NOT output a bare character object without the Dexie envelope
- Do NOT hand-assemble JSON by concatenating strings

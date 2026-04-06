---
applyTo: "bots/**"
---

# Bot Workspace — Path-Scoped Agent Instructions

Applies to all files under `bots/`.

---

## Placement contract

| Folder | Purpose | Rule |
|---|---|---|
| `bots/templates/` | Canonical starter exports | Never modify unless improving the baseline template |
| `bots/in-progress/<bot-name>/` | Active bot work | All new work starts here |
| `bots/completed/<bot-name>/` | Release-ready bots | Only promote after passing all validation gates |

**Never put active drafts in `bots/completed/`.** Never write directly to `bots/templates/` as part of a bot-creation task.

---

## New bot checklist (in-progress)

When creating a new bot under `bots/in-progress/<bot-name>/`:

- [ ] Start from `bots/templates/perchance-empty-minimal.json` — do NOT invent a new envelope shape
- [ ] Name the export file `<bot-name>.export.json`
- [ ] Include a `BRIEF.md` documenting the bot's design intent (copy from `docs/BOT_DESIGN_BRIEF_TEMPLATE.md`)
- [ ] `customCode` must be valid JS — write source first, serialize into JSON
- [ ] All `initialMessages` entries must be proper message objects (not transcript text)
- [ ] All `shortcutButtons` entries must have all 5 required fields
- [ ] `rowCount` in `data.tables` must match `rows.length` in `data.data`
- [ ] Run `node scripts/validate-perchance-export.js bots/in-progress/<bot-name>/<bot-name>.export.json`

---

## Promotion gate (in-progress → completed)

Only promote when ALL are true:

1. `node scripts/validate-perchance-export.js` passes
2. `python -m unittest tests/test-validate-perchance-export.py` passes
3. `docs/PERCHANCE_IMPORT_VERIFICATION.md` release checklist is satisfied
4. `BOT_CATALOG.md` updated with new lifecycle state
5. `REPO_MAP.md` updated if folder structure changed

---

## Monolithic build shortcut

If a filled `shared/prompts/CREATE_BOT_MONOLITHIC.md` brief exists, the agent should:

1. Parse all brief fields
2. Build the complete export in one pass
3. Write to `bots/in-progress/<bot-name>/<bot-name>.export.json`
4. Write `bots/in-progress/<bot-name>/BRIEF.md` summarizing the design
5. Validate immediately — do not wait for a separate validation step

---

## Output discipline for bot files

- Export files must be complete, parseable JSON — never leave TODOs in the exported artifact
- `customCode` must not contain dead handlers, stubs, or debug logs in release output
- Do not create additional files (helpers, utilities) inside `bots/in-progress/<bot-name>/` — shared logic belongs in `shared/`

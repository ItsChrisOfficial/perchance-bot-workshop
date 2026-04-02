# Issue Intake Templates

Ready-to-use issue templates for this repository. Because GitHub issue template files require `.github/ISSUE_TEMPLATE/` (a new folder), these templates are stored here for direct copy-paste into issues or for later migration to that folder structure.

Each template below includes title guidance, required fields, optional fields, examples of good and bad submissions, and field descriptions.

---

## Template 1: Bug Report

### Title format

`[BUG] <short description of what is broken>`

**Good:** `[BUG] Validator accepts exports with missing textCompressionCache table`  
**Bad:** `[BUG] it doesn't work`

### Required fields

**Affected file or area:**  
Which file, script, snippet, or workflow is broken? Use repo-relative paths.  
Example: `scripts/validate-perchance-export.js`, `snippets/custom-code/prompting/prompting-context-packer.js`

**Steps to reproduce:**  
Numbered list of actions that trigger the bug.  
1. Start from `bots/templates/perchance-empty-minimal.json`
2. Remove the `textCompressionCache` table from `data.tables`
3. Run `node scripts/validate-perchance-export.js <file>`
4. Expected: validator fails with missing table error
5. Actual: validator passes with no errors

**Expected behavior:**  
What should happen.

**Actual behavior:**  
What actually happens. Include error messages verbatim.

**Environment:**  
Node.js version, Python version, OS, browser (if runtime issue).

### Optional fields

**Export JSON snippet:** Attach or paste the relevant portion of the export JSON (sanitize any personal content).  
**Console output:** Full error output from validator or browser console.  
**Related docs:** Link to the verification standard or doc that defines expected behavior.

### What makes a bad bug report

- No reproduction steps ("it's broken")
- No affected file or area specified
- Describing the desired feature instead of the actual bug
- Reporting a runtime behavior issue as an export validation bug (or vice versa)

### What makes a useful bug report

- Exact file path and line number if known
- Minimal reproduction case (ideally a single JSON file that triggers the bug)
- Expected vs actual behavior clearly separated
- Relevant validator or console output pasted in full
- Reference to which verification check should have caught it (e.g., "Section B of `docs/PERCHANCE_IMPORT_VERIFICATION.md`")

---

## Template 2: Snippet Request

### Title format

`[SNIPPET] <what the snippet should do>`

**Good:** `[SNIPPET] Debounced auto-save for thread customData`  
**Bad:** `[SNIPPET] new snippet`

### Required fields

**Category:**  
Which snippet category does this belong to? One of: `transformations`, `prompting`, `ui-ux`, `pregeneration`, `ai-response`.

**Goal:**  
What should the snippet accomplish? Be specific about the Perchance customCode behavior.  
Example: "Auto-save `oc.thread.customData` to `oc.character.customData` every 30 seconds, debounced to avoid excessive writes."

**API surfaces touched:**  
Which `oc.*` methods or properties will the snippet use?  
Example: `oc.thread.customData`, `oc.character.customData`, `setInterval`

**Offline-safe:**  
Does this snippet need network access? Yes/No.

**Modifies:**  
What does the snippet modify? (messages, UI, state, prompts, none)

### Optional fields

**Existing snippets to build on:** Which current snippets (if any) are similar?  
**Sketch/pseudocode:** Rough idea of the approach.  
**Conflict concerns:** Will this snippet conflict with existing ones? (e.g., "This also writes to `reminderMessage`, which conflicts with `prompting-dynamic-reminder-router.js`")

### What makes a bad snippet request

- Requesting a complete bot instead of a reusable fragment
- No clear category assignment
- Requesting functionality that already exists in the snippet library (check `SNIPPETS_INDEX.md` first)
- Requesting a snippet that requires a specific character name or hardcoded settings

### What makes a useful snippet request

- Clear single-purpose goal
- Identified API surfaces and modification scope
- Checked `SNIPPETS_INDEX.md` and `docs/SNIPPET_SELECTION_GUIDE.md` for existing alternatives
- Noted potential conflicts with existing snippets
- Follows snippet conventions from `snippets/README.md` (IIFE, init guard, namespace, theme-aware)

---

## Template 3: Bot Request

### Title format

`[BOT] <bot name or purpose>`

**Good:** `[BOT] Interactive cooking recipe assistant with ingredient tracking`  
**Bad:** `[BOT] cool bot idea`

### Required fields

**Bot purpose:**  
One paragraph describing what the bot does and who it is for.  
Example: "A cooking assistant that tracks ingredients the user mentions, suggests recipes based on available ingredients, and adjusts portion sizes. Targeted at casual home cooks."

**Core behavior:**  
List 3-5 key behaviors the bot must have.  
1. Track ingredients mentioned in conversation
2. Suggest recipes when asked
3. Adjust portion sizes based on user-specified serving count
4. Remember dietary restrictions across the thread

**Snippet candidates:**  
Which existing snippets could support this bot? Check `docs/SNIPPET_SELECTION_GUIDE.md` and `SNIPPETS_INDEX.md`.  
Example: `transforms-state-safe-init-guard.js` (ingredient tracking state), `prompting-slash-command-interpreter.js` (/recipe, /ingredients commands), `ui-shortcut-button-orchestrator.js` (quick-action buttons)

**Starting template:**  
Which export template to start from? Default: `bots/templates/perchance-empty-minimal.json`.

### Optional fields

**Design brief:** If you have a filled-out design brief per `docs/BOT_DESIGN_BRIEF_TEMPLATE.md`, attach or link it.  
**Tone/voice notes:** How should the bot sound?  
**Image behavior:** Should the bot generate images? What kind?  
**State model:** What state needs to persist across messages?  
**UI needs:** Any custom panels, modals, or buttons needed?

### What makes a bad bot request

- No clear purpose ("make a bot that does everything")
- No snippet candidates identified (didn't check the library)
- Requesting behavior that isn't realistic in Perchance customCode (check `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md`)
- No starting template specified

### What makes a useful bot request

- Clear, scoped purpose with 3-5 concrete behaviors
- Snippet candidates identified from the existing library
- Feasibility confirmed against `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md`
- Starting template selected
- State model and UI needs outlined
- Known risks or limitations noted

---

## Template 4: Documentation Improvement Request

### Title format

`[DOCS] <which doc and what improvement>`

**Good:** `[DOCS] EXPORT_FIELD_REFERENCE.md missing loreBookUrls field details`  
**Bad:** `[DOCS] docs need updating`

### Required fields

**Affected document:**  
Repo-relative path to the document.  
Example: `docs/EXPORT_FIELD_REFERENCE.md`

**What is wrong or missing:**  
Specific description of the gap, error, or improvement needed.  
Example: "The `loreBookUrls` field is listed in the character row section but has no type, scope, or caveats documented. The field reference for `imagePromptTriggers` is also incomplete — it doesn't explain the expected format."

**Proposed fix:**  
What should the document say instead? Include specific text if possible.

### Optional fields

**Source of truth:** Where did you find the correct information? (Perchance docs, testing, export inspection)  
**Related docs affected:** Will fixing this require updates to other docs?

### What makes a bad docs request

- "The docs are confusing" (no specific file or section)
- Requesting docs for features that don't exist in this repo
- Requesting a complete rewrite when a targeted fix would suffice

### What makes a useful docs request

- Exact file path and section/heading identified
- Specific text that is wrong or missing
- Proposed replacement text included
- Source of truth cited (e.g., "Tested with Perchance import on 2026-04-01")
- Related doc impacts noted

---

## Template 5: Repo/Usability Improvement Request

### Title format

`[REPO] <what improvement>`

**Good:** `[REPO] Add pre-commit hook to run validator on changed export files`  
**Bad:** `[REPO] make it better`

### Required fields

**Area affected:**  
Which part of the repo workflow or structure is affected?  
Example: CI pipeline, validation scripts, folder structure, index files, snippet conventions

**Current behavior:**  
What happens now that is suboptimal?  
Example: "Contributors must manually run `node scripts/validate-perchance-export.js` on each changed export file. There is no pre-commit hook or CI step that runs the validator automatically on changed files only."

**Proposed improvement:**  
What should happen instead? Be specific and actionable.  
Example: "Add a pre-commit hook using husky that detects changed `.json` files in `bots/` and runs the validator on each. This prevents invalid exports from being committed."

**Impact:**  
Who benefits and how?  
Example: "All contributors who modify export files. Reduces the chance of invalid exports being merged."

### Optional fields

**Implementation sketch:** How would you implement this?  
**Affected files:** Which existing files would need changes?  
**Breaking changes:** Would this break any existing workflow?

### What makes a bad repo improvement request

- Vague scope ("make the repo better organized")
- Requesting changes that violate `PROJECT_RULES.md` (e.g., new top-level folders)
- Requesting changes that duplicate existing functionality
- No clear benefit statement

### What makes a useful repo improvement request

- Specific area and current behavior described
- Concrete proposed improvement with clear benefit
- Checked `PROJECT_RULES.md` and `REPO_MAP.md` for compatibility
- Implementation sketch or affected files listed
- Breaking change risk assessed

---

## Migration Notes

To convert these templates into GitHub Issue Templates:

1. Create `.github/ISSUE_TEMPLATE/` directory.
2. For each template above, create a YAML file (e.g., `bug-report.yml`, `snippet-request.yml`).
3. Convert the fields into GitHub Issue Form fields using the `type: input`, `type: textarea`, `type: dropdown` syntax.
4. Set `required: true` on the required fields.
5. Add the title prefix as the `title` default in each template.
6. Test by creating a new issue and selecting the template.

Until that migration happens, contributors should copy the relevant template above into their issue body and fill in the fields.

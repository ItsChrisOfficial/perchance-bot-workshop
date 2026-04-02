# Common Failure Modes

Practical failure reference for Perchance AI Character Chat customCode development.  
Each entry documents what goes wrong, why, and how to fix it.

---

## How to use this document

1. If something is broken, scan the **Symptoms** lines for what you see.
2. Read **Likely cause** and **How to fix** for immediate action.
3. Read **Prevention** to avoid recurrence.
4. Follow **Related references** for deeper context.

---

## 1 — Event & Listener Failures

### FM-01: Duplicate event listeners

**Symptoms:** AI messages processed twice; duplicate system messages injected; shortcut buttons doubled.  
**Likely cause:** `customCode` re-executes on page reload or thread switch without checking if listeners already exist.  
**How to detect:** Add a counter log in the handler; if it fires 2× per message, listeners are doubled.  
**How to fix:** Add an init guard at the top of the snippet:
```js
if (window.__pcbw_myfeature_init) return;
window.__pcbw_myfeature_init = true;
```
**Prevention:** Every snippet must use a unique `window.__pcbw_*_init` flag. All repo snippets already follow this pattern.  
**Related:** `snippets/README.md` (conventions), `transforms-state-safe-init-guard.js`

### FM-02: Duplicate setInterval timers

**Symptoms:** Periodic actions (context packing, reminders) run faster and faster over time; performance degrades.  
**Likely cause:** `setInterval` called without clearing previous interval on re-init.  
**How to detect:** Check `console.log` frequency; if it accelerates, timers are stacking.  
**How to fix:** Store the interval ID and `clearInterval` before setting a new one, or gate behind init guard.  
**Prevention:** Always pair `setInterval` with a stored ID and cleanup path. Use init guards.  
**Related:** `prompting-context-packer.js`, `prompting-dynamic-reminder-router.js`

### FM-03: Event listener ordering issues

**Symptoms:** Post-processor runs before classifier; state machine reads stale data; UI updates lag behind state.  
**Likely cause:** Multiple snippets register `MessageAdded` handlers but execution order depends on registration order.  
**How to detect:** Log timestamps at the start of each handler to see execution sequence.  
**How to fix:** Control snippet paste order (later paste = later handler). Or use a single coordinator handler that calls sub-handlers in defined order.  
**Prevention:** Document intended load order when combining snippets. See `docs/REUSABLE_PATTERN_RECIPES.md`.  
**Related:** `ai-response-postprocessor.js`, `prompting-last-message-classifier.js`

### FM-04: StreamingMessage handler blocking

**Symptoms:** UI freezes during AI response; stream appears to stall; browser tab becomes unresponsive.  
**Likely cause:** Heavy synchronous work (DOM manipulation, regex on long text) inside `StreamingMessage` handler, which fires many times per second.  
**How to detect:** Add `performance.now()` timing inside handler; if > 16ms per call, it will visibly lag.  
**How to fix:** Debounce the handler (e.g., only run every 200ms) or defer heavy work to `MessageAdded`.  
**Prevention:** Keep `StreamingMessage` handlers lightweight. Batch DOM updates.  
**Related:** `ai-response-stream-monitor.js`

---

## 2 — State & Data Failures

### FM-05: customData namespace collisions

**Symptoms:** One snippet's state overwrites another's; bot behavior becomes erratic after adding a second snippet.  
**Likely cause:** Two snippets use the same `oc.thread.customData` key (e.g., both use `state` or `mode`).  
**How to detect:** Log `JSON.stringify(oc.thread.customData)` and check for unexpected key overwrites.  
**How to fix:** Prefix all customData keys with `__pcbw_snippetname_`. Repo convention uses `__pcbw_` prefix.  
**Prevention:** Follow the `__pcbw_` namespacing convention. Check existing keys before adding new ones.  
**Related:** `transforms-state-safe-init-guard.js`, `snippets/README.md`

### FM-06: Missing customData initialization

**Symptoms:** `TypeError: Cannot read properties of undefined` on first message in a new thread.  
**Likely cause:** Code accesses `oc.thread.customData.someKey` without first ensuring `oc.thread.customData` exists.  
**How to detect:** Open a fresh thread and send a message; error appears immediately.  
**How to fix:** Add `oc.thread.customData ||= {};` before any access.  
**Prevention:** Every snippet should initialize customData defensively. Use `transforms-state-safe-init-guard.js` pattern.  
**Related:** `transforms-state-safe-init-guard.js`

### FM-07: Non-serializable values in customData

**Symptoms:** State appears to save but is lost on reload; `undefined` replaces complex objects.  
**Likely cause:** Storing functions, DOM elements, or circular references in `customData` which cannot survive JSON serialization.  
**How to detect:** Compare `oc.thread.customData` before and after a page reload.  
**How to fix:** Store only JSON-safe primitives, arrays, and plain objects. Convert complex objects to serializable form.  
**Prevention:** Test state persistence across page reloads during development.  
**Related:** `transforms-character-state-machine.js`

### FM-08: Thread vs character customData confusion

**Symptoms:** State resets when switching threads; or state bleeds across threads unexpectedly.  
**Likely cause:** Using `oc.character.customData` when thread-specific state was intended, or vice versa.  
**How to detect:** Switch threads and check if state follows (character-level) or resets (thread-level).  
**How to fix:** Use `oc.thread.customData` for per-thread state. Use `oc.character.customData` for character-wide settings. Use `oc.character.customData.PUBLIC` for share-persistent state.  
**Prevention:** Decide scope before implementation. Document in design brief.  
**Related:** `docs/EXPORT_FIELD_REFERENCE.md`, `docs/BOT_DESIGN_BRIEF_TEMPLATE.md`

---

## 3 — Prompt & Message Failures

### FM-09: Reminder message overwrites

**Symptoms:** Bot personality/behavior changes abruptly; expected reminders disappear.  
**Likely cause:** Multiple snippets write to `oc.character.reminderMessage`, and the last writer wins.  
**How to detect:** Log `oc.character.reminderMessage` after each snippet initializes.  
**How to fix:** Designate exactly one snippet as the reminder owner. Other snippets must not write to `reminderMessage`.  
**Prevention:** Check `docs/COMMON_FAILURE_MODES.md` FM-09 and `docs/REUSABLE_PATTERN_RECIPES.md` before composing snippets that touch reminders.  
**Related:** `prompting-dynamic-reminder-router.js`, `transforms-mode-switcher.js`

### FM-10: Hidden system message abuse / context exhaustion

**Symptoms:** AI responses become generic or confused; responses ignore recent conversation; token limit errors.  
**Likely cause:** Too many hidden system messages injected, consuming the context window and pushing real conversation out.  
**How to detect:** Count messages with `hiddenFrom: ["user"]` in `oc.thread.messages`. If > 10-15, context is likely saturated.  
**How to fix:** Limit injection frequency. Remove old injected messages. Use `prompting-context-packer.js` to summarize instead of accumulating.  
**Prevention:** Set a max injection count. Implement cleanup for old hidden messages.  
**Related:** `prompting-hidden-system-injector.js`, `prompting-context-packer.js`

### FM-11: Message mutation loops

**Symptoms:** Messages keep changing; infinite processing; browser tab hangs.  
**Likely cause:** A `MessageAdded` handler modifies a message, which triggers another `MessageAdded` event, creating a loop.  
**How to detect:** Log handler entry; if it fires continuously, a loop exists.  
**How to fix:** Use a processed flag: `if (msg.customData?.__pcbw_processed) return;` then set it after processing.  
**Prevention:** Always mark messages as processed before modifying them. Check for the flag at handler entry.  
**Related:** `ai-response-postprocessor.js`, `ai-response-regeneration-guard.js`

### FM-12: Prompt bloat from unchecked appending

**Symptoms:** Responses slow down; AI ignores instructions; token costs increase.  
**Likely cause:** Snippets append to roleInstruction or reminderMessage without length checks, growing them indefinitely.  
**How to detect:** Log `oc.character.roleInstruction.length` periodically; if it grows over time, something is appending.  
**How to fix:** Never append to static instruction fields at runtime. Use hidden system messages or reminder routing instead.  
**Prevention:** Treat `roleInstruction` as read-only at runtime. Use `reminderMessage` for dynamic context.  
**Related:** `prompting-dynamic-reminder-router.js`, `docs/EXPORT_FIELD_REFERENCE.md`

### FM-13: initialMessages clobbering

**Symptoms:** Thread starts with wrong messages; initial greeting is missing or duplicated.  
**Likely cause:** `prebake-initial-message-seeder.js` overwrites `initialMessages` array instead of merging, or runs after another snippet already set it.  
**How to detect:** Check `oc.character.initialMessages` after init; compare to expected.  
**How to fix:** Have only one snippet own `initialMessages`. Merge carefully if multiple sources needed.  
**Prevention:** Designate initial message ownership in design brief.  
**Related:** `prebake-initial-message-seeder.js`, `docs/EXPORT_FIELD_REFERENCE.md`

---

## 4 — UI & Rendering Failures

### FM-14: wrapperStyle conflicts

**Symptoms:** Message styling is inconsistent; styles flash or change unexpectedly between messages.  
**Likely cause:** Multiple snippets write to message `wrapperStyle` property and overwrite each other.  
**How to detect:** Inspect message objects; check if `wrapperStyle` values change between renders.  
**How to fix:** Designate one snippet as wrapperStyle owner. Others can append but not replace.  
**Prevention:** Only one snippet should own `wrapperStyle`. See `ui-theme-adaptive-message-style.js` caveats.  
**Related:** `ui-theme-adaptive-message-style.js`, `transforms-runtime-theme-shift.js`

### FM-15: iframe visibility confusion

**Symptoms:** Custom UI panel appears when it should be hidden; or never appears at all; blank space visible.  
**Likely cause:** `oc.window.show()` called at init but UI content not yet injected; or `oc.window.hide()` never called after panel dismissed.  
**How to detect:** Check iframe visibility state vs expected state after each user action.  
**How to fix:** Call `oc.window.hide()` at init, inject UI HTML, then `oc.window.show()` only when user triggers it. Always `oc.window.hide()` on dismiss.  
**Prevention:** Default to hidden. Show only on explicit user action.  
**Related:** All `ui-*.js` snippets, `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md`

### FM-16: messageRenderingPipeline errors

**Symptoms:** Messages render as raw text or with missing formatting; console shows errors from rendering pipeline.  
**Likely cause:** A function pushed to `oc.messageRenderingPipeline` throws an exception, breaking the pipeline.  
**How to detect:** Wrap pipeline functions in try/catch and log errors.  
**How to fix:** Always wrap pipeline functions: `oc.messageRenderingPipeline.push(fn => { try { /* transform */ } catch(e) { console.error(e); } return fn; });`  
**Prevention:** Every pipeline function must be error-handled independently.  
**Related:** `preformat-message-html-sanitizer.js`, `preformat-roleplay-layout-normalizer.js`

### FM-17: shortcutButtons replacement conflicts

**Symptoms:** Buttons appear then disappear; wrong buttons shown after state change; buttons flicker.  
**Likely cause:** Multiple snippets assign to `oc.thread.shortcutButtons = [...]`, and the last assignment wins.  
**How to detect:** Log `oc.thread.shortcutButtons` after each snippet init.  
**How to fix:** Use `ui-shortcut-button-orchestrator.js` as single owner. Other snippets register buttons through it rather than directly.  
**Prevention:** One snippet owns `shortcutButtons`. Others contribute through it.  
**Related:** `ui-shortcut-button-orchestrator.js`, `transforms-mode-switcher.js`

### FM-18: CSS theme clashes with host page

**Symptoms:** Custom UI looks wrong in dark mode; colors unreadable; borders invisible.  
**Likely cause:** Hardcoded light-mode colors used instead of `light-dark()` CSS function.  
**How to detect:** Toggle between light and dark mode in the Perchance chat interface.  
**How to fix:** Replace all hardcoded colors with `light-dark(lightValue, darkValue)`.  
**Prevention:** Repo convention requires `light-dark()` for all CSS. See `snippets/README.md`.  
**Related:** `ui-theme-adaptive-message-style.js`, `docs/STYLING_RECIPES.md`

---

## 5 — Network & External Failures

### FM-19: Pyodide load failure

**Symptoms:** Python code blocks not executed; "Pyodide not available" errors; long initial delay followed by silent failure.  
**Likely cause:** CDN unreachable, slow connection, or JSPI crash on Chrome/Edge.  
**How to detect:** Check console for Pyodide loading errors. Monitor network tab for failed CDN requests.  
**How to fix:** Use guarded loading pattern from `ai-response-pyodide-runner-guarded.js`. Show user-facing feedback during load. Provide graceful fallback when Pyodide is unavailable.  
**Prevention:** Always treat Pyodide as optional. Never make core bot functionality depend on it.  
**Related:** `ai-response-pyodide-runner-guarded.js`, `docs/PYODIDE_COMPATIBILITY_NOTES.md`

### FM-20: LLM call failures in event handlers

**Symptoms:** AI message post-processing silently skipped; classification badges missing; style enforcement not applied.  
**Likely cause:** `oc.getInstructCompletion()` fails (rate limit, network, timeout) and the error is not caught.  
**How to detect:** Wrap calls in try/catch and log failures.  
**How to fix:** Always wrap LLM calls: `try { result = await oc.getInstructCompletion({...}); } catch(e) { console.error("LLM call failed:", e); }`  
**Prevention:** Every LLM-dependent snippet must have error handling and a sensible default when the call fails.  
**Related:** `prompting-response-style-enforcer.js`, `prompting-last-message-classifier.js`, `transforms-character-state-machine.js`

### FM-21: Asset preload failures

**Symptoms:** Images show broken icons; audio doesn't play; scene backgrounds missing.  
**Likely cause:** Asset URLs are unreachable, CORS-blocked, or the URLs in config are stale/incorrect.  
**How to detect:** Check browser network tab for 404 or CORS errors on asset URLs.  
**How to fix:** Validate URLs before deploying. Use fallback assets. Handle `onerror` on Image/Audio objects.  
**Prevention:** Test all asset URLs. Use CORS-friendly hosting. Provide fallback defaults.  
**Related:** `prewarm-image-cache.js`, `prewarm-audio-cache.js`, `prewarm-scene-assets.js`

### FM-22: CORS blocking on external resources

**Symptoms:** Fetch calls fail silently; images fail to load into canvas; audio refuses to play.  
**Likely cause:** External resources served without appropriate CORS headers.  
**How to detect:** Browser console shows CORS errors.  
**How to fix:** Use CORS-friendly hosting (e.g., CDN with proper headers). For images, use `crossOrigin` attribute.  
**Prevention:** Test external resource loading in the actual Perchance environment, not just locally.  
**Related:** `prewarm-image-cache.js`, `prebake-image-prompt-builder.js`

---

## 6 — Export & Serialization Failures

### FM-23: Export-valid but runtime-broken code

**Symptoms:** Export JSON passes validator; imports successfully; but customCode throws errors at runtime.  
**Likely cause:** JavaScript is syntactically valid but has logic errors (wrong API calls, missing dependencies, wrong event names).  
**How to detect:** Open the imported bot, start a conversation, and check browser console for errors.  
**How to fix:** Test runtime behavior after import, not just validation. The validator checks syntax, not logic.  
**Prevention:** Always test in actual Perchance environment after validation passes.  
**Related:** `scripts/validate-perchance-export.js`, `docs/PERCHANCE_IMPORT_VERIFICATION.md`

### FM-24: rowCount mismatch

**Symptoms:** Import fails silently or produces corrupted data; validator reports rowCount error.  
**Likely cause:** `data.tables[n].rowCount` doesn't match `data.data[n].rows.length`.  
**How to detect:** Run `node scripts/validate-perchance-export.js <file>`.  
**How to fix:** Update `rowCount` to match actual `rows.length` for every table.  
**Prevention:** Serialize programmatically. Never hand-edit rowCount values.  
**Related:** `docs/PERCHANCE_IMPORT_VERIFICATION.md`, `scripts/validate-perchance-export.js`

### FM-25: customCode double-escaping

**Symptoms:** Backslashes appear in runtime code; strings contain literal `\n` text instead of newlines; regex patterns break.  
**Likely cause:** JSON-serializing customCode that was already JSON-escaped, producing double-escaped content.  
**How to detect:** Parse the export JSON and inspect `customCode` string; if it contains `\\n` or `\\"`, it's double-escaped.  
**How to fix:** Write JavaScript as plain source. Serialize the entire export object once with `JSON.stringify()`. Do not pre-escape.  
**Prevention:** Follow the safe generation pattern in `docs/PERCHANCE_IMPORT_VERIFICATION.md`.  
**Related:** `docs/PERCHANCE_IMPORT_VERIFICATION.md`

### FM-26: Bare character JSON (missing export envelope)

**Symptoms:** Perchance import dialog rejects the file; no error detail given.  
**Likely cause:** Export file contains only the character object, not the full Dexie export envelope with `formatName`, `formatVersion`, `data.tables`, etc.  
**How to detect:** Check if root has `formatName: "dexie"`. If not, envelope is missing.  
**How to fix:** Wrap character data in full export envelope. Start from `bots/templates/perchance-empty-minimal.json`.  
**Prevention:** Always start from a template. Never output bare character JSON.  
**Related:** `bots/templates/perchance-empty-minimal.json`, `docs/PERCHANCE_IMPORT_VERIFICATION.md`

### FM-27: Missing canonical tables

**Symptoms:** Import appears to succeed but features are broken; validator reports missing tables.  
**Likely cause:** Export was hand-assembled and omitted one or more of the 9 canonical tables.  
**How to detect:** Run `node scripts/validate-perchance-export.js <file>`.  
**How to fix:** Include all 9 tables: characters, threads, messages, misc, summaries, memories, lore, textEmbeddingCache, textCompressionCache.  
**Prevention:** Start from `bots/templates/perchance-empty-minimal.json` which includes all tables.  
**Related:** `docs/PERCHANCE_IMPORT_VERIFICATION.md`, `bots/templates/perchance-empty-minimal.json`

### FM-28: Template literal escaping in customCode

**Symptoms:** Export JSON is invalid; parser chokes on backtick strings; or template literals render wrong at runtime.  
**Likely cause:** Template literals with `${expressions}` inside customCode are not properly handled during JSON serialization.  
**How to detect:** Parse the export JSON; if it fails, check customCode for unescaped backticks or `${` sequences.  
**How to fix:** Use `JSON.stringify()` to serialize the export object—it handles template literal escaping automatically.  
**Prevention:** Never hand-escape customCode. Serialize programmatically.  
**Related:** `docs/PERCHANCE_IMPORT_VERIFICATION.md`

---

## 7 — Snippet Composition Failures

### FM-29: Snippet load order conflicts

**Symptoms:** Later snippets reference state not yet initialized; UI elements not ready when handlers fire.  
**Likely cause:** Snippets pasted in wrong order; dependent snippet runs before its prerequisite.  
**How to detect:** Check console for `undefined` errors on first load; reorder snippets and test.  
**How to fix:** Paste foundation snippets first (init guard, state machine), then behavior snippets (prompting, transforms), then UI snippets last.  
**Prevention:** Follow composition order guidance in `docs/REUSABLE_PATTERN_RECIPES.md`.  
**Related:** `docs/REUSABLE_PATTERN_RECIPES.md`, `transforms-state-safe-init-guard.js`

### FM-30: Conflicting shortcutButtons ownership

**Symptoms:** Buttons from one snippet disappear when another snippet initializes; button sets are incomplete.  
**Likely cause:** Multiple snippets assign `oc.thread.shortcutButtons = [newButtons]` instead of appending.  
**How to detect:** Check which snippets write to `shortcutButtons`; if more than one uses `=` assignment, they conflict.  
**How to fix:** Use `ui-shortcut-button-orchestrator.js` as single owner. Register buttons through its API.  
**Prevention:** Designate one snippet for button management in the design brief.  
**Related:** `ui-shortcut-button-orchestrator.js`, `transforms-mode-switcher.js`

### FM-31: Conflicting wrapperStyle ownership

**Symptoms:** Message styles are inconsistent; some messages styled by one snippet, some by another; style flickers.  
**Likely cause:** Both `ui-theme-adaptive-message-style.js` and `transforms-runtime-theme-shift.js` write to `wrapperStyle`.  
**How to detect:** Inspect message objects and trace which snippet last wrote `wrapperStyle`.  
**How to fix:** Choose one snippet to own message styling. The other must be removed or adapted to work through the owner.  
**Prevention:** Never compose two wrapperStyle-owning snippets. Choose one per bot.  
**Related:** `ui-theme-adaptive-message-style.js`, `transforms-runtime-theme-shift.js`

### FM-32: Conflicting reminderMessage ownership

**Symptoms:** Bot personality shifts erratically; reminder text changes mid-conversation unexpectedly.  
**Likely cause:** Both `prompting-dynamic-reminder-router.js` and `transforms-mode-switcher.js` write to `oc.character.reminderMessage`.  
**How to detect:** Log `oc.character.reminderMessage` in both snippet handlers.  
**How to fix:** Use only one reminder-owning snippet. If both features are needed, merge the logic into one handler.  
**Prevention:** One snippet owns `reminderMessage`. Document this in the design brief.  
**Related:** `prompting-dynamic-reminder-router.js`, `transforms-mode-switcher.js`

### FM-33: DOM ID collisions between snippets

**Symptoms:** Wrong panel opens; click handlers fire on wrong element; UI elements overlap or replace each other.  
**Likely cause:** Two snippets use the same DOM ID (e.g., both use `id="panel"`) in the iframe.  
**How to detect:** Inspect iframe DOM for duplicate IDs.  
**How to fix:** All DOM IDs must use the `pcbw-` prefix plus snippet name: `pcbw-debug-console`, `pcbw-floating-panel`.  
**Prevention:** Follow `pcbw-` naming convention. All repo snippets already namespace their IDs.  
**Related:** `snippets/README.md`, all `ui-*.js` snippets

---

## Quick Diagnosis Table

| Symptom | Most likely FM |
|---|---|
| Handler fires twice per message | FM-01 |
| Action runs faster and faster | FM-02 |
| TypeError on new thread | FM-06 |
| State lost on reload | FM-07 |
| Bot personality suddenly changes | FM-09, FM-32 |
| AI ignores recent conversation | FM-10 |
| Browser tab freezes during AI response | FM-04, FM-11 |
| Buttons disappear | FM-17, FM-30 |
| Message styles inconsistent | FM-14, FM-31 |
| Import rejected by Perchance | FM-26, FM-27 |
| customCode has extra backslashes | FM-25, FM-28 |
| Pyodide never loads | FM-19 |
| Validator reports rowCount error | FM-24 |
| Works in validator, breaks at runtime | FM-23 |

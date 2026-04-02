# Custom Code Implementation Checklist

Gate checklist for any PR that touches `customCode` or Perchance export JSON.

---

## Pre-Implementation

- [ ] Read `docs/PERCHANCE_IMPORT_VERIFICATION.md`
- [ ] Identified which snippet(s) to start from (see `docs/SNIPPET_SELECTION_GUIDE.md`)
- [ ] Checked `docs/CUSTOM_CODE_CAPABILITY_MATRIX.md` for feasibility
- [ ] Reviewed `docs/COMMON_FAILURE_MODES.md` for known pitfalls
- [ ] Starting from `bots/templates/perchance-empty-minimal.json` or existing known-good export

## Snippet Integration

- [ ] Each snippet is IIFE-wrapped
- [ ] Init guards use unique `window.__pcbw_*_init` flags
- [ ] `customData` keys use `__pcbw_` prefix
- [ ] DOM IDs/classes use `pcbw-` prefix
- [ ] No two snippets own the same `shortcutButtons` / `reminderMessage` / `wrapperStyle`
- [ ] Snippet load order is documented
- [ ] Configurable `const` variables are set before paste

## Custom Code Safety

- [ ] `oc.thread.customData ||= {}` before first access
- [ ] All `oc.getInstructCompletion` calls wrapped in try/catch
- [ ] No global scope pollution (or globals are namespaced for `onclick` handlers)
- [ ] No duplicate event listeners (init guard prevents re-registration)
- [ ] No `setInterval` without `clearInterval` on cleanup
- [ ] No hardcoded character names
- [ ] Theme-aware CSS uses `light-dark()`

## Runtime Behavior

- [ ] Tested message flow: send user message → AI responds → post-processing runs
- [ ] `shortcutButtons` render and function correctly
- [ ] iframe UI (if any) shows/hides correctly
- [ ] No console errors on thread creation
- [ ] No console errors on page reload
- [ ] No visible performance degradation from LLM calls in event handlers

## Export Safety

- [ ] `customCode` is a string in the export JSON
- [ ] `customCode` passes JavaScript syntax validation after JSON parse extraction
- [ ] `initialMessages` is an array of valid message objects
- [ ] `shortcutButtons` is an array of valid button objects
- [ ] All 9 canonical tables present
- [ ] `rowCount` values match actual row counts
- [ ] `node scripts/validate-perchance-export.js <file>` passes
- [ ] `python -m unittest tests/test-validate-perchance-export.py` passes

## Merge

- [ ] `REPO_MAP.md` updated if structure changed
- [ ] `BOT_CATALOG.md` updated if bot added/moved/retired
- [ ] `SNIPPETS_INDEX.md` updated if snippets changed
- [ ] No `TODO` placeholders remain in shipped `customCode`
- [ ] No debug-only code remains in release

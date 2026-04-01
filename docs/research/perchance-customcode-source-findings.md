# Perchance customCode Source Findings

> **Purpose:** Pre-implementation research memo for the reusable snippet library.
> This document captures runtime constraints, API surfaces, and design rules
> derived from primary sources. It is the basis for all snippet implementation
> decisions in Phase 2.

---

## Table of Contents

1. [Source-by-Source Notes](#source-by-source-notes)
2. [Perchance Runtime Constraints](#perchance-runtime-constraints)
3. [Iframe Behavior Notes](#iframe-behavior-notes)
4. [State Storage Rules](#state-storage-rules)
5. [Custom Message Object Rules](#custom-message-object-rules)
6. [Reminder / Instruction Implications](#reminder--instruction-implications)
7. [Initial Message Implications](#initial-message-implications)
8. [Memory / Lore Implications](#memory--lore-implications)
9. [Message Styling Implications](#message-styling-implications)
10. [Plugin Usage Implications](#plugin-usage-implications)
11. [Pyodide Constraints and Package Caveats](#pyodide-constraints-and-package-caveats)
12. [Pyodide Issue-Risk Notes](#pyodide-issue-risk-notes)
13. [GitHub Markdown Rules](#github-markdown-rules)
14. [CSS Filter Notes](#css-filter-notes)
15. [Implementation Rules Derived from Sources](#implementation-rules-derived-from-sources)

---

## Source-by-Source Notes

### 1. OpenCharacters `custom-code.md` (primary API reference)

- **`oc` object** is the main runtime surface.
- `oc.thread.messages` is a mutable array of message objects.
- `oc.character` exposes name, avatar, roleInstruction, reminderMessage,
  initialMessages, customCode, temperature, topP, frequencyPenalty,
  presencePenalty, stopSequences, modelName, streamingResponse, customData.
- `oc.character.customData` is arbitrary storage.
- `oc.character.customData.PUBLIC` is preserved in character share links.
- `oc.thread.customData` is thread-scoped persistent storage.
- `message.customData` is per-message storage.
- Custom code runs in a sandboxed `<script type="module">` inside an iframe.
- Functions used in `onclick` handlers in message HTML must be attached to
  `window` because module-scoped names are not visible to inline handlers.
- `oc.window.show()` / `oc.window.hide()` control iframe visibility.
- The iframe is draggable and resizable by the user.
- Content is rendered directly via DOM APIs (`document.body.innerHTML`, etc.).
- `oc.messageRenderingPipeline` is an array of functions for reader-specific
  content transforms (`reader === "user"` or `reader === "ai"`).

### 2. OpenCharacters `custom-code-examples.md`

- **MessageAdded handler pattern:** `oc.thread.on("MessageAdded", async function({message}) { ... })`
- Other events: `MessageEdited`, `MessageInserted`, `MessageDeleted`.
- `StreamingMessage` event: async iterator over `data.chunks`, each with `.text`.
- `oc.getChatCompletion({messages, temperature, stopSequences, ...})` sends
  completion requests. Only `messages` is required.
- `oc.getInstructCompletion(...)` is a newer, simpler API preferred for
  single-instruction completions.
- `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` hides injected
  HTML (like images) from the AI's view of the message.
- Expression image example: classify message emotion with LLM, then append a
  themed image wrapped in hidden-from-ai markers.
- URL content reader example: fetch page/PDF, extract text, push system
  message hidden from user.
- Character self-edit example: split reminderMessage at `---`, use LLM to
  rewrite the editable portion.
- Interactive buttons: `oc.thread.messages.push({author:'user', content:'...'})` from onclick.

### 3. OpenCharacters `running-python-code.md`

- Pyodide loaded via CDN import: `import "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js"`
- `loadPyodide({ stdout, stderr })` returns a Pyodide instance.
- `pyodide.loadPackage("micropip")` loads the micro package manager.
- `pyodide.runPythonAsync(code)` executes Python code.
- Example: detect code blocks in AI messages, execute them, push output as
  user message with `expectsReply: false`.
- Pyodide version in examples is 0.23.0; current stable is 0.28+/0.29+.
- Not all packages work; users must check compatibility.

### 4. Text-to-Speech plugin (`user-uploads.perchance.org/file/...`)

- Uses `speechSynthesis` browser API (no network required).
- Shows a voice selection UI in the iframe (`document.body.innerHTML`).
- Calls `oc.window.show()` to display the picker, `oc.window.hide()` on submit.
- Hooks into `StreamingMessage` to speak sentences as they arrive.
- Demonstrates a complete pattern: UI → user interaction → event hook → real-time processing.

### 5. Pyodide GitHub README

- CPython port to WebAssembly/Emscripten.
- Pure Python wheels from PyPI installable via `micropip`.
- Many C/C++/Rust extension packages ported (numpy, pandas, scipy, matplotlib, scikit-learn).
- JS ⟺ Python FFI with full error handling and async/await support.
- Can be self-hosted from release bundles or loaded from CDN.
- Browser sandbox restrictions apply (no native filesystem, no raw sockets).

### 6. Pyodide constraints and known issues (web search synthesis)

- Performance: ~1.2–1.5× slower than native CPython.
- No GPU computing (no CUDA/TensorFlow GPU in browser).
- Limited threading (WebAssembly threads browser-dependent).
- Virtual filesystem only (Emscripten FS or IndexedDB-backed).
- Networking only via browser `fetch`/Web APIs, no raw sockets.
- Long-running Python can freeze the UI if not run in a Web Worker or with
  async breaks.
- ABI stability improving with v0.28+ but packages may lag upstream releases.
- PEP 783 (native wheel support in browser) not yet finalized.

### 7. MDN CSS `filter` property

- Available filter functions: `blur()`, `brightness()`, `contrast()`,
  `drop-shadow()`, `grayscale()`, `hue-rotate()`, `invert()`, `opacity()`,
  `saturate()`, `sepia()`.
- Multiple filters can be chained: `filter: contrast(175%) brightness(103%)`.
- `url()` references SVG filter elements.
- Animatable via CSS transitions/keyframes.
- Applies to all elements; in SVG, applies to container and graphic elements.
- Relevant to `message.scene.background.filter` in Perchance.

### 8. Perchance `ai-text-plugin` and `text-to-image-plugin` (web search)

- `ai-text-plugin`: AI-driven text generation within Perchance generators.
- `text-to-image-plugin`: Stable Diffusion image generation via Perchance backend.
  - Used via `{import:text-to-image-plugin}` in generator syntax.
  - Remote generation (not in-browser).
  - In custom code context, `oc.textToImage(...)` is the equivalent API call.
- Both plugins require network access to Perchance backends.

### 9. GitHub Markdown formatting syntax

- Standard CommonMark + GFM extensions.
- Headings: `#` through `######`.
- Code blocks: triple backticks with optional language identifier.
- Task lists: `- [ ]` / `- [x]`.
- Tables: pipe-delimited with header separator row.
- Autolinked URLs, mentions (`@user`), issue references (`#123`).
- Inline HTML is supported but some tags are sanitized.
- Relevant for writing snippet documentation, README files, and index entries.

---

## Perchance Runtime Constraints

1. **Execution context:** Custom code runs inside a sandboxed iframe as a
   `<script type="module">`. Top-level `await` is supported.
2. **No cross-character code:** Only the primary character's custom code runs
   per thread. Multi-character logic must be multiplexed in one handler.
3. **No direct access to parent page:** The iframe is isolated. Communication
   with the host is via the `oc` API bridge only.
4. **Module scope:** All code is module-scoped. Functions referenced in inline
   `onclick` attributes must be explicitly attached to `window`.
5. **Async handlers:** `MessageAdded` handlers can be `async` and will be
   awaited before the AI responds. This is the primary hook for pre-response
   processing.
6. **No `this` in inline handlers:** Inline `onclick` code is executed in the
   iframe's global scope, not on the element.
7. **Available browser APIs:** Standard DOM, `fetch`, `speechSynthesis`,
   `localStorage` (iframe-scoped), `IndexedDB`, CSS, `<canvas>`, `<audio>`,
   `<video>`, Web Workers, `requestAnimationFrame`, etc.
8. **No guaranteed internet:** Snippets must not depend on CDN/external assets
   unless explicitly labeled `internet-required`.

---

## Iframe Behavior Notes

- The custom code iframe is **always running**, whether visible or not.
- `oc.window.show()` makes the iframe visible to the user.
- `oc.window.hide()` hides it.
- The user can **drag and resize** the iframe embed.
- Content is rendered via standard DOM manipulation:
  `document.body.innerHTML = "..."`, `document.createElement(...)`, etc.
- CSS can be injected via `<style>` tags or `element.style`.
- `srcdoc` iframes created inside the custom code iframe are allowed.
- The iframe has its own document, head, and body.
- Multiple show/hide cycles are fine; the iframe is not destroyed on hide.
- Timer/interval/event listeners persist across show/hide cycles.
- Cleanup must be handled by the snippet itself on re-initialization.

---

## State Storage Rules

| Scope | API | Persistence | Share-link safe? |
|---|---|---|---|
| Thread-level | `oc.thread.customData` | Per-thread, persists across messages | No |
| Message-level | `message.customData` | Per-message | No |
| Character-level (private) | `oc.character.customData` | Per-character, local only | No |
| Character-level (public) | `oc.character.customData.PUBLIC` | Per-character, in share links | Yes |

**Rules:**
- Always namespace keys to avoid collisions: `oc.thread.customData.pcbwMySnippet = {...}`.
- Never overwrite the entire `customData` object; merge into it.
- Initialize with defaults if missing: `oc.thread.customData.myKey = oc.thread.customData.myKey || defaultValue`.
- `customData` is a plain JS object; only store serializable values.
- Do not store large binary data in `customData`; it inflates thread size.

---

## Custom Message Object Rules

Every message in `oc.thread.messages` must follow this contract:

| Field | Type | Required | Notes |
|---|---|---|---|
| `content` | string | Yes | Supports HTML and Markdown |
| `author` | `"user"` \| `"ai"` \| `"system"` | Yes | |
| `name` | string | No | Display name override |
| `hiddenFrom` | array of `"user"` and/or `"ai"` | No | Controls visibility |
| `expectsReply` | boolean | No | `false` = AI won't auto-reply |
| `customData` | object | No | Arbitrary per-message storage |
| `avatar` | object `{url, size, shape}` | No | Per-message avatar override |
| `wrapperStyle` | string (CSS) | No | Bubble styling |
| `instruction` | string | No | For `/ai`/`/user` instructions |
| `scene` | object | No | Background/music scene data |

**Critical rules:**
- `content` must always be a string; never `undefined` or `null`.
- `author` must be one of the three valid values.
- `hiddenFrom` must be an array (not a string).
- System messages with `hiddenFrom: ["user"]` and `expectsReply: false` are
  the standard pattern for injecting context the AI sees but the user doesn't.
- `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` markers hide
  HTML from the AI's view within message content.

---

## Reminder / Instruction Implications

- `oc.character.reminderMessage` is injected into the AI context as a
  persistent instruction that appears after the conversation messages.
- It can be modified at runtime by custom code.
- The `---` split pattern allows a non-editable prefix and an AI-editable
  suffix.
- Snippets should not modify `reminderMessage` unless that is their explicit
  purpose, and they must preserve existing content.
- `oc.character.roleInstruction` is the primary personality/behavior prompt.
- Modifying `roleInstruction` at runtime changes the AI's persona.
- Thread-level overrides: `oc.thread.character.reminderMessage` and
  `oc.thread.character.roleInstruction` override character-level values for
  the current thread only.

---

## Initial Message Implications

- `oc.character.initialMessages` is an array of message objects shown when a
  new thread starts.
- These follow the same message object contract.
- Snippets generally should not modify `initialMessages` unless they are
  designed to set up a specific conversation flow.
- Checking `oc.thread.messages.length === 0` is the standard way to detect a
  fresh thread (before initial messages are added).

---

## Memory / Lore Implications

- `autoGenerateMemories` controls whether the platform automatically extracts
  and stores conversation memories.
- Memories and lore are stored in separate database tables in the export.
- Lore can be loaded from external URLs (`loreBookUrls`).
- Only the main character's lorebook is auto-loaded; other characters' lore
  must be loaded via custom code.
- Snippets that process or display memories should read from
  `oc.thread.customData` or the messages array, not try to access the
  internal memory/lore database directly.

---

## Message Styling Implications

- Message `content` supports HTML and is rendered as Markdown by default.
- `message.wrapperStyle` applies CSS to the message bubble.
- `oc.thread.messageWrapperStyle` applies CSS to all messages unless
  overridden per-message.
- `message.scene.background.url` sets a background image/video.
- `message.scene.background.filter` accepts CSS filter strings
  (e.g., `hue-rotate(90deg); blur(5px)`).
- `message.scene.music.url` and `.volume` control background audio.
- `oc.messageRenderingPipeline` is the proper way to transform message
  display without altering stored content.
- Snippets adding visual elements to messages should use
  `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` to prevent
  the AI from seeing injected HTML.

---

## Plugin Usage Implications

- `oc.textToImage(...)` generates images via the Perchance backend.
  Requires network access to Perchance servers.
- `oc.getInstructCompletion(...)` is the preferred API for single-instruction
  completions (newer, simpler than `oc.getChatCompletion`).
- `oc.getChatCompletion({messages, ...})` is the full chat completion API.
  Only `messages` is required.
- Both completion APIs use the user's configured model; snippets should not
  hardcode model names.
- Plugin APIs are async and return promises.
- Snippets using LLM APIs should make them optional and clearly document the
  dependency.

---

## Pyodide Constraints and Package Caveats

1. **Loading:** Pyodide is loaded from CDN via `import` or `<script>`.
   This requires network access. ~15–20 MB download on first load.
2. **Singleton:** Only one Pyodide instance should exist per iframe.
   Guard against double-initialization.
3. **Package installation:** Use `micropip.install("package")` for pure
   Python wheels. Pre-built packages available via `pyodide.loadPackage()`.
4. **Unsupported features:**
   - No native filesystem access (virtual FS only).
   - No raw sockets or subprocess.
   - No GPU computing.
   - Limited threading.
5. **Performance:** ~1.2–1.5× slower than native. Long-running code can
   freeze the browser tab; use async patterns or Web Workers.
6. **Version:** Examples reference v0.23.0; current stable is 0.28+.
   Snippets should use a recent stable version but document the version used.
7. **Error handling:** `pyodide.runPythonAsync()` can throw; always catch
   and display errors gracefully.
8. **stdout/stderr capture:** Configure via `loadPyodide({stdout, stderr})`
   callbacks.

---

## Pyodide Issue-Risk Notes

Based on known Pyodide project issues and constraints:

1. **CDN availability:** If the CDN is down or blocked, Pyodide won't load.
   Snippets must show a clear error state.
2. **CORS:** Some environments may block cross-origin Pyodide loads.
   Self-hosting is the mitigation but requires setup.
3. **Memory pressure:** Large packages (numpy, pandas) consume significant
   WASM memory. On mobile or low-memory devices, this can cause OOM crashes.
4. **Package version lag:** Pyodide-ported packages may lag PyPI releases.
   Don't assume the latest version of a package is available.
5. **Async bridge complexity:** The JS ⟺ Python FFI handles async/await but
   edge cases exist around proxy object lifecycle management.
6. **Browser compatibility:** WebAssembly is broadly supported, but some
   Pyodide features (shared memory, threads) require specific browser flags.
7. **Cold start time:** Initial Pyodide load + package install can take
   10–30 seconds on slow connections.

---

## GitHub Markdown Rules

Relevant for writing snippet documentation and repo docs:

- Use ATX headings (`#` style), not Setext.
- Use fenced code blocks with language identifiers for syntax highlighting.
- Use `js` or `javascript` for JavaScript code blocks.
- Task lists (`- [ ]`, `- [x]`) for checklists.
- Pipe tables for structured data.
- Use relative links for cross-file references within the repo.
- Inline HTML is allowed but should be minimal.
- Escape special characters (`*`, `_`, `\`) when used literally.
- Keep lines reasonable length for diff readability.
- Use blank lines before and after headings, lists, and code blocks.

---

## CSS Filter Notes

Relevant for UI/media snippets that apply visual effects:

### Available Filter Functions

| Function | Effect | Default |
|---|---|---|
| `blur(px)` | Gaussian blur | 0px |
| `brightness(%)` | Linear brightness | 100% |
| `contrast(%)` | Contrast adjustment | 100% |
| `drop-shadow(x y blur color)` | Drop shadow | none |
| `grayscale(%)` | Desaturation | 0% |
| `hue-rotate(deg)` | Hue rotation | 0deg |
| `invert(%)` | Color inversion | 0% |
| `opacity(%)` | Transparency | 100% |
| `saturate(%)` | Saturation boost | 100% |
| `sepia(%)` | Sepia tone | 0% |

### Usage Notes

- Filters chain left-to-right: `filter: contrast(175%) brightness(103%)`.
- Animatable with CSS transitions and keyframes.
- Apply to any element including images, divs, and canvases.
- `url()` references SVG filter elements for custom effects.
- In Perchance: `message.scene.background.filter` accepts these values.
- For UI snippets: use filters for hover effects, loading states, disabled
  states, and theme adaptation.

---

## Implementation Rules Derived from Sources

These rules must be followed in Phase 2 snippet implementation:

### Runtime Environment Rules

1. All custom code runs in a sandboxed iframe as `<script type="module">`.
2. Top-level `await` is supported.
3. Functions referenced in inline `onclick` must be on `window`.
4. The iframe document is a full HTML document with head and body.
5. `oc.window.show()` / `oc.window.hide()` control visibility; the iframe
   is never destroyed.
6. All timers, listeners, and state persist across show/hide cycles.
7. No guaranteed internet access unless explicitly labeled.

### API Usage Rules

8. Use `oc.thread.on("MessageAdded", async function({message}) { ... })` as
   the primary message hook.
9. Prefer `oc.getInstructCompletion(...)` over `oc.getChatCompletion(...)` for
   simple instruction-based completions.
10. Never hardcode model names; use the user's configured model.
11. `oc.textToImage(...)` requires Perchance backend access (network).
12. All completion and image APIs are async.

### State Management Rules

13. Use `oc.thread.customData` for thread-persistent state.
14. Use `message.customData` for per-message state.
15. Use `oc.character.customData` for character-local state.
16. Use `oc.character.customData.PUBLIC` only for share-link-persistent data.
17. Always namespace keys (e.g., `pcbw_snippetName`).
18. Never overwrite the entire `customData` object; merge into it.
19. Initialize with defaults using `||` or `??` patterns.

### Message Rules

20. Messages must have `content` (string) and `author` (valid enum).
21. `hiddenFrom` must be an array.
22. Use `expectsReply: false` for system messages that shouldn't trigger AI.
23. Use `<!--hidden-from-ai-start-->...<!--hidden-from-ai-end-->` to hide
    injected HTML from the AI.
24. Use `oc.messageRenderingPipeline` for reader-specific transforms.

### DOM and CSS Rules

25. Use `pcbw-` prefix for all CSS classes and IDs to avoid collisions.
26. Inject CSS via `<style>` tags appended to `document.head`.
27. Use inline styles or scoped style tags; never assume external stylesheets.
28. All UI must work inside the iframe environment.
29. Clean up DOM elements on re-initialization (idempotency guard).

### Snippet Architecture Rules

30. Wrap in IIFE unless deliberate globals are needed.
31. Guard against double initialization with a sentinel check.
32. Attach `onclick` handler functions to `window` with namespaced names.
33. Provide cleanup/teardown where applicable.
34. Include a working demo/default behavior on paste.
35. Include header comments: name, purpose, behavior, customization, caveats.
36. No external dependencies unless clearly labeled `internet-required`.
37. Fail gracefully with visible status messages on error.

### Pyodide-Specific Rules

38. Always check if Pyodide is already loaded before loading again.
39. Show loading progress/status in the iframe UI.
40. Label all Pyodide snippets as `internet-required` (CDN load).
41. Catch and display Python execution errors.
42. Use `stdout`/`stderr` callbacks for output capture.
43. Keep example Python code small and self-contained.
44. Document which Pyodide version is referenced.

### Network Rules

45. Default snippets must work fully offline.
46. Network-dependent snippets must be clearly labeled.
47. Network snippets must include timeout, error handling, and fallback UI.
48. Never assume CDN, third-party API, or external fetch will succeed.

---

*End of research memo.*

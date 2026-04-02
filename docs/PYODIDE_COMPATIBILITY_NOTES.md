# Pyodide Compatibility Notes

Conservative, realistic notes on using Pyodide in Perchance `customCode`. Do not treat Pyodide as a lightweight dependency — it is a heavy, network-dependent runtime with real constraints.

---

## 1. When Pyodide Makes Sense

- The bot genuinely needs computation: math, statistics, data transformation, or code execution.
- Python is the natural language for the task (e.g., scientific formulas, data parsing).
- The user expects a wait (e.g., "run this code" workflow, not instant chat).
- The bot can function without Python and treats Pyodide as an enhancement.

## 2. When Pyodide Does NOT Make Sense

- Simple string manipulation or formatting — use JavaScript.
- Any task achievable with `oc.getInstructCompletion` or basic JS.
- Bots targeting mobile users or low-bandwidth connections.
- Bots where instant response time is critical.
- Offline-capable bots — Pyodide requires network access.
- Bots that need C-extension Python packages not ported to Pyodide.

## 3. Runtime Constraints

| Constraint | Value |
|---|---|
| **Download size** | ~10–20 MB (Pyodide core + packages) |
| **Startup time** | 5–30 seconds depending on connection and device |
| **Memory usage** | 50–200 MB depending on loaded packages |
| **Thread blocking** | Main thread blocked during synchronous Python calls unless using Web Worker |
| **Browser support** | Chrome, Edge, Firefox, Safari (with caveats) |

- JSPI (JavaScript Promise Integration) can cause crashes on Chrome/Edge. The guarded loader in `ai-response-pyodide-runner-guarded.js` accounts for this.
- Heavy computation blocks the UI. For long-running Python, consider Web Workers (not currently supported by any repo snippet).

## 4. Network Dependence

- Pyodide loads from `cdn.jsdelivr.net` — no offline fallback.
- If the CDN is down or blocked, Pyodide will not load. Period.
- Package installation via `micropip` also requires network access.
- Corporate firewalls, school networks, and some mobile carriers may block CDN access.
- There is no bundled/local Pyodide option in Perchance's environment.

## 5. Package Realities

**Available (Pyodide-distributed or pure-Python wheels):**
- `micropip` (package installer)
- `numpy`, `pandas`, `scipy` (pre-built for Pyodide)
- `sympy`, `statistics`, `json`, `re`, `math` (stdlib / pure-Python)
- Most pure-Python packages installable via `micropip`

**NOT available:**
- Packages with C extensions not ported to Emscripten (e.g., `scikit-learn` partial, `tensorflow`, `torch`)
- Packages requiring filesystem access, networking, or subprocesses
- Packages depending on system libraries (e.g., `Pillow` with system libjpeg)

**Check availability:** Search [pyodide.org/en/stable/usage/packages-in-pyodide.html](https://pyodide.org/en/stable/usage/packages-in-pyodide.html) before assuming a package works.

## 6. Failure Handling

Pyodide can fail at multiple stages:

| Stage | Failure Mode | Mitigation |
|---|---|---|
| CDN fetch | Network error, timeout, blocked | Show error toast, fall back to JS-only mode |
| `loadPyodide()` | JSPI crash, memory exhaustion | Wrap in try/catch, set `__pcbw_pyodide_ready = false` |
| `loadPackage()` | Package not found, network error | Catch per-package, report which failed |
| `pyodide.runPython()` | Syntax error, runtime error, infinite loop | Wrap in try/catch, set execution timeout |
| Memory | Out of memory during computation | No reliable detection — document as a known risk |

Always define fallback behavior. The bot must remain functional when Pyodide is unavailable.

## 7. Guarded Loading Practices

Use the repo's guarded loader pattern from `snippets/custom-code/ai-response/ai-response-pyodide-runner-guarded.js`:

```js
// Guarded Pyodide loading pattern (simplified)
if (!window.__pcbw_pyodide_init) {
  window.__pcbw_pyodide_init = true;
  oc.thread.customData ||= {};
  oc.thread.customData.__pcbw_pyodide_ready = false;

  (async () => {
    try {
      delete window.sessionStorage;      // Required workaround
      window.sessionStorage = {};
      await import("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");
      const pyodide = await loadPyodide();
      await pyodide.loadPackage("micropip");
      oc.thread.customData.__pcbw_pyodide_ready = true;
      window.__pcbw_pyodide = pyodide;
    } catch (e) {
      console.error("Pyodide load failed:", e);
      oc.thread.customData.__pcbw_pyodide_ready = false;
    }
  })();
}
```

Key points:
- Init guard prevents double loading
- `delete window.sessionStorage` is a required workaround for Perchance's environment
- Always set a ready flag so other code can check availability
- Never assume loading succeeded

## 8. UI Expectations

- **Always show a progress bar** during Pyodide download. Use `snippets/custom-code/ui-ux/ui-progress-bar.js`.
- **Warn the user** before initiating the download: "Loading Python runtime (~15 MB)…"
- **Show a toast** on success or failure. Use `snippets/custom-code/ui-ux/ui-toast-notifications.js`.
- **Never block chat** on Pyodide loading. Let the user send messages while Python loads in the background.
- **Show execution status** when running Python code: "Running…", "Done", or "Error".

## 9. Data Passing Patterns

JavaScript ↔ Python data exchange via `pyodide.globals`:

```js
// JS → Python
window.__pcbw_pyodide.globals.set("input_data", JSON.stringify(myData));
window.__pcbw_pyodide.runPython(`
import json
data = json.loads(input_data)
result = process(data)
`);

// Python → JS
const result = window.__pcbw_pyodide.globals.get("result");
```

Rules:
- Pass primitives or JSON-serialized objects — not complex JS objects
- Python `dict`/`list` returned to JS are `PyProxy` objects — call `.toJs()` to convert
- Large data transfers are slow — minimize round-trips
- Clean up `PyProxy` objects with `.destroy()` to prevent memory leaks

## 10. Common Misconceptions

| Misconception | Reality |
|---|---|
| "Pyodide is a full Python environment" | It is CPython compiled to WebAssembly with significant limitations |
| "I can use any pip package" | Only pure-Python wheels or Pyodide-ported packages work |
| "Python runs in a separate thread" | It runs on the main thread by default and blocks UI |
| "I can access the filesystem" | Pyodide has a virtual filesystem — no access to user's real filesystem |
| "I can make HTTP requests from Python" | `requests` does not work; use `pyodide.http.pyfetch` instead |
| "It loads instantly" | 5–30 second startup, 10–20 MB download |
| "It works offline" | CDN dependency — no network, no Pyodide |
| "Threads/multiprocessing work" | No threading or multiprocessing support |
| "I can run arbitrary Python scripts" | Execution is sandboxed — no subprocess, no os.system |

## 11. Recommended Repo Snippets

| Snippet | Purpose |
|---|---|
| `ai-response/ai-response-pyodide-runner-guarded.js` | Guarded Pyodide loading and Python code execution |
| `ui-ux/ui-progress-bar.js` | Show download/loading progress to user |
| `ui-ux/ui-toast-notifications.js` | Notify user of load success/failure/execution status |
| `ui-ux/ui-debug-console-panel.js` | Display Python output and errors during development |
| `transformations/transforms-state-safe-init-guard.js` | Safe customData initialization before Pyodide state flags |

## 12. Anti-Patterns to Avoid

- **Loading Pyodide on every message:** Use init guard — load once, reuse the instance.
- **Blocking chat on Pyodide load:** Load asynchronously in background. Never make the user wait to send a message.
- **No fallback behavior:** If Pyodide fails to load, the bot must still function. Define what "JS-only mode" means.
- **Assuming package availability:** Check Pyodide package list before writing code that depends on a package.
- **Ignoring the `sessionStorage` workaround:** Omitting `delete window.sessionStorage` will cause load failures in Perchance's environment.
- **Running untrusted Python code without timeout:** User-provided or AI-generated Python may loop forever. Implement execution timeout.
- **Passing large data through `globals`:** Serialize minimally. Large transfers degrade performance.
- **Using Pyodide for trivial tasks:** If JavaScript can do it, use JavaScript. Pyodide's overhead is only justified for genuine Python-specific computation.
- **Not cleaning up PyProxy objects:** Every `.toJs()` call that returns a proxy must be followed by `.destroy()` eventually.
- **Loading unnecessary packages:** Each `loadPackage` call adds download time and memory. Only load what you need.

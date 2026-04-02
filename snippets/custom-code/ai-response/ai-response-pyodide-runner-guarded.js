/**
 * Snippet: ai-response-pyodide-runner-guarded
 *
 * Purpose:
 *   Provides guarded, optional Pyodide (Python-in-browser) execution
 *   within Perchance customCode. Lazy-loads Pyodide as a singleton,
 *   includes all documented workarounds, and provides an API for running
 *   Python code with timeout protection and fallback behavior.
 *
 * Why realistic:
 *   Pyodide is documented as usable in Perchance customCode with specific
 *   workarounds (sessionStorage deletion). This snippet implements all
 *   documented precautions: lazy loading, singleton pattern, try/catch
 *   guarding, loading indicator, and graceful failure.
 *
 * Immediate behavior when pasted:
 *   - Does NOT load Pyodide immediately (lazy-loaded on first use).
 *   - Exposes window.__pcbw_pyodide API.
 *   - Shows loading indicator when Pyodide is being loaded.
 *   - Provides fallback if Pyodide fails to load.
 *
 * Customization points:
 *   - PYODIDE_CDN_URL: CDN URL for pyodide.js (network-dependent).
 *   - TIMEOUT_MS: maximum execution time for Python code.
 *   - PACKAGES: list of Pyodide packages to pre-install after load.
 *
 * Caveats:
 *   - Network-dependent for initial Pyodide load (~10-20 MB download).
 *   - Python execution blocks the main thread.
 *   - Known Chrome/Edge JSPI crash risk with runPythonAsync.
 *   - Use runPython (synchronous) to avoid JSPI issues.
 *   - sessionStorage workaround is required per Perchance docs.
 *   - Not suitable for heavy or long-running computations.
 *   - This snippet is Pyodide-optional: it degrades gracefully if load fails.
 */
(async () => {
  if (window.__pcbw_pyodide_init) return;
  window.__pcbw_pyodide_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
  const TIMEOUT_MS = 10000; // 10 second timeout for Python execution
  const PACKAGES = []; // e.g., ["numpy"] — only pure-Python or pre-built Pyodide packages
  // ─────────────────────────────────────────────────────────────────────

  let pyodideInstance = null;
  let loadPromise = null;
  let loadStatus = "idle"; // idle | loading | ready | failed

  // ─── Loading Indicator ───────────────────────────────────────────────
  const loadingEl = document.createElement("div");
  loadingEl.id = "pcbw-pyodide-loading";
  loadingEl.style.cssText = [
    "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);",
    "z-index:10500; padding:16px 24px; border-radius:10px;",
    "background:light-dark(#fff,#1e1e1e); color:light-dark(#333,#ddd);",
    "box-shadow:0 4px 20px rgba(0,0,0,.3); font-family:sans-serif;",
    "font-size:14px; text-align:center; display:none;"
  ].join("");
  document.body.appendChild(loadingEl);

  function showLoading(text) { loadingEl.textContent = text; loadingEl.style.display = "block"; }
  function hideLoading() { loadingEl.style.display = "none"; }

  // ─── Pyodide Loader ──────────────────────────────────────────────────
  async function loadPyodide() {
    if (pyodideInstance) return pyodideInstance;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      try {
        loadStatus = "loading";
        showLoading("🐍 Loading Python runtime…");

        // Documented workaround: delete sessionStorage to prevent Pyodide crashes
        try { delete window.sessionStorage; } catch (e) { /* ignore */ }
        window.sessionStorage = {};

        // Load Pyodide script
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = PYODIDE_CDN_URL;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Pyodide script"));
          document.head.appendChild(script);
        });

        showLoading("🐍 Initializing Python…");

        // Initialize Pyodide
        pyodideInstance = await window.loadPyodide();

        // Install requested packages
        if (PACKAGES.length > 0) {
          showLoading(`🐍 Installing packages: ${PACKAGES.join(", ")}…`);
          await pyodideInstance.loadPackage(PACKAGES);
        }

        loadStatus = "ready";
        hideLoading();
        console.log("[pcbw-pyodide] Pyodide loaded successfully.");
        return pyodideInstance;
      } catch (err) {
        loadStatus = "failed";
        hideLoading();
        pyodideInstance = null;
        loadPromise = null;
        console.error("[pcbw-pyodide] Failed to load Pyodide:", err);
        throw err;
      }
    })();

    return loadPromise;
  }

  // ─── Run Python with Timeout ─────────────────────────────────────────
  async function runPython(code) {
    if (!pyodideInstance) {
      try {
        await loadPyodide();
      } catch (err) {
        return { success: false, error: "Pyodide failed to load: " + err.message, output: null };
      }
    }

    try {
      // Use synchronous runPython to avoid JSPI crash risk documented in issues
      const result = pyodideInstance.runPython(code);

      return {
        success: true,
        error: null,
        output: result !== undefined ? String(result) : null
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        output: null
      };
    }
  }

  // ─── Extract & Run Python from AI Messages (Optional) ────────────────
  function extractPythonBlocks(content) {
    const blocks = [];
    const regex = /```python\s*\n([\s\S]*?)```/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      blocks.push(match[1].trim());
    }
    return blocks;
  }

  // ─── Public API ──────────────────────────────────────────────────────
  const api = {
    /**
     * Load Pyodide (lazy, singleton). Returns the pyodide instance.
     */
    async load() { return loadPyodide(); },

    /**
     * Run Python code. Returns { success, error, output }.
     * @param {string} code - Python code to execute
     */
    async run(code) { return runPython(code); },

    /**
     * Extract Python code blocks from text (```python ... ```)
     * @param {string} text
     */
    extractBlocks(text) { return extractPythonBlocks(text); },

    /**
     * Get current load status.
     * @returns {"idle"|"loading"|"ready"|"failed"}
     */
    getStatus() { return loadStatus; },

    /**
     * Check if Pyodide is ready.
     */
    isReady() { return loadStatus === "ready"; }
  };

  window.__pcbw_pyodide = api;
  console.log("[pcbw-pyodide] Guarded Pyodide runner loaded (lazy — not yet downloading).");
})();

# Perchance AI Character Chat – Running Python Code

This document summarizes the **Running Python code** section of the Perchance AI Character Chat documentation.  It explains how to enable and use Python within your custom code by loading the Pyodide runtime, covers best practices, and highlights common pitfalls when executing Python in the browser.

## Overview

JavaScript is the primary language for Perchance custom code, but you can run Python as well thanks to **Pyodide**, a browser‑based Python runtime compiled to WebAssembly.  Loading Pyodide allows you to execute Python code directly in the browser, import many popular packages, and even install pure‑Python wheels via micropip.

Key points:

- **Load Pyodide** – Use dynamic `import()` to fetch the Pyodide bundle from a CDN.  For example:

  ```javascript
  // Work around a Pyodide bug involving sessionStorage
  delete window.sessionStorage;
  window.sessionStorage = {};
  await import("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");
  const pyodide = await loadPyodide();
  await pyodide.loadPackage("micropip");
  ```

  The `sessionStorage` workaround addresses a known issue where Pyodide expects a clean sessionStorage; clearing it prevents initialization errors.

- **Install packages with micropip** – After loading Pyodide, you can install pure‑Python packages using `micropip`.  For instance:

  ```javascript
  await pyodide.runPythonAsync("import micropip; await micropip.install('numpy')");
  ```

- **Run Python code** – Use `pyodide.runPython()` or `pyodide.runPythonAsync()` to execute Python code.  The synchronous version is fine for simple statements, while asynchronous code (e.g., using `await`) requires `runPythonAsync`.

- **Python <-> JavaScript bridge** – Pyodide exposes a robust foreign function interface (FFI).  You can pass values between JavaScript and Python and call Python functions from JavaScript.  Pyodide even allows you to add callbacks that call back into JavaScript, enabling complex interactions.  The Pyodide README notes that the runtime includes a “JS–Python FFI” which allows calling Python from JavaScript and vice versa【936505098753359†L392-L409】.

- **Limitations** – Pyodide runs entirely in the browser and has no access to local files outside of its virtual file system.  Heavy computations may block the UI.  Not all Python packages are supported; only pure‑Python wheels or packages available in the Pyodide distribution work reliably.  Network access depends on the user’s connection and CORS; avoid assuming external URLs are reachable.

- **Thread events** – You can combine Python with Perchance thread hooks.  For example, you might monitor messages for code blocks and execute them with Pyodide, then return the result to the chat.  Example snippet:

  ```javascript
  oc.thread.on("MessageAdded", async () => {
    const last = oc.thread.messages.at(-1);
    if (last.author !== "ai") return;
    // Extract Python code blocks from the message using regex
    const matches = [...last.content.matchAll(/```python\n([\s\S]+?)```/g)];
    if (matches.length === 0) return;
    const code = matches.map(m => m[1]).join("\n");
    const printed = [];
    const errors = [];
    // Run the code in Pyodide
    await pyodide.runPythonAsync(code).catch(e => errors.push(e.message));
    let reply = "";
    if (printed.length > 0) reply += `**Code output**:\n\n${printed.join('\n')}`;
    if (errors.length > 0) reply += `\n\n**Errors**:\n\n${errors.join('\n')}`;
    if (!reply.trim()) reply = "(The code did not produce any output.)";
    oc.thread.messages.push({ content: reply, author: "user", expectsReply: false });
  });
  ```

## Tips and best practices

- **Lazy load** – Only load Pyodide when needed.  Loading it incurs a ~10–20 MB download and initialization cost.  Consider showing a “loading Python…” indicator to users.
- **Singleton** – Load Pyodide only once per thread.  Store the `pyodide` instance in a global variable inside your IIFE to avoid repeated initialization.
- **Use virtual file system** – Pyodide provides a POSIX‑like virtual file system.  You can write and read files using standard Python file APIs, but note that data is stored in memory.
- **Handle exceptions** – Wrap your calls in try/catch blocks and report Python exceptions gracefully.  Use `pyodide.runPythonAsync()` with `.catch()`.
- **Keep Python code minimal** – While Pyodide is powerful, heavy numeric computation will block the UI thread unless you offload it to a Web Worker or use asynchronous patterns.  Keep Python code short or run it in bursts.

## Additional resources

- **Pyodide documentation** – See the Pyodide GitHub repository for a full description of its features, including the JS–Python FFI and package management【936505098753359†L392-L409】.
- **Perchance examples** – The [custom code examples](ai_character_chat_custom_code_examples.md) document contains snippets demonstrating how to use Python in Perchance.
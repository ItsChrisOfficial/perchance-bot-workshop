# Pyodide: Python in the Browser and Node.js

This summary captures key information from the Pyodide project’s README.  Pyodide is a port of CPython to WebAssembly that makes it possible to run Python code in the browser and in Node.js environments.

## What is Pyodide?

Pyodide is a **Python distribution for the browser and Node.js based on WebAssembly**【609001469695891†L10-L13】.  It ports CPython to WebAssembly/Emscripten and provides a runtime that can execute Python code entirely within a web context.  Pyodide allows you to install and run many Python packages in the browser using `micropip`【609001469695891†L14-L16】.  This includes pure‑Python wheels and numerous packages with C/C++/Rust extensions such as NumPy, pandas, SciPy, Matplotlib, scikit‑learn, and others【609001469695891†L16-L19】.

Key features:

- **Package installation** – Pyodide ships with `micropip` so that you can install pure‑Python packages from PyPI at runtime【609001469695891†L14-L16】.
- **Bundled packages** – Many common scientific and general‑purpose packages are already built for Pyodide, including NumPy, pandas, and matplotlib【609001469695891†L16-L19】.
- **JS ↔ Python FFI** – Pyodide provides a robust JavaScript ⟺ Python foreign function interface that lets you call Python from JavaScript and vice versa【609001469695891†L20-L23】.  This interface supports error handling, async/await, and mixing data structures between languages.
- **Web API access** – When running inside a browser, Pyodide grants Python code full access to Web APIs【609001469695891†L20-L23】.
- **No installation needed** – You can try Pyodide directly in the browser via the [interactive REPL](https://pyodide.org/en/stable/console.html)【609001469695891†L23-L26】.

## Getting started

The Pyodide README suggests multiple ways to start:

* **Use a hosted distribution** – Follow the [quickstart guide](https://pyodide.org/en/stable/usage/quickstart.html) for simple usage【609001469695891†L27-L29】.
* **Host Pyodide yourself** – Download the distribution from the releases page and serve it with your own web server【609001469695891†L29-L31】.
* **Use with bundlers** – See the documentation on working with bundlers when integrating Pyodide into a build pipeline【609001469695891†L31-L33】.
* **Add or build packages** – If you maintain a Python package and want it available in Pyodide, consult the docs on building and testing packages【609001469695891†L34-L36】.

## Project components

Pyodide consists of several parts【609001469695891†L42-L55】:

1. A build of CPython with patches to run under WebAssembly【609001469695891†L43-L44】.
2. A JS/Python foreign function interface layer for communication between languages【609001469695891†L45-L46】.
3. JavaScript code for creating and managing Pyodide interpreters【609001469695891†L46-L48】.
4. An Emscripten platform build configuration that ensures ABI compatibility【609001469695891†L48-L52】.
5. Toolchains and utilities for cross‑compiling, testing, and installing packages for Pyodide【609001469695891†L52-L54】.

## History and community

Pyodide began as part of Mozilla’s **Iodide project** in 2018 and is now an independent, community‑driven open‑source project【609001469695891†L56-L60】.  The project is maintained by volunteers and funded by sponsors and small donors【609001469695891†L70-L76】.  Contributions and issue reports are welcome via the project’s GitHub repository and communication channels listed in the README.

## License

Pyodide is released under the **Mozilla Public License Version 2.0**【609001469695891†L80-L84】.

For the latest information, refer to the [Pyodide documentation](https://pyodide.org/en/stable/).
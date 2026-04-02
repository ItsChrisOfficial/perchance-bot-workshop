# Pyodide: Summary of Recent Open Issues (April 2026)

This document summarises several open issues from the Pyodide GitHub repository as of March–April 2026.  These issues highlight active development areas and common problems reported by users.

## Notable open issues

1. **WASMFS support (#6141)** – A feature request proposes adding **WASMFS support** to Pyodide【783767901110154†L213-L220】.  WASMFS is a file system abstraction that could simplify file I/O in WebAssembly applications.  As of March 17, 2026, the issue is open and labelled as an enhancement.

2. **mountNativeFS fails on Android (#6132)** – Users report that `mountNativeFS` fails when mounting a non‑empty folder on Android devices starting from Pyodide v0.27.3【783767901110154†L223-L230】.  The issue is categorised as a bug.

3. **Consider setting -sFAKE_DYLIBS=0 (#6114)** – An enhancement proposal suggests altering the build flags to disable “fake dylibs.”  This change could affect how dynamic libraries are handled【783767901110154†L234-L242】.

4. **STATUS_ACCESS_VIOLATION crash on Chrome/Edge (#6114)** – An open bug reports a **STATUS_ACCESS_VIOLATION** crash on Chrome and Edge caused by JSPI plus `runPythonAsync`【783767901110154†L242-L247】.

5. **Enable and benchmark Tail‑Call Interpreter Optimization in Python 3.14 (#6106)** – An enhancement request asks to enable and benchmark the new tail‑call optimisation in Python 3.14【783767901110154†L251-L258】.

6. **RFC: New Pyodide Versioning Scheme for ABI Stabilization (#6102)** – A request for comments proposes a new versioning scheme to stabilise the Application Binary Interface (ABI) across releases【783767901110154†L260-L267】.

7. **Interrupting execution doesn’t work in requests or time.sleep() (#6084)** – A bug report notes that interrupting execution does not work properly when Python code calls the `requests` library or `time.sleep()`【783767901110154†L268-L276】.

8. **Matplotlib does not work with ipympl (#6077)** – Users have observed that **Matplotlib fails with `ipympl`**, with an error that a JavaScript library cannot be found【783767901110154†L288-L295】.

9. **Pyodide crashes when writing files >= 2 GiB (#6075)** – A bug indicates that Pyodide crashes in Chrome when attempting to write files equal to or larger than 2 GiB【783767901110154†L301-L306】.

10. **jQuery 4.0 release breaking the console (#6068)** – After the jQuery 4.0 release, the Pyodide console appears to break, suggesting compatibility issues【783767901110154†L309-L315】.

11. **Proposal: Setup Interim Pyodide Package Index (#6062)** – An enhancement proposes establishing an interim package index to simplify package management【783767901110154†L317-L324】.

These issues illustrate that Pyodide’s development is active, with attention to both new features (WASMFS, tail‑call optimisation, package index) and bug fixes (Android file mounts, crashes, library compatibility).  To follow progress or contribute, see the [Pyodide issues page](https://github.com/pyodide/pyodide/issues).
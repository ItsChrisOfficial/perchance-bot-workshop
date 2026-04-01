---
applyTo: "scripts/**,shared/**"
---

Hard rules for `scripts/**` and `shared/**`:

1. Keep diffs small and scoped.
2. Never duplicate validation logic; centralize shared checks in one reusable module.
3. Shared helpers must be deterministic, side-effect-light, and usable across bots/workflows.
4. Shared assets must not encode bot-specific assumptions, defaults, or naming.
5. Scripts must not silently rewrite or auto-fix export files unless the task explicitly requires mutation.
6. For mutating scripts, require explicit intent (clear mode/flag) and emit what changed.
7. Validation scripts must fail loudly with actionable messages: include failing path/check, expected vs actual, and fix hint.
8. Validation failures must return non-zero exit codes.
9. Any script/helper that affects import safety must be documented in `docs/README.md` or root `README.md` in the same PR.
10. When validation logic changes, add/update tests in `tests/` in the same PR.
11. Prefer pure functions with explicit inputs/outputs; avoid hidden state.
12. Update `REPO_MAP.md` when adding new folders or major files.

# snippets

## Purpose

Small reusable fragments and examples for fast composition during bot and tooling work.

## Who should use this folder

- Contributors who need copy/paste starter fragments
- Agents assembling repeated small patterns quickly
- Bot creators looking for drop-in customCode snippets

## What belongs here

- Focused code/content fragments
- Example patterns that are intentionally small and composable
- Snippets that are not full shared libraries or complete bots
- Standalone Perchance customCode JavaScript snippets

## What does not belong here

- Full bot projects
- Shared production utilities better placed in `shared/utilities/`
- Canonical standards docs (use `docs/`)

## When to use it

- During implementation when a small reusable fragment is enough
- When capturing repeatable micro-patterns without creating a shared module
- When building Perchance bots and need drop-in customCode functionality

## Naming rules

- Use descriptive kebab-case names.
- Keep snippets small and focused.

## Folder structure

```
snippets/
├── README.md
└── custom-code/
    ├── transformations/     # State machines, mode switching, scene/avatar/theme transforms
    ├── prompting/           # Hidden injection, style enforcement, classification, commands
    ├── ui-ux/               # Panels, modals, drawers, toolbars, toasts, tabs, progress bars
    ├── pregeneration/       # Image/audio preloading, HTML sanitization, RP formatting, lore
    └── ai-response/         # Post-processing, dedup guards, stream monitoring, Pyodide
```

## Custom code snippet conventions

All snippets in `custom-code/` follow these rules:
- **Standalone JS** — paste directly into Perchance customCode
- **IIFE wrapped** — no global pollution
- **Init guarded** — `window.__pcbw_*_init` flag prevents re-registration
- **Namespaced** — DOM IDs/classes use `pcbw-` prefix, customData keys use `__pcbw_` prefix
- **Theme-aware** — CSS uses `light-dark()` for dark/light mode
- **Character-agnostic** — no hardcoded character names or settings
- **Configurable** — customization points as const variables at the top of each file
- **Error-handled** — try/catch on all external calls
- **Documented** — header comment with purpose, realism note, behavior, and caveats

## How it interacts with the rest of the repo

- Supports work in `bots/`, `scripts/`, and `tools/` as a fragment library
- Complements `shared/`: snippets are lightweight examples, shared assets are stable reusable components
- Requires `SNIPPETS_INDEX.md` updates when snippet inventory changes

## Common mistakes to avoid

- Storing complete project files as snippets
- Treating snippets as durable shared APIs
- Forgetting to update `SNIPPETS_INDEX.md`
- Using undocumented Perchance APIs in customCode snippets

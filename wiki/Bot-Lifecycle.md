# Bot Lifecycle

Every bot in this repository follows a three-stage lifecycle:

```text
templates  →  in-progress  →  completed
```

## Stage 1: Templates

**Location:** `bots/templates/`

Templates are canonical starter assets — import-safe export envelopes with placeholder content.

### Available templates

| Template | Purpose | When to Use |
|---|---|---|
| `perchance-empty-minimal.json` | Default minimal production-safe starter | **Always use this** for new bot builds |
| `perchance-empty-annotated.json` | Teaching template with embedded schema guidance | When learning the export format |
| `perchance_empty_customcode_template.json` | Legacy baseline (pre-dates kebab-case convention) | Backward compatibility only |

### Rules

- Templates are **reusable starters only**, not active bot work
- Do not modify templates for a specific bot — copy them first
- Template changes must be reflected in `BOT_CATALOG.md`

## Stage 2: In-Progress

**Location:** `bots/in-progress/<bot-name>/`

Active bot development happens here. Each bot gets its own kebab-case folder.

### Starting a new bot

```bash
mkdir bots/in-progress/my-bot
cp bots/templates/perchance-empty-minimal.json bots/in-progress/my-bot/my-bot-v0.1.0.json
```

### Rules

- One folder per bot
- Use kebab-case naming
- Keep iteration artifacts here until the bot is release-ready
- In-progress bots must **not** be treated as released
- Add a catalog entry to `BOT_CATALOG.md` when starting work

### What to work on

1. Customize the character row (name, role, behavior)
2. Write `customCode` as normal JavaScript, then serialize
3. Define `initialMessages` and `shortcutButtons`
4. Validate frequently during development

## Stage 3: Completed

**Location:** `bots/completed/<bot-name>/`

Only release-ready, validated bots belong here.

### Folder structure

```text
bots/completed/<bot-name>/
├── <bot-name>-v1.0.0.json    # Versioned export artifact
└── RELEASE.md                 # Release notes from RELEASE_TEMPLATE.md
```

### Promotion requirements (all must be true)

- [ ] Export satisfies `docs/PERCHANCE_IMPORT_VERIFICATION.md` release gate
- [ ] `node scripts/validate-perchance-export.js <absolute-path>` passes
- [ ] `python -m unittest tests/test-validate-perchance-export.py` passes
- [ ] Bot folder contains a clearly versioned final export
- [ ] `RELEASE.md` created from `bots/completed/RELEASE_TEMPLATE.md`
- [ ] Scratch/draft artifacts removed from folder
- [ ] `BOT_CATALOG.md` updated with correct lifecycle state, path, status, and verification state
- [ ] Lifecycle move and metadata updates committed together

### Versioning

- First completed release: `v1.0.0`
- Patch increments for compatible fixes: `v1.0.1`
- Minor for additive compatible updates: `v1.1.0`
- Major for breaking behavior/contract shifts: `v2.0.0`

### RELEASE.md template

Copy `bots/completed/RELEASE_TEMPLATE.md` into your bot folder as `RELEASE.md` and fill in:

- Bot name and export artifact path
- Release version and date
- Verification evidence (validator pass, test pass, checklist applied)
- Promotion context and any known constraints

## Reference Example

The repository includes a known-good completed bot:

- **Reference Minimal Helper** at `bots/completed/reference-minimal-helper/`
- A minimal, fully importable export with a small valid `customCode` block
- Use it as a baseline example for completed bots

## Lifecycle Transitions

### Template → In-Progress

1. Copy a template to `bots/in-progress/<bot-name>/`
2. Add an entry to `BOT_CATALOG.md` with lifecycle state `in-progress`

### In-Progress → Completed

1. Pass all promotion requirements (see checklist above)
2. Move bot folder to `bots/completed/<bot-name>/`
3. Create `RELEASE.md` with verification evidence
4. Update `BOT_CATALOG.md`: change lifecycle to `completed`, update path, set status to `ready`, set verification to `passed`

### Completed → Archive (retirement)

1. Move bot folder to `archive/`
2. Update `BOT_CATALOG.md` to reflect retirement
3. Add date-prefixed naming if helpful

## Common Mistakes

- Placing active drafts directly in `bots/completed/`
- Promoting without running validation commands
- Forgetting to update `BOT_CATALOG.md` during lifecycle transitions
- Using ambiguous artifact names (`final`, `latest`, `fixed2`)
- Leaving scratch artifacts in completed bot folders

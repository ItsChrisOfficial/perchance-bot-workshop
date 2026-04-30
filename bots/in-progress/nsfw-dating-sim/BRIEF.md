# Bot Design Brief — nsfw-dating-sim

### Project Overview

| Field | Value |
|---|---|
| **Bot Name** | `nsfw-dating-sim` |
| **Version** | `0.1.0` |
| **One-Line Purpose** | An adult NSFW hentai dating sim set in the Realm of Eryndel with 7 romanceable characters, full RPG systems, and an opening character-setup UI. |

### Target Experience

The user opens the bot and immediately sees a setup panel where they choose a romance gender, enter their name, and describe themselves. After clicking Start Adventure, a pre-generated storyline is assembled deterministically and the full game world comes alive. The user explores seven locations, builds relationships with seven companions through conversation and gifts, completes quests, and levels up their skills — all within an immersive NSFW narrative.

### Bot Purpose

A mature adult interactive fiction / dating sim RPG. The bot acts as narrator and game master for an adult hentai fantasy world. It tracks player stats (level, XP, gold), a full skill tree (combat/social/magic), inventory, quests (3 main + 7 side), and individual affection levels with 7 romanceable characters. Slash commands and shortcut buttons provide full game-loop control. Intended for adult users who enjoy narrative RPG experiences with romantic/explicit escalation.

### User Interaction Model

- [x] Free conversation (narrative roleplay with the AI narrator)
- [x] Slash commands (see Command Requirements below)
- [x] Shortcut buttons (Status, Inventory, Skills, Quest Log, Explore, Shop, Characters, Help, Talk, Gift, Go: Inn/Market/Forest/Castle)
- [x] UI panels / modals (opening setup panel on first load via `document.body.innerHTML` + `oc.window.show()`)
- [x] Image generation triggers (live portrait switching via `oc.character.imagePromptKeywords[0]`)

### Tone / Voice Rules

- Primary tone: Immersive, adult, fantasy-epic; escalates romantic content naturally with affection level
- Speaking style: Second person ("You step into…"), vivid physical description, short-to-medium paragraphs
- Restrictions: Never references itself as AI; keeps responses under 300 words unless asked; always incorporates slash command results into narrative
- Formatting preferences: Bold for character names, italics for actions and atmospheric description, system messages use emoji headers

### Formatting Rules

| Rule | Value |
|---|---|
| **Target message length** | 150–300 words |
| **Markdown usage** | Bold for names/commands, italics for atmosphere |
| **HTML in messages** | No |
| **Action formatting** | `*action text*` |

### Command Requirements

| Command / Button | Trigger | Behavior | Auto-send? |
|---|---|---|---|
| Status | `/status` | Shows level, XP, gold, location | Yes |
| Inventory | `/inventory` | Lists inventory items | Yes |
| Skills | `/skills` | Shows all skill levels (combat/social/magic) | Yes |
| Quest Log | `/quests` | Shows all quests with progress | Yes |
| Explore | `/explore` | Describes location and who is present | Yes |
| Go | `/go <location>` | Travels to location, updates reminder | Yes |
| Shop | `/shop` | Lists shop items (market only) | Yes |
| Buy | `/buy <item>` | Purchases item, deducts gold | Yes |
| Talk | `/talk <charId>` | Engages a companion, switches portrait | Yes |
| Gift | `/gift <charId>` | Gives gift item, raises affection | Yes |
| Characters | `/chars` | Lists all companions and locations | Yes |
| Help | `/help` | Lists all commands | Yes |

### Snippet Candidates

| Snippet | Purpose in This Bot |
|---|---|
| N/A — custom IIFE | All logic self-contained given complexity of cross-system integration |

### State Model Needs

| State Key | Location | Type | Purpose |
|---|---|---|---|
| `cd.game.initialized` | `oc.thread.customData` | boolean | Guards init block |
| `cd.game.gender` | `oc.thread.customData` | string | Romance set selection |
| `cd.game.playerName` | `oc.thread.customData` | string | Player display name |
| `cd.game.location` | `oc.thread.customData` | string | Current location id |
| `cd.game.gold` | `oc.thread.customData` | number | Player gold |
| `cd.game.xp` | `oc.thread.customData` | number | Player XP |
| `cd.game.level` | `oc.thread.customData` | number | Player level |
| `cd.game.inventory` | `oc.thread.customData` | string[] | Item names |
| `cd.game.skills` | `oc.thread.customData` | object | combat/social/magic trees |
| `cd.game.quests` | `oc.thread.customData` | object[] | All 10 quests |
| `cd.game.characters` | `oc.thread.customData` | object | Per-char affection/location/stage |
| `cd.game.storyline` | `oc.thread.customData` | string | Pre-generated world lore (≤12500 chars) |
| `cd.game.activeCharacterId` | `oc.thread.customData` | string\|null | Currently active companion |

### Transformation Needs

XP leveling uses a multiplicative threshold (`xpToNext * 1.5` per level). Affection gating unlocks explicit content tiers naturally through the AI roleInstruction. Portrait switching updates `oc.character.imagePromptKeywords[0]` whenever a character name is detected in user messages or via `/talk`.

### UI Needs

Opening setup panel (first load only): gender dropdown, name input, description textarea, Start Adventure button. Rendered via `document.body.innerHTML` in the iframe, shown with `oc.window.show()`, hidden with `oc.window.hide()` on submit.

### Prewarming / Pregeneration Needs

On `initGame()`: full storyline generated from JS template strings and stored in `customData.game.storyline`. `imagePromptKeywords` array set to all 7 character keyword strings + user portrait. Reminder message built and pushed to `oc.character.reminderMessage`. No LLM calls required for generation.

### Response Behavior Needs

Slash commands splice the command message from `oc.thread.messages` and inject a system message with formatted results. Non-command messages award 10 XP, detect active character from message text, and rebuild `reminderMessage`.

### Image Behavior

| Feature | Details |
|---|---|
| **Avatar expressions** | Yes — 8-slot `imagePromptKeywords` array; index 0 is active portrait, rotates per character detection |
| **Scene backgrounds** | No |
| **In-message images** | No |

### Failure / Risk Notes

- Character name detection uses substring matching — short names or common words may cause false positives; mitigated by checking both first name and id.
- Shop commands silently fail if not in market — user sees clear error message and redirect instruction.
- Storyline generation is entirely in JS; it cannot fail due to LLM unavailability, but it is long (~10 000+ chars) and will consume `customData` space.
- `oc.window.show()` / `oc.window.hide()` availability depends on Perchance iframe context — graceful degradation if unavailable.
- Opening UI only shows when `!cd.game?.initialized`; re-loading a saved thread skips setup correctly.

### Validation Expectations

- [x] `node scripts/validate-perchance-export.js` passes
- [x] `python -m unittest tests/test-validate-perchance-export.py` passes
- [x] All 9 Dexie tables present with correct rowCount
- [x] `customCode` is valid JS (IIFE, no syntax errors)
- [x] `shortcutButtons` array has 8 entries with correct schema
- [x] `initialMessages` is a non-null array with 1 welcome message
- [x] `$types` object present on character row

### Release Expectations

| Field | Value |
|---|---|
| **Target lifecycle state** | in-progress |
| **Target version** | 0.1.0 |
| **BOT_CATALOG.md entry** | Not yet — draft after v0.1 validation |

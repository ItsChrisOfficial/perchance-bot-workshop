# Bot Design Brief Template

Template for planning a Perchance Advanced AI Character Chat bot before implementation.

---

## Instructions

- Fill out every section. Use "N/A" for sections that genuinely do not apply.
- Reference snippet filenames from `snippets/custom-code/` by their exact names.
- Keep Tone/Voice Rules specific and testable — avoid vague adjectives.
- State Model Needs should identify *where* state lives (`oc.thread.customData`, character fields, or DOM).
- For Snippet Candidates, check `docs/SNIPPET_SELECTION_GUIDE.md` and `SNIPPETS_INDEX.md` for options.
- Failure/Risk Notes should cover real failure modes, not hypotheticals. See `docs/COMMON_FAILURE_MODES.md`.
- Validation Expectations must reference concrete checks from `docs/CUSTOM_CODE_IMPLEMENTATION_CHECKLIST.md`.
- Do not leave sections blank and fill them in later — the brief is the plan.

---

## Blank Template

### Project Overview

| Field | Value |
|---|---|
| **Bot Name** | *(kebab-case folder name)* |
| **Version** | *(e.g., 0.1.0)* |
| **One-Line Purpose** | *(single sentence: what does this bot do?)* |

### Target Experience

*What should using this bot feel like? Describe the ideal user session in 2–3 sentences.*

### Bot Purpose

*Detailed description of what the bot does. What problem does it solve or what experience does it create? Who is the intended user?*

### User Interaction Model

*How does the user interact with the bot? Check all that apply and describe:*

- [ ] Free conversation
- [ ] Slash commands (list them)
- [ ] Shortcut buttons (list labels and actions)
- [ ] UI panels / modals (describe purpose)
- [ ] Image generation triggers
- [ ] Other: *(describe)*

### Tone / Voice Rules

*Define the bot's personality and speaking style. Include:*

- Primary tone: *(e.g., warm and encouraging, sarcastic, clinical)*
- Speaking style: *(e.g., short sentences, uses metaphors, speaks in third person)*
- Restrictions: *(e.g., never breaks character, avoids modern slang, stays under 200 words)*
- Formatting preferences: *(e.g., uses italics for actions, bold for emphasis)*

### Formatting Rules

| Rule | Value |
|---|---|
| **Target message length** | *(e.g., 100–300 words)* |
| **Markdown usage** | *(e.g., bold for names, italics for actions)* |
| **HTML in messages** | *(yes/no, what tags)* |
| **Action formatting** | *(e.g., `*action*` or `<i>action</i>`)* |

### Command Requirements

*List all slash commands and shortcut buttons:*

| Command / Button | Trigger | Behavior | Auto-send? |
|---|---|---|---|
| *(example)* | `/reset` | Clears thread state and reseeds initial message | Yes |

### Snippet Candidates

*Which snippets from `snippets/custom-code/` will this bot use?*

| Snippet | Purpose in This Bot |
|---|---|
| *(filename)* | *(why)* |

### State Model Needs

*What state does this bot need to track?*

| State Key | Location | Type | Purpose |
|---|---|---|---|
| *(example)* | `oc.thread.customData.__pcbw_mood` | string | Current mood of the character |

### Transformation Needs

*Does the bot need state machines, mode switching, or scene changes? Describe transitions:*

### UI Needs

*Panels, modals, toolbars, debug consoles — describe each and its trigger:*

### Prewarming / Pregeneration Needs

*Asset caching, message seeding, lore loading — what needs to happen before the user's first message?*

### Response Behavior Needs

*Post-processing, style enforcement, regeneration handling — what happens after the AI responds?*

### Image Behavior

*Text-to-image usage, avatar expressions, scene backgrounds:*

| Feature | Details |
|---|---|
| **Avatar expressions** | *(yes/no, how many, trigger logic)* |
| **Scene backgrounds** | *(yes/no, when do they change)* |
| **In-message images** | *(yes/no, prompt pattern)* |

### Failure / Risk Notes

*What could go wrong? List concrete risks:*

- *(e.g., "LLM may not follow scene transition format, causing parser failure")*
- *(e.g., "Pyodide download may time out on slow connections")*

### Validation Expectations

*Which checks must pass before release?*

- [ ] `node scripts/validate-perchance-export.js` passes
- [ ] `python -m unittest tests/test-validate-perchance-export.py` passes
- [ ] *(additional bot-specific checks)*

### Release Expectations

| Field | Value |
|---|---|
| **Target lifecycle state** | *(in-progress / completed)* |
| **Target version** | *(e.g., 1.0.0)* |
| **BOT_CATALOG.md entry** | *(drafted / not yet)* |

---

## Worked Example: Scene-Switching Adventure Companion

### Project Overview

| Field | Value |
|---|---|
| **Bot Name** | `scene-switching-adventure-companion` |
| **Version** | `0.1.0` |
| **One-Line Purpose** | An adventure companion that transitions between named scenes, tracks character state, and routes AI behavior based on current context. |

### Target Experience

The user feels like they are moving through a living world. Scenes change with clear visual and narrative cues. The companion character reacts differently depending on where the player is and what has happened. Shortcut buttons offer contextually relevant actions without requiring the user to memorize commands.

### Bot Purpose

A roleplay companion bot for multi-scene adventures. The bot manages scene transitions (e.g., forest → tavern → dungeon), maintains character state (health, mood, inventory keywords), and adjusts its reminder/system prompt dynamically based on the current scene. It uses shortcut buttons to offer scene-appropriate actions (e.g., "Search the room" in a dungeon, "Order a drink" in a tavern).

### User Interaction Model

- [x] Free conversation
- [ ] Slash commands
- [x] Shortcut buttons (scene-contextual actions)
- [ ] UI panels / modals
- [ ] Image generation triggers
- [ ] Other

### Tone / Voice Rules

- Primary tone: Adventurous, supportive, slightly theatrical
- Speaking style: Second person ("You step into the clearing…"), uses vivid sensory detail, short paragraphs
- Restrictions: Never breaks character. Never refers to itself as an AI. Stays under 250 words per response.
- Formatting preferences: Italics for environmental descriptions, bold for character speech

### Formatting Rules

| Rule | Value |
|---|---|
| **Target message length** | 150–250 words |
| **Markdown usage** | Bold for NPC dialogue, italics for descriptions |
| **HTML in messages** | No |
| **Action formatting** | `*action text*` |

### Command Requirements

| Command / Button | Trigger | Behavior | Auto-send? |
|---|---|---|---|
| Look Around | Shortcut button | Sends "I look around carefully." | Yes |
| Talk to NPC | Shortcut button | Sends "I approach the nearest person and speak." | Yes |
| Check Inventory | Shortcut button | Sends "/inventory" — triggers state readout in AI response | Yes |
| Travel | Shortcut button | Sends "I want to travel to a new location." — triggers scene transition | Yes |

### Snippet Candidates

| Snippet | Purpose in This Bot |
|---|---|
| `transforms-scene-transition-engine.js` | Manages scene state, validates transitions, emits scene-change events |
| `transforms-character-state-machine.js` | Tracks character state (mood, health, flags) across messages |
| `prompting-dynamic-reminder-router.js` | Swaps the system reminder based on current scene |
| `ui-shortcut-button-orchestrator.js` | Updates shortcut buttons contextually per scene |
| `prewarm-scene-assets.js` | Preloads scene descriptions and metadata at thread start |
| `ui-toast-notifications.js` | Shows transient scene-change and state-change notifications |

### State Model Needs

| State Key | Location | Type | Purpose |
|---|---|---|---|
| `__pcbw_current_scene` | `oc.thread.customData` | string | Active scene identifier (e.g., `"tavern"`, `"forest"`) |
| `__pcbw_scene_history` | `oc.thread.customData` | string[] | Ordered list of visited scenes |
| `__pcbw_char_state` | `oc.thread.customData` | object | Character FSM state: `{ mood, health, flags }` |
| `__pcbw_scene_assets` | `oc.thread.customData` | object | Preloaded scene metadata cache |

### Transformation Needs

The character state machine (`transforms-character-state-machine.js`) tracks mood transitions: `neutral → excited → cautious → afraid → neutral`. Transitions trigger on scene keywords detected by the classifier. The scene engine (`transforms-scene-transition-engine.js`) manages scene graph: `forest ↔ tavern ↔ dungeon ↔ tower`. Invalid transitions (e.g., `tavern → tower` without visiting `dungeon`) are blocked and produce a toast notification.

### UI Needs

No panels or modals. Toast notifications (`ui-toast-notifications.js`) appear on scene change and state transitions. Shortcut buttons update dynamically via `ui-shortcut-button-orchestrator.js`.

### Prewarming / Pregeneration Needs

`prewarm-scene-assets.js` loads scene metadata (descriptions, valid transitions, ambient tags) into `oc.thread.customData.__pcbw_scene_assets` on first thread load. This avoids repeated LLM calls for scene context.

### Response Behavior Needs

No post-processing beyond what `prompting-dynamic-reminder-router.js` provides (reminder swap per scene). The AI's system prompt changes dynamically, so response style shifts naturally.

### Image Behavior

| Feature | Details |
|---|---|
| **Avatar expressions** | No |
| **Scene backgrounds** | No (text-only in v0.1) |
| **In-message images** | No |

### Failure / Risk Notes

- Scene transition engine may fail if AI output doesn't contain expected scene keywords — mitigated by classifier fallback.
- State machine may accumulate stale flags if thread is very long — mitigated by periodic state pruning.
- Prewarmed scene assets increase `customData` size — keep scene count under 10 for v0.1.
- Dynamic reminder routing depends on correct scene detection; misclassification produces wrong system prompt for one turn.

### Validation Expectations

- [x] `node scripts/validate-perchance-export.js` passes
- [x] `python -m unittest tests/test-validate-perchance-export.py` passes
- [x] Scene transition graph has no orphan nodes
- [x] All shortcut button labels under 30 characters
- [x] State machine has no unreachable states

### Release Expectations

| Field | Value |
|---|---|
| **Target lifecycle state** | in-progress |
| **Target version** | 0.1.0 |
| **BOT_CATALOG.md entry** | Not yet — draft after v0.1 validation |

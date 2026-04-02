# Perchance AI Character Chat – Memories and Lore

This document summarises the **Memories and Lore** functionality in Perchance AI Character Chat.  These features let your character remember past events and access background information without crowding the main instruction or reminder fields.

## Memories

When summarisation is enabled in a character’s settings, Perchance automatically creates **memories** as the conversation grows.  Before each AI reply, the system searches these memories for entries relevant to the current context.  This allows the AI to recall earlier parts of the conversation or important facts without re-reading the entire thread.

Key points about memories:

- **Automatic creation** – Memories are generated automatically once the thread reaches a length threshold.  They are kept in chronological order.
- **Viewing and editing** – Use the `/mem` slash command to open the memory editor for a thread.  From there you can add, edit, or remove memories.
- **Search queries** – When you hover over a message (or tap on mobile), a brain icon appears.  Clicking it reveals the search queries used to find relevant memories for that reply.  This insight can help you understand the AI’s reasoning.
- **Persistent per thread** – Memories are stored per conversation and are not shared across different threads, even when using the same character.

## Lore

**Lore** entries differ from memories in that they are not tied to chronological events.  Instead, they represent static facts or world‑building information.  Lore can be associated with a specific thread or attached to the character for reuse in all new threads.

Lore behaviour and features:

- **Adding lore** – Open the lore editor with `/lore`.  You can add, edit, or remove lore entries for that thread.  Each entry should be self‑contained; the AI sees lore entries in isolation, so avoid pronouns without clear antecedents.
- **Character-wide lorebooks** – In the advanced character editor you can supply **lorebook URLs**.  These are text files (uploaded via `https://perchance.org/upload`) containing multiple lore entries separated by blank lines.  Characters will inherit the lore in those files when starting new threads.
- **Dynamic reminders** – Lore functions like a dynamic reminder: entries are loaded only when relevant to the current situation.  This allows you to provide thousands of facts without overwhelming the instruction or reminder context.

### Example lorebook format

An uploaded lorebook text file might look like this:

```
There are three concentric walls: Wall Maria, Wall Rose, and Wall Sina, which protect humanity from giant humanoid creatures called Titans.

The Survey Corps is a military branch dedicated to exploring the world outside the walls and combating the Titans.

ODM gear, or Omni‑Directional Mobility gear, is a piece of equipment used by the military to maneuver in three dimensions, allowing them to fly through the air during combat with Titans.
```

Each paragraph is a separate lore entry.  When adding lore to a character, ensure each entry is a complete fact that does not depend on other entries.  Order does not matter, as the AI treats them as independent facts.

## Notes

- You can have as many memories or lore entries as you like; performance does not degrade significantly with large numbers.
- Updating a character’s lorebook does not automatically update existing threads.  To refresh the lore in a running conversation, open the lore editor (`/lore`), show hidden options, and click the reload button.
- Use lore when you need to give the AI large amounts of background knowledge, and use memories to recall events within the conversation.
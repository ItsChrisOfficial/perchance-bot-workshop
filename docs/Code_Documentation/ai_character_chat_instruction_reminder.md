# Perchance AI Character Chat – Instruction and Reminder Messages

This document summarises the **Instruction and Reminder** section of Perchance’s AI Character Chat documentation.  These two fields are the primary tools for defining how your character behaves.

## Instruction (Role) message

The **instruction** (also called the role or description) tells the AI who it is, how it should behave, and what tone to adopt.  Think of it as the core character definition.  Guidelines:

- Keep it concise – Ideally under 500 words.  If you need more, use a Lorebook for background facts.
- Use clear directives – Write in natural language or provide examples of dialogue to illustrate style and personality.
- Multiple messages – You can include multiple instruction messages by using the same bracketed header format as initial messages.  When you assign an author (e.g., `[AI]:` or `[USER]:`), that message becomes part of the instruction but is not summarised away.
- System vs. first person – By default, the instruction is considered to be spoken by the `SYSTEM`.  You can switch the voice by prefixing messages with `[AI]:` or `[USER]:` for more nuanced control.

Example of advanced instruction:

```text
[AI]: I'm a dragon.  I speak in riddles and guard ancient treasure.
[USER]: I'm the queen of a nearby kingdom.
[SYSTEM]: The following is a story about the queen and the dragon.
```

## Reminder message

The **reminder** message is a short piece of text inserted into the chat just before each AI response.  Because of its proximity to the message being generated, it has a strong influence on the AI’s behaviour.  Use it to reinforce style, mood, or specific instructions.

Guidelines:

- Keep it short – Ideally under 100 words.  Long reminders can distract the AI or interfere with conversation flow.
- Make it specific – Reminders should be concrete and actionable (e.g., “Stay in first person and be very descriptive”).
- Multiple reminders – You can add multiple reminder messages using the same `[AI]:`, `[USER]:`, and `[SYSTEM]:` notation.  Like instruction messages, these are never summarised away.
- Self‑talk – You can have the AI “think to itself” by using `[AI]: (Thought: ...)` or `[AI]: (OOC: ...)` as a reminder.  This hides the content from the user but reminds the AI of its priorities.

Example of an AI self‑reminder:

```text
[AI]: (Thought: Remember to describe sights, smells, and emotions vividly.)
```

## How changes propagate

Instruction and reminder messages are part of the character definition, not the thread.  Editing them updates existing threads immediately.  There is no way to have an instruction or reminder that applies to only one specific thread; for thread‑specific guidance, use hidden initial messages or lore entries.

## Distinguishing instruction/reminder from initial messages

- **Instruction and reminder messages** – Not summarised.  They stay at the start of the chat and are always visible to the AI.
- **Initial messages** – Are summarised with normal chat messages.  Use them for scene‑setting or demonstration but not for persistent behavioural rules.

By properly crafting instruction and reminder messages, you define your character’s personality and keep the AI on track throughout the conversation.
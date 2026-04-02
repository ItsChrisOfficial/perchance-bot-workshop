# Perchance AI Character Chat – Initial Messages

This document summarises the **Initial Messages** section of Perchance AI Character Chat.  Initial messages let you pre‑seed a conversation with dialogue before the user begins interacting, helping the AI understand context and get into character.

## Purpose

Initial messages provide a scripted starting exchange between the AI, the user, and the system.  They are treated as normal messages, meaning they will be summarised like any other chat content when the thread becomes long.  Initial messages can serve several purposes:

- **Set the scene** – Provide a narrative introduction or background exposition.
- **Demonstrate speech patterns** – Show examples of how the character speaks or responds.
- **Guide the AI** – Use system messages to give instructions that apply to the beginning of the conversation.
- **Hide or reveal content** – Control which messages are visible to the AI and to the user.

## Format

Initial messages follow a specific format in the character editor.  Each message starts with a header specifying the author and optional properties:

```text
[AI]: This is the first AI message.
[USER]: This is the user's response.
[SYSTEM]: Here's a system message. Use system messages to help guide the AI.
```

You can also specify **visibility** and **name overrides**:

```text
[AI; hiddenFrom=user]: This message is hidden from the user but visible to the AI.
[SYSTEM; hiddenFrom=ai]: This message is hidden from the AI but visible to the user.
[SYSTEM; name=Bob]: This message appears to be sent from Bob.
[SYSTEM; name=Bob, hiddenFrom=ai]: Combine multiple properties.
```

Messages may span multiple lines.  Markdown and HTML are allowed.  For example, you can embed images or lists inside a message.

## Hiding messages

The `hiddenFrom` property controls who can see a message:

- `hiddenFrom=user` – The message is visible to the AI but hidden from the user.  Useful for instructions or private context.
- `hiddenFrom=ai` – The message is visible to the user but hidden from the AI.  Useful for user instructions or credits.

## Multi‑message initial scripts

An initial script can be as long as you like, alternating between AI, user, and system messages.  Example:

```text
[AI]: Greetings, traveler. What brings you to my domain?
[USER]: I'm seeking knowledge about your world.
[SYSTEM]: Remember to stay in character and respond in the first person.
[AI; hiddenFrom=user]: (Thought: I'll maintain an air of mystery and speak in riddles.)
```

## Relation to other messages

Unlike **instruction** and **reminder** messages (which are not summarised), initial messages are summarised when the thread grows long.  Use them for scene‑setting and demonstration, not for persistent rules.  To create persistent guidance that never gets summarised, use additional instruction or reminder messages instead.

## Tips

- Keep initial messages concise and focused; long scripts may reduce the context available for later messages.
- Use the `[SYSTEM]` author to provide guidance without assigning it to the AI or user.
- Combine hidden messages with visible ones to provide private context to either the AI or the user.
# Perchance AI Character Chat – Tips and Tricks

This document summarises general tips from the Perchance AI Character Chat documentation.  These guidelines help you get the most out of the platform, whether you’re designing characters or interacting in chats.

## General advice

- **Use example dialogue** – Including short dialogues in your character’s description or initial messages is one of the most effective ways to influence their speech patterns.
- **Limit response length** – If your character’s replies are too long or stray off topic, set a strict reply length limit (e.g., one or two paragraphs) in the character editor.
- **Group chats** – To run a group chat, bring other characters into the conversation via the pencil icon above the reply box.  Use mentions (e.g., `@Alice#1`) to direct instructions to specific characters.
- **Reminder note** – Use the reminder note to give writing tips like “be very descriptive.”  Because it’s placed immediately before the AI’s next reply, it has a strong effect.
- **Export and backup** – Clearing site cookies or data will delete threads and characters.  Use the “export” button regularly to back up your data.  You can export individual threads or characters to keep the file size manageable.
- **Import formats** – The import button accepts threads, characters, export files, and open character formats like Tavern PNG cards.  If you find an unsupported format, use the feedback button to request support.
- **Command history** – Double‑tap the reply box to see your recent send history.  This makes it easier to resend commands or messages.

## Slash commands overview

The reply box supports several slash commands.  These commands can be typed manually or triggered via shortcut buttons.

* `/ai` – Trigger an AI reply.  Optionally pass an instruction (e.g., `/ai write a silly reply`).
* `/ai @CharName#ID` – Ask another character to respond (e.g., `/ai @Alice#7 say something sinister`).
* `/user` – Generate a reply on behalf of you, the user (e.g., `/user write a short response in first person`).
* `/image` – Generate an image.  Without a description, the system infers one from context.  Add options like `--num=3` to request multiple images.
* `/sys` or `/system` – Prompt a response from the system.
* `/nar` – Shortcut for `/sys @Narrator` to use the Narrator persona.
* `/sum`, `/mem`, `/lore` – Open the summary, memory, or lore editors.
* `/name`, `/avatar`, `/import` – Set your name, change your avatar, or import bulk messages.

You can append `/ai <instruction>` to a normal message to instruct the AI for its reply.  Double‑click the input box to view your command history.

## Shortcuts

Click the **options** button next to the reply box to add **shortcut buttons**.  Shortcuts insert predefined commands or messages into the reply box (and optionally auto‑send them).  Use angled brackets (`< >`) inside a shortcut to mark a placeholder that will be automatically highlighted when inserted, allowing quick editing.

## Miscellaneous tips

- Disable summaries and memories in the advanced character editor if you need faster responses, but note that the AI may lose context.
- Long or multi‑paragraph reminder messages can confuse the AI; keep them concise.
- Use lorebooks for large amounts of character/world information; don’t overload the instruction field.
- Use the `<image>` tag or `/image` command with additional options like `(resolution:::512x768)` or `(seed:::84756293)` for advanced image control (details in the [text‑to‑image plugin](perchance_text_to_image_plugin.md)).
- Export regularly to avoid losing your work due to cookie or data clearing.

These tips offer practical guidance for designing and using Perchance characters effectively.  For deeper information, refer to the other documents in this series.
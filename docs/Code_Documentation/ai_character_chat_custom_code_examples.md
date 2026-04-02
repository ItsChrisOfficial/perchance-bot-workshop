# Perchance AI Character Chat – Custom Code Examples

This document summarises and curates several practical examples of custom code for Perchance AI Character Chat.  The examples illustrate how to react to messages, modify content, call AI helpers, and display dynamic user interfaces.  These patterns are derived from Perchance’s official examples and community‑shared snippets.  All code runs inside the custom‑code iframe.

## 1. Editing AI messages after generation

You can listen for new AI messages and then refine their content.  For instance, the following snippet rewrites the latest AI message to include more emojis using the `oc.getInstructCompletion()` helper:

```javascript
(async () => {
  oc.thread.on("MessageAdded", async () => {
    const last = oc.thread.messages.at(-1);
    if (last.author !== "ai") return;
    const instruction = `Rewrite this message to include more emojis. Respond with only the rewritten message.`;
    const rewritten = await oc.getInstructCompletion({ instruction, startWith: last.content });
    last.content = rewritten.trim();
  });
})();
```

This pattern is useful for adding post‑processing steps, such as inserting missing punctuation, enforcing a tone, or censoring unsafe content.

## 2. Preventing the AI from narrating the user’s actions

To keep roleplaying messages focused on your character, you can filter out actions performed by the user or other characters:

```javascript
(async () => {
  oc.thread.on("MessageAdded", async () => {
    const last = oc.thread.messages.at(-1);
    if (last.author !== "ai") return;
    const prompt = `Please edit the following message so that it only contains actions taken by ${last.name} and not by ${oc.thread.userCharacter.name} or any other characters. Respond with the edited message only.`;
    const result = await oc.getInstructCompletion({ instruction: prompt, startWith: last.content });
    last.content = result.trim();
  });
})();
```

This ensures the AI remains in character by stripping out unwanted perspective shifts.

## 3. Adding an image based on facial expression

Another example from the community attaches an image to each AI message based on the predicted facial expression.  It defines a list of expressions and associated URLs, uses a language model call to classify the sentiment of the latest message, and appends an image hidden from the AI so as not to influence future responses.

Key steps:

1. Define a mapping of expressions to image URLs.
2. Collect recent messages to provide context.
3. Use `oc.getInstructCompletion()` (or `oc.getChatCompletion()`) to ask the model to choose the index of the facial expression that best fits the latest message.
4. Append a `<img>` tag wrapped in `<!--hidden-from-ai-start-->…<!--hidden-from-ai-end-->` to hide it from the AI.

This pattern demonstrates how you can integrate external assets and hide them from the model while still showing them to the user.

## 4. Executing code blocks via Pyodide

By combining custom code with Pyodide, you can execute Python code that appears in AI messages.  The high‑level flow is:

1. Load Pyodide once and store the interpreter instance.
2. Listen for new AI messages and extract any Python code blocks (text wrapped in triple backticks with `python`).
3. Run the extracted code via `pyodide.runPythonAsync()` and collect printed output or errors.
4. Post a response message to the chat containing the code’s output and any errors.

This allows the AI to serve as an on‑the‑fly Python tutor, executing and explaining code within the conversation.

## 5. Dynamic shortcut buttons

You can dynamically generate shortcut buttons based on the state of the conversation.  For example, build a menu of actions that call `/ai` with different instructions, and assign it to `oc.thread.shortcutButtons`.  Each button object has properties such as `name`, `message`, `autoSend`, `insertionType`, and `clearAfterSend`.  See the [shortcut button lemma](https://theconversationid.com) for details on fields.

Example skeleton:

```javascript
oc.thread.shortcutButtons = [
  { name: "Cheer", message: "/ai give a compliment", autoSend: true, insertionType: "prepend", clearAfterSend: true },
  { name: "Apologize", message: "/ai write a heartfelt apology", autoSend: true, insertionType: "replace", clearAfterSend: true },
];
```

When the user clicks one of these buttons, the associated text is inserted into the reply box or sent automatically depending on `autoSend`.

## Other examples

Perchance’s documentation includes additional examples such as:

- **Image and GIF avatars** that change based on sentiment or context.
- **Text‑to‑speech** integration using the Web Speech API.
- **Random character selection** from a hosted text file.
- **Updating a character’s personality or reminder message** via a refinement step.
- **Embedding Python code for on‑the‑fly calculations**.

See the [Running Python code](ai_character_chat_running_python.md) and [text‑to‑image plugin](perchance_text_to_image_plugin.md) documents for details on these advanced examples.
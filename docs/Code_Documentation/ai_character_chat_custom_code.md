# Perchance AI Character Chat – Custom Code

This document summarizes the **Custom Code** section of Perchance's AI Character Chat documentation.  It explains what the custom code feature is, how it runs, and what capabilities and constraints come with using JavaScript and Python inside your character's definition.  Use this summary when you need an overview of custom code features without reading the entire Perchance help page.

## Overview

Perchance’s AI Character Chat allows creators to add **custom code** to their characters.  Custom code lets you extend the chat experience far beyond the built‑in features by embedding JavaScript (and optionally Python via Pyodide) into the character’s runtime.  This code runs in an isolated iframe that is associated with the chat thread.  The iframe can be shown or hidden via `oc.window.show()` and `oc.window.hide()`, and all code remains active whether the iframe is currently visible or not.

Key points:

- **Iframe environment** – All custom code runs inside an iframe.  It has access to the DOM for that iframe and to the Perchance runtime objects (e.g., `oc.thread`, `oc.character`, `oc.window`).  It does **not** have direct access to the main page’s DOM or global variables.
- **JavaScript & Python** – You can write JavaScript directly.  You may also load Pyodide to run Python code within the same context if needed.  Pyodide is optional and requires loading its runtime, which can be expensive; the [Running Python code](ai_character_chat_running_python.md) document covers this in detail.
- **Persistent state** – Use `oc.thread.customData` to store persistent values for the current chat thread.  Use `oc.character.customData` for character‑wide state that is local to your instance, and `oc.character.customData.PUBLIC` for state that is saved when sharing the character.
- **Event hooks** – Custom code can register callbacks on thread events, such as `oc.thread.on("MessageAdded", handler)` or `oc.thread.on("StreamingMessage", handler)`.  These hooks let you react to new messages, perform analyses, or modify content before the user sees it.
- **LLM helpers** – Perchance exposes helper functions like `oc.getInstructCompletion()` and `oc.textToImage()` (or `oc.getChatCompletion()`) to call out to OpenAI‑style models or image generators.  When you need additional AI‑powered functionality, prefer these built‑in helpers rather than direct network calls.
- **UI rendering** – The iframe can display HTML and CSS.  You can inject elements via `document.body.innerHTML` or build them dynamically.  Use namespaced CSS classes (e.g., `pcbw-…`) to avoid conflicts with other snippets.
- **Security & limits** – Custom code runs in the user’s browser.  Avoid heavy operations that may block the UI.  You cannot assume network connectivity; remote fetches may fail if the user is offline.  Keep code small and efficient, and provide fallbacks or user messaging for network‑dependent features.

## Usage tips

1. **Show/hide the embed** – The embed is hidden by default.  Call `oc.window.show()` to display it and `oc.window.hide()` to hide it.  Even when hidden, your code continues to run, so you can process messages in the background.
2. **Interact with messages** – Listen for message events to modify or annotate them.  For example, you can automatically append an emoji or an image based on the sentiment of the AI’s message.
3. **Persist data** – Use `oc.thread.customData` to store values that should persist across page reloads or message reloads for the same thread.
4. **Avoid global pollution** – Wrap your code in an immediately‑invoked function expression (IIFE) and namespace any global helpers on a unique object to avoid collisions with other snippets.
5. **Testing** – Start small.  Use `console.log()` in your code to debug.  Open the browser console to inspect logs.

## Example: simple message editor

Below is a minimal example that rewrites AI messages to include more emojis.  It registers a callback for new messages, uses `oc.getInstructCompletion()` to instruct the model to rewrite the text, and then replaces the message content.

```javascript
(async () => {
  oc.thread.on("MessageAdded", async () => {
    const lastMsg = oc.thread.messages.at(-1);
    if (lastMsg.author !== "ai") return;
    const instruction = `Rewrite this message with more emojis and respond with only the rewritten message.`;
    const response = await oc.getInstructCompletion({ instruction, startWith: lastMsg.content });
    lastMsg.content = response.trim();
  });
})();
```

This example demonstrates the typical pattern for custom code: listen for an event, call a built‑in LLM helper, and update the message content.  In production code you should add error handling and caching.

## Resources

Because the official Perchance documentation is dynamic and difficult to scrape, this summary relies on the text obtained from the provided `PerchanceDocs.txt` and general knowledge of Perchance’s custom code capabilities.  The GitHub Markdown and MDN CSS documentation are separately summarised in their own files and contain cited lines for reference.
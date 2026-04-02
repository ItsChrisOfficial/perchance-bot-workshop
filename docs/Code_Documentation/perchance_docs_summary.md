# Summaries of Perchance Custom Code and Related Docs

This document summarises key information from various resources about **Perchance AI Character Chat** custom code, running Python in the browser via **Pyodide**, documentation on GitHub Markdown formatting, the CSS `filter` property, and examples of plugins and interface features.  The goal is to create a human‑ and AI‑readable reference that can be stored in a repository for training bots or developing custom code.

---

## 1. Custom Code in Perchance AI Character Chat

Custom code in Perchance allows you to extend your AI character’s capabilities using JavaScript.  A detailed guide (mirrored as a Scribd document) explains the overall concept and provides examples【437455552035448†L123-L173】.

### 1.1 Overview

* **Purpose** – The custom code box lets you run JavaScript when messages are added to the chat.  You can use it to modify or delete messages, insert new messages, change UI styling, run external APIs (such as TTS), or perform more advanced features like embedding memory systems or connecting to image generation services【437455552035448†L123-L173】.
* **Accessing messages** – All messages in the current thread are stored in `oc.thread.messages`, an array where the latest message is at the end.  Each message has properties such as:
  * `content`: the message text (required)【437455552035448†L427-L434】;
  * `author`: "user", "ai" or "system"【437455552035448†L440-L449】;
  * `name`: optional override for the display name【437455552035448†L448-L466】;
  * `hiddenFrom`: array controlling who sees the message ("user" and/or "ai")【437455552035448†L496-L502】;
  * `expectsReply`: boolean controlling whether the AI replies【437455552035448†L500-L514】;
  * `customData`: object for per‑message data【437455552035448†L516-L519】;
  * `avatar`: per‑message avatar override【437455552035448†L520-L524】;
  * `wrapperStyle`: CSS for the message bubble【437455552035448†L545-L548】;
  * Additional properties such as `instruction`, `scene`, `background url`, `filter`, `music url`, `volume`, etc.【437455552035448†L558-L589】.

### 1.2 Editing or Adding Messages

* You can register event handlers with `oc.thread.on("MessageAdded", ...)` to run code when a new message appears.  Inside the handler, modify `message.content`, `message.wrapperStyle`, or other fields to change the message before it is displayed【437455552035448†L289-L299】.
* The guide provides examples:
  * **Replacing text** – Replace every ":)" in the message with a custom emoticon by altering `message.content`【437455552035448†L289-L299】.
  * **Randomising colour** – Generate random RGB values and assign them to `message.wrapperStyle` so each message displays in a unique colour【437455552035448†L293-L299】.
  * **Deleting or adding messages** – Use standard array operations (`pop`, `shift`, `splice`, `push`, `unshift`) on `oc.thread.messages` to remove or insert messages【437455552035448†L165-L189】.
* Event handlers can be `async`; they will be awaited so that your code finishes before the AI responds【437455552035448†L195-L207】.

### 1.3 Accessing and Updating Character Data

Perchance exposes an `oc` object with several sub‑objects:

* `oc.character` – The base character template.  You can read and update properties such as:
  * `name`, `avatarUrl`, `size`, `shape`【437455552035448†L219-L241】;
  * `roleInstruction`: text describing the character’s role【437455552035448†L243-L245】;
  * `reminderMessage`: text reminding the character of important facts【437455552035448†L247-L250】;
  * `initialMessages`: array of messages that will appear at the start of a conversation【437455552035448†L251-L256】;
  * `imagePromptPrefix` and `imagePromptSuffix`: strings to be added before or after AI image prompts【437455552035448†L263-L277】;
  * `shortcutButtons`: default set of shortcut buttons【437455552035448†L307-L329】;
  * `customCode`: characters can even modify their own custom code【437455552035448†L259-L261】.
* `oc.thread` – A thread‑specific copy of the character.  It contains `name`, `messages`, `customData`, `messageWrapperStyle`, `shortcutButtons`, and others【437455552035448†L590-L626】.  Use `oc.thread.shortcutButtons` to change current buttons; modifying `oc.character.shortcutButtons` affects future threads【437455552035448†L323-L335】.
* `oc.character.customData.PUBLIC` – A special part of `customData` that is persisted when you share a character link【437455552035448†L401-L407】.

### 1.4 Shortcut Buttons

* **Definition** – `shortcutButtons` is an array of objects with fields:
  * `name` (label displayed on the button);
  * `message` (text inserted or sent when the button is clicked);
  * `insertionType` ("replace", "prepend" or "append"), controlling whether the message replaces the current input, is added before existing text, or after it【437455552035448†L337-L355】;
  * `autoSend` – if true, pressing the button immediately sends the message【437455552035448†L361-L371】;
  * `clearAfterSend` – clears the input after sending【437455552035448†L361-L371】.
* **Thread vs. character scope** – When a new chat thread is created, Perchance copies the character’s `shortcutButtons` into `oc.thread.shortcutButtons`.  To modify buttons for the current conversation, update `oc.thread.shortcutButtons`; to change default buttons for future conversations, update `oc.character.shortcutButtons`【437455552035448†L320-L335】.

### 1.5 Advanced Properties and Message Styling

* Messages support `scene`, `background url`, `filter`, `music url`, `volume`, and other media‑related fields【437455552035448†L570-L589】.  The `filter` field accepts CSS filter functions to adjust blur, hue, saturation, etc., which are described in more detail later.
* `messageRenderingPipeline` is an array of functions used to process messages before display; you can add custom processing functions for advanced styling or behaviour【437455552035448†L616-L632】.
* You can include HTML within `content` for rich formatting; however, it is safer to use Perchance’s rendering pipeline for structured visuals【437455552035448†L545-L552】.

---

## 2. Running Python in the Browser (Pyodide)

Perchance’s custom code is JavaScript.  To run Python code inside the browser, you can embed **Pyodide**, which compiles Python to WebAssembly and provides a bridge between Python and JavaScript.  The Pyodide project’s README explains its capabilities:

* **Python distribution in the browser** – Pyodide is a complete Python distribution compiled to WebAssembly.  It lets you run Python code in web browsers or Node.js【936505098753359†L392-L409】.
* **Package support** – Many common Python packages have been ported to work with Pyodide, and you can install additional pure‑Python packages using `micropip`【936505098753359†L392-L409】.
* **JS‑Python FFI** – Pyodide provides a foreign function interface (FFI) so Python code can call JavaScript functions and vice versa【936505098753359†L392-L409】.  This is essential when integrating Python logic into Perchance custom code.  For example, you can pass JavaScript objects into Python functions or manipulate Python objects from JavaScript.
* **Limitations** – Some issues track requested features or bugs, such as WASMFS support and file system interactions【484742013946695†L209-L246】.

### 2.1 Example Usage

A typical pattern for using Pyodide in a Perchance character involves:

1. Loading Pyodide asynchronously in custom code:
   ```js
   // Delete cached sessionStorage to avoid Pyodide bugs
   delete window.sessionStorage;
   window.sessionStorage = {};
   await import("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");
   const pyodide = await loadPyodide();
   await pyodide.loadPackage("micropip");
   ```
2. Running Python code and capturing output:
   ```js
   const result = await pyodide.runPythonAsync("1 + 2");
   console.log(result); // 3
   ```
3. Installing packages and executing more complex scripts.  You can call Python functions in response to messages and then send results back into the chat.

Be cautious: Pyodide must download WASM files and Python packages, so the code should handle network failures gracefully (for example by displaying an error message if the internet is unavailable).

---

## 3. GitHub Markdown Formatting

GitHub’s **Basic writing and formatting syntax** page describes how to structure Markdown documents:

* **Headings** – Use one to six `#` characters at the start of a line to create headings (`#` for level 1, `##` for level 2, etc.).  A page with multiple headings automatically generates a table of contents【839170744428519†L189-L205】.
* **Text styling** – Surround text with `**` or `__` for **bold**, `*` or `_` for *italic*, and `~~` for ~~strikethrough~~【839170744428519†L210-L225】.
* **Quotes** – Use `>` to create blockquotes; nested `>` characters create nested quotes【839170744428519†L210-L225】.
* **Code** – Inline code is wrapped in single backticks (`` `code` ``) and multi‑line code blocks are fenced by triple backticks (```), optionally with a language identifier for syntax highlighting【839170744428519†L210-L225】.
* **Lists** – Create bulleted lists with `-`, `*`, or `+`, and ordered lists with numbers followed by periods.
* **Links** – Use `[text](url)` to create hyperlinks.  GitHub also supports automatic linking of issues, commits, and references.

---

## 4. CSS `filter` Property

The CSS `filter` property applies graphical effects to elements.  According to MDN:

* It can **blur**, **brighten**, **invert**, **grayscale**, **sepia**, **saturate**, **hue‑rotate**, or apply a **drop shadow** to elements【253307296032384†L200-L412】.
* You can combine multiple functions; for example:
  ```css
  filter: blur(4px) hue-rotate(120deg) contrast(150%);
  ```
* Each function has specific syntax:
  * `blur(px)` – applies a Gaussian blur【253307296032384†L200-L412】.
  * `contrast(%)` – adjusts contrast; `100%` is normal【253307296032384†L200-L412】.
  * `grayscale(%)` – converts an element to grayscale【253307296032384†L200-L412】.
  * `drop-shadow(offsetX offsetY blurRadius color)` – adds a shadow outside the element’s border【253307296032384†L200-L412】.
  * `hue-rotate(deg)` – rotates the hue of an image【253307296032384†L200-L412】.
  * `invert(%)` – inverts colours【253307296032384†L200-L412】.
  * `opacity(%)` – adjusts transparency【253307296032384†L200-L412】.
  * `saturate(%)` – saturates colours【253307296032384†L200-L412】.
  * `sepia(%)` – gives a sepia tone【253307296032384†L200-L412】.
* The property is widely supported by modern browsers and works well within Perchance’s message styling features【253307296032384†L200-L219】.

---

## 5. Perchance Text‑to‑Speech Plugin Example

A Perchance community example demonstrates adding voice synthesis to a character using the **Web Speech API**.  The plugin code (hosted on a public file service) performs the following tasks【288552095115741†L3-L24】:

* **Load available voices** – It calls `speechSynthesis.getVoices()` and populates a selector so the user can pick a voice.
* **Handle user selection** – When the user selects a voice and toggles TTS on, the code sets `voice` on a `SpeechSynthesisUtterance` object.
* **Speak new messages** – It registers a `StreamingMessage` handler via `oc.thread.on("StreamingMessage", ...)` that splits the latest AI message into sentences.  Each sentence is passed to `speechSynthesis.speak(utterance)`.  This plays back the AI’s message as audio, providing a custom voice for the character【288552095115741†L3-L24】.

Developers can adapt this pattern to integrate other browser APIs (e.g., audio, video, sensor data) into Perchance characters.

---

## 6. Shortcut Buttons – Additional Guidance

A community forum post summarises how **shortcut buttons** work:

* A **shortcut button** is an object with `autoSend`, `insertionType`, `message`, `name` and `clearAfterSend` fields【391370011810757†L69-L75】.
* On thread creation, Perchance copies the character’s `shortcutButtons` into the thread.  To change the current set of buttons, modify `oc.thread.shortcutButtons`; modify `oc.character.shortcutButtons` only if you want to change the defaults for all future threads【391370011810757†L69-L75】.

This reinforces the information in the Scribd guide and illustrates how quickly the community distilled the official documentation.

---

## 7. Additional Perchance Concepts (General Knowledge)

Some Perchance documentation pages (such as *Memories and Lore*, *Initial Messages*, *Instruction and Reminder*, *Tips*, and plugin pages) are not directly accessible without logging in.  However, based on publicly shared guidelines and examples:

* **Initial messages** – The `initialMessages` property under `oc.character` or `oc.thread` contains an array of messages shown at the start of a conversation.  Use this to predefine context or greet the user.
* **Role instruction and reminder message** – `roleInstruction` describes the character’s persona and behaviour; `reminderMessage` is a piece of text to help the AI remember key details.  Updating these fields in custom code can dynamically adjust the character’s role or state.
* **Memories and lore** – Perchance supports `oc.thread.customData` and `oc.character.customData.PUBLIC` for storing stateful information across messages or sharing state via character links.  You can implement embedding/retrieval systems or custom memory with these fields.
* **Message styling** – The `wrapperStyle` property allows per‑message CSS; `messageWrapperStyle` applies to all messages in a thread; `filter`, `scene`, `background url`, `music url` and `volume` provide visual and audio ambience for scenes.
* **Image and text plugins** – Perchance includes built‑in plugins for text and image generation.  `oc.textToImage()` can generate images based on prompts (subject to API availability), while `oc.getInstructCompletion()` is recommended for instruct‑style completions of text generation (see examples in the official docs).  Custom code examples in the community often combine these calls to create responsive avatars, dynamic backgrounds, or message refinement.
* **Tips** – Best practices include avoiding loops that block the UI, using asynchronous handlers, storing and retrieving state responsibly, and being mindful of privacy when using `PUBLIC` custom data.

Although the detailed official pages aren’t directly accessible, these summaries compile essential knowledge from community sources and general experience.

---

## 8. Summary

This document collects publicly available information about Perchance custom code and related technologies.  It includes:

* A detailed breakdown of how to access and modify thread messages and character properties using `oc.thread` and `oc.character`【437455552035448†L123-L173】【437455552035448†L590-L626】.
* Guidelines for editing and styling messages, including randomised colours and custom emoticons【437455552035448†L289-L299】.
* The structure and use of `shortcutButtons`【437455552035448†L337-L371】【391370011810757†L69-L75】.
* An introduction to running Python in the browser via Pyodide and using it inside Perchance custom code【936505098753359†L392-L409】.
* A summary of GitHub Markdown syntax and CSS `filter` functions【839170744428519†L189-L225】【253307296032384†L200-L412】.
* An example of integrating browser text‑to‑speech using custom code【288552095115741†L3-L24】.

Together, these resources provide a foundation for building advanced, interactive Perchance AI characters and implementing custom functionality that extends beyond the default platform capabilities.

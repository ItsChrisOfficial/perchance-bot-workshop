# Perchance AI Character Chat Documentation – Human‑Readable Summary

This document condenses the publicly available **Perchance AI Character Chat** documentation and community resources into a single, structured reference.  It is intended for both humans and AI models and covers usage tips, slash commands, shortcuts, message styling, character instructions, initial messages, memory and lore features, custom code (including Python support via Pyodide), and key external references.

---

## 1. General Tips

* **Use example dialogue** to influence how your character speaks.  A few sample exchanges in the instruction or initial messages give the AI a clear template to follow.
* **Limit your character description** to roughly **500 words** or fewer; if more detail is needed, use the **lorebook** (see §5) to store additional facts.
* **Backup your data** using the export button.  Clearing cookies or site data will remove threads and characters from your device.
* **Import/export formats** – the import button accepts threads, characters, and various external formats.  Unsupported formats can be requested via feedback.
* **Reuse messages** – double‑tap in the reply box to view recent send history; useful for quickly reissuing slash commands or repeated instructions.
* **Explore custom code** (see §7) for advanced functionality: internet access, 3D avatars, voices, or self‑modifying characters【437455552035448†L123-L173】.

---

## 2. Slash Commands

Slash commands control the AI or modify the thread:

| Command | Description |
|---|---|
| `/ai` | Triggers an AI response using the character’s role/reminder.  Add an instruction after the command to change the style (e.g. `/ai write a silly reply`). |
| `/ai @CharName#123 <instruction>` | Directs another character by ID. |
| `/user <instruction>` | Asks the AI to generate a reply on behalf of the user. |
| `/image <description>` | Generates an image with the AI’s built‑in image generator.  Options include `--num` (number of images), `resolution`, `seed`, and `negativePrompt`.  You can embed image tags inside messages using `<image>…</image>`. |
| `/sys <instruction>` or `/system` | Creates a system message, used to guide AI behaviour. |
| `/nar <instruction>` | Shorthand for `/sys @Narrator <instruction>`. |
| `/sum` | Opens the summary editor. |
| `/mem` | Opens the memory editor. |
| `/lore` | Opens the lore editor.  Use `/lore <text>` to add a lore entry. |
| `/name <name>` | Sets your display name in the current thread. |
| `/avatar <url>` | Sets your avatar image in the current thread. |
| `/import` | Bulk‑adds chat messages. |

Notes:
* You can append `/ai <instruction>` to a regular message so that the AI responds according to that instruction after reading your message.
* Double‑click the reply box to recall previous commands.

---

## 3. Shortcuts

* Shortcuts create **buttons** beside the reply box for common actions.  Use the options button to add a shortcut.
* A shortcut’s text can include `<...>` placeholders; the placeholder will be selected after insertion so you can edit it quickly (useful when auto‑send is disabled).
* Example: a shortcut could insert `/ai @Alice#1 <say something witty>` so you only need to fill in Alice’s message.
* For persistent or dynamic shortcuts, refer to custom code and `oc.character.shortcutButtons` (see §7.4).

---

## 4. Instructions and Reminder Messages

### 4.1 Character Instruction (Role)

* The **instruction/role** defines your character’s behaviour.  It should generally be **under 500 words**; longer instructions reduce context available for conversation.
* If you need thousands of words of context, put them into a **lorebook** (see §5) instead.
* When you edit a character’s instruction, **all existing threads** will be updated immediately because instructions belong to the character template.

### 4.2 Reminder Message

* The **reminder** is a short message inserted into the chat just before the AI generates a response.  It should be **under 100 words** to avoid distracting the AI.
* Editing the reminder also updates all existing threads immediately.

### 4.3 Advanced Instruction and Reminder Messages

* You can add **multiple instruction or reminder messages** using the same format as initial messages (see §6).  Use `[AI]`, `[USER]` or `[SYSTEM]` prefixes to specify who “says” each instruction.  Messages marked as `[SYSTEM]` are hidden from both AI and user unless otherwise specified.
* Reminder messages can be “spoken” by the AI (`[AI]: ...`) or set as out‑of‑character thoughts (e.g. `(Thought: …)`), preventing them from showing up as normal messages.
* Instructions and reminders do **not** influence the chat summariser, unlike normal messages, so they remain at the top of the conversation.

---

## 5. Memories and Lore

* **Memories** – When summarisation is enabled, the AI automatically condenses older messages into “memories.”  These memories are searchable and are used by the AI before replying.  Access them with `/mem`.
* **Lore** – A separate store of facts, not tied to chronology.  You can add lore via `/lore` for the current thread or add **lorebook URLs** in the character editor for persistent lore.  Each entry must be self‑contained; avoid references like “he” or “she” without context.
* **Reloading lore** – When you update lorebook URLs, existing threads will not automatically refresh; open `/lore` and reload entries manually.
* Lore entries are dynamic reminders: only relevant entries are loaded into the AI’s context, preserving space for the conversation.

---

## 6. Initial Messages

Initial messages help establish context for the AI at the start of a conversation.  The syntax is:

```text
[AI]: This is the first AI message.
[USER]: This is the user’s response.
[AI]: Second AI message.
[SYSTEM]: System messages provide guidance.
```

Key features:

* Use `hiddenFrom` to hide a message from the AI or the user (e.g. `[AI; hiddenFrom=user]: …`, `[SYSTEM; hiddenFrom=ai]: …`).
* Use `name=…` to set a custom display name for a message (e.g. `[SYSTEM; name=Bob]: …`).
* Combine properties with commas (e.g. `[SYSTEM; name=Bob, hiddenFrom=ai]: …`).
* Multi‑line messages are supported; blank lines are allowed inside messages.
* Messages accept Markdown and HTML; use this to embed images, code blocks, or hyperlinks.
* You can include tips/instructions and media (images or links) for the user in hidden system messages.

---

## 7. Custom Code

Custom code allows characters to perform arbitrary actions in response to chat events.  The documentation and community examples provide guidance.

### 7.1 Overview

* The **custom code** box accepts JavaScript that runs inside the chat’s iframe【437455552035448†L123-L173】.  It executes when the thread loads and whenever messages are added.
* Use `oc.thread.on("MessageAdded", callback)` to run code when any message is added.  In the callback you can inspect or modify messages, delete them, or add new ones【437455552035448†L165-L189】.
* Event handlers can be `async`; they are awaited, ensuring your modifications complete before the AI responds【437455552035448†L195-L207】.
* The `oc` object exposes thread and character data (see §7.4).  It includes `oc.thread` (per‑thread state), `oc.character` (character template), and `oc.thread.messages` (an array of messages)【437455552035448†L219-L256】.
* Use `oc.generateText({instruction, startWith?})` to request AI completions in custom code examples.  Newer examples recommend `oc.getInstructCompletion()` over `oc.getChatCompletion()` for instruct‑style tasks.

### 7.2 Modifying Messages

* **Editing content** – You can replace, insert, or delete messages by manipulating `oc.thread.messages` and message properties like `message.content`, `message.wrapperStyle`, `message.customData`, etc.【437455552035448†L165-L189】.
* **Example** – Replace every `:)` with a cute emoticon:
  ```js
  oc.thread.on("MessageAdded", function({message}) {
    message.content = message.content.replaceAll(":)", "૮ ˶ᵔ ᵕ ᵔ˶ ა");
  });
  ```
* **Randomise style** – Use `message.wrapperStyle` to assign a random colour:
  ```js
  oc.thread.on("MessageAdded", function({message}) {
    const red   = Math.round(Math.random() * 255);
    const green = Math.round(Math.random() * 255);
    const blue  = Math.round(Math.random() * 255);
    message.wrapperStyle = `color: rgb(${red}, ${green}, ${blue});`;
  });
  ```
* **Deleting/adding messages** – Use `pop`, `shift`, `splice`, `push` or `unshift` on `oc.thread.messages` to remove or insert messages【437455552035448†L165-L189】.

### 7.3 Examples

1. **Refinement step** – After the AI writes a message, rewrite it with more emojis:

   ```js
   oc.thread.on("MessageAdded", async function() {
     const lastMessage = oc.thread.messages.at(-1);
     if (lastMessage.author !== "ai") return;

     const instruction = `Rewrite this message with extra emojis:\n---\n${lastMessage.content}\n---`;
     const response = await oc.generateText({instruction});
     lastMessage.content = response;
   });
   ```

2. **Prevent actions on user** – Edit AI messages to remove actions involving the user:

   ```js
   oc.thread.on("MessageAdded", async function () {
     const msg = oc.thread.messages.at(-1);
     if (msg.author !== "ai") return;
     const instruction = `Remove any actions by characters other than ${msg.name} from the following:\n---\n${msg.content}\n---`;
     const result = await oc.generateText({instruction});
     msg.content = result.trim();
   });
   ```

3. **Append emotion images** – Classify the latest AI message’s emotion and append an image (example: using a list of labels and URLs).  A hidden comment ensures the AI does not see the appended image.  See the documentation for the full implementation.

### 7.4 The `oc` Object

The `oc` object contains the entire chat state:

* **`oc.character`** – The base character template.  Properties include:
  * `name`, `avatar.url`, `avatar.size`, `avatar.shape`【437455552035448†L219-L241】;
  * `roleInstruction`, `reminderMessage`, `initialMessages`, `customCode`【437455552035448†L243-L256】;
  * `imagePromptPrefix`, `imagePromptSuffix`, `imagePromptTriggers`【437455552035448†L263-L277】;
  * `shortcutButtons` – default buttons for future threads.  Each button has fields like `insertionType`, `autoSend`, `clearAfterSend`, `name`, and `message`【437455552035448†L320-L371】.  When a new thread is started, a snapshot is copied into `oc.thread.shortcutButtons`【437455552035448†L320-L335】.
  * `customData.PUBLIC` – data persisted when sharing the character link【437455552035448†L401-L407】.

* **`oc.thread`** – Thread‑specific properties:
  * `name`, `messages` (an array of message objects), `customData`, `messageWrapperStyle`, `shortcutButtons`【437455552035448†L590-L626】.
  * Each **message** has properties like `content` (required), `author` (user/ai/system), `name` (override), `hiddenFrom`, `expectsReply`, `customData`, `avatar`, `wrapperStyle`, `instruction`, and `scene` (with subfields: `background.url`, `background.filter`, `music.url`, `music.volume`)【437455552035448†L427-L589】.
  * `character`, `userCharacter`, `systemCharacter` – thread‑specific overrides for names, avatars, reminder/role messages【437455552035448†L590-L610】.

* **`messageRenderingPipeline`** – An array of processing functions run on messages before display; allows advanced visual or content transformations【437455552035448†L616-L632】.

* **`oc.generateText()` / `oc.getInstructCompletion()`** – Request AI completions with instructions; recommended to use instruct‑style completions for best results.

### 7.5 Running Python Code (Pyodide)

Perchance custom code is JavaScript, but you can embed Python with **Pyodide** (see [pyodide/pyodide](https://github.com/pyodide/pyodide)).  Pyodide compiles CPython to WebAssembly, allowing Python to run in the browser【936505098753359†L392-L409】.  Key points:

* **Setup** – Clear `window.sessionStorage`, then import the Pyodide loader:
  ```js
  delete window.sessionStorage;
  window.sessionStorage = {};
  await import("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");
  const pyodide = await loadPyodide();
  await pyodide.loadPackage("micropip");
  ```
* **Running code** – Use `await pyodide.runPythonAsync("1+2+3")` or define Python functions and call them from JavaScript.  To install pure‑Python packages, call `await pyodide.runPythonAsync("import micropip; await micropip.install('numpy')")`【875†L8-L27】.
* **Example** – Execute Python code blocks found in AI messages and post the result back to the chat (see example in the documentation).  The script listens to `MessageAdded`, extracts code blocks, runs them via `runPythonAsync`, collects stdout and stderr, and sends the output as a new message.
* Pyodide must download WebAssembly files and packages, so custom code should handle network failures gracefully.  Some packages may not be available yet; requests can be filed on Pyodide’s GitHub issues page【875†L1-L10】.

### 7.6 Custom Code Examples

The documentation includes many examples; a few notable ones include:

* **Refinement step** – rewriting the AI’s message based on a given instruction (see §7.3).  Use this to enforce style guidelines, add emojis, or correct the message.
* **Image generation and classification** – using the AI’s text‑to‑image plugin and a custom classification step to append an emotion image to each message.
* **Voice synthesis** – integrating a text‑to‑speech plugin via the Web Speech API to give characters spoken voices【288552095115741†L3-L24】.
* **Internet access and summarisation** – using custom code to fetch and summarise webpages or PDFs by downloading the content, processing it (e.g. with the [Readability](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Readability) library), and inserting a system message with the summary.
* **Stop sequences** – adding `oc.character.stopSequences = [":)"]` prevents the AI from generating certain text sequences.

---

## 8. Message Styling (CSS)

You can customise the appearance of messages via **message style** (character editor) or per‑message `wrapperStyle` (custom code).  Key points:

* The syntax is standard CSS.  Each rule ends with a semicolon.  To specify different colours for light and dark mode, use `light-dark(lightValue, darkValue)`.
* **Examples**:
  * `color: blue; font-size: 90%;` – Blue text, slightly smaller.
  * `font-weight: bold; color: green;` – Bold green text.
  * `text-shadow: 0 0 2px #ff8400;` – Orange glow around text.
  * `background-color: white; border-radius: 10px;` – White bubble with rounded corners.
  * `background-image: url(...);` – Add a background image to each message.
  * `backdrop-filter: blur(10px);` – Frosted glass effect on the background.
  * `font-family: 'Nova Square';` – Use a custom font from Google Fonts.  Always wrap font names in single quotes.
* **Developers** – Use `oc.thread.on("MessageAdded", …)` to override message styling programmatically (see §7.2).  The `filter` property in `scene.background` accepts any CSS filter functions, such as `hue-rotate(90deg) blur(5px)`, described in MDN【253307296032384†L200-L412】.

---

## 9. External References

* **Pyodide project** – Pyodide is a WebAssembly‑based Python distribution that runs in browsers and Node.js【936505098753359†L392-L409】.
* **Pyodide issues** – The issues page includes feature requests and bug reports; these highlight current limitations and new functionality under discussion【484742013946695†L209-L246】.
* **GitHub Markdown syntax** – Basic writing and formatting guidelines, including headings, lists, bold/italic text, blockquotes, code blocks, and automatic table of contents【839170744428519†L189-L225】.
* **MDN CSS `filter` property** – Describes graphical effects like `blur`, `contrast`, `hue‑rotate`, `sepia`, etc., with examples and broad browser support【253307296032384†L200-L412】.
* **Perchance text‑to‑speech plugin** – Example code uses the Web Speech API to give characters a voice【288552095115741†L3-L24】.
* **Community discussion on shortcut buttons** – Clarifies that `shortcutButtons` is an array of objects (`name`, `message`, `insertionType`, `autoSend`, `clearAfterSend`); modifying `oc.thread.shortcutButtons` changes buttons in the current thread, while modifying `oc.character.shortcutButtons` changes defaults for future threads【391370011810757†L69-L75】.

---

## 10. Conclusion

This summary brings together the key features of **Perchance AI Character Chat** and provides references for further exploration.  With slash commands, shortcuts, detailed control over messages, custom code, Python integration, memory and lore systems, and styling options, Perchance offers deep customisation for interactive character experiences.  By understanding the structure of the `oc` object and using the examples provided, creators can build richly functional bots that behave consistently and respond intelligently.

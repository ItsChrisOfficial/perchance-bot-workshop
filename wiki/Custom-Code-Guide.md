# Custom Code Guide

`customCode` is a character-level field that contains runtime JavaScript for Perchance bots. It is the most common source of export failures because it must survive **two parsers**: JSON parsing and JavaScript parsing.

## The Dual-Parser Problem

`customCode` is stored as a **JSON string value**. This means:

1. The JavaScript must be valid source code
2. That source code must be properly escaped as a JSON string
3. After JSON parsing unescapes it, the result must still be valid JavaScript

### What goes wrong

- Raw newlines in the JSON string → JSON parse fails
- Unescaped quotes → JSON parse fails
- Template literals with `${...}` not properly escaped → broken JS after parse
- Hand-assembled escaping → subtle breakage that looks right but isn't

## Safe Authoring Workflow

### ✅ Correct workflow

1. Write JavaScript as **normal source code** (not inside JSON)
2. Place that source into the `customCode` field in a JavaScript/Python object
3. Serialize the **entire export object** with a JSON serializer (`JSON.stringify`)
4. Parse the resulting JSON back to verify it round-trips
5. Extract `customCode` and run a JavaScript syntax check

### ❌ Wrong workflow

1. Write JSON by hand
2. Paste raw JavaScript into the JSON string
3. Guess the escaping
4. Assume it will import

This is how broken exports get shipped.

### Example (Node.js)

```javascript
const fs = require('fs');

// 1. Load the export template
const exportObj = JSON.parse(fs.readFileSync('template.json', 'utf8'));

// 2. Write customCode as normal JavaScript
const customCode = `
(() => {
  oc.thread.on("MessageAdded", function() {
    console.log("Message added!");
  });
})();
`;

// 3. Assign it to the character row
exportObj.data.data[0].rows[0].customCode = customCode;

// 4. Serialize with JSON.stringify (handles escaping automatically)
const output = JSON.stringify(exportObj, null, 2);

// 5. Verify round-trip
const parsed = JSON.parse(output);
const extracted = parsed.data.data[0].rows[0].customCode;

// 6. Syntax-check the extracted code
new Function(extracted); // throws if invalid JS

fs.writeFileSync('my-bot-export.json', output);
```

## Perchance Runtime Environment

Custom code runs in the Perchance `oc` (object context) environment.

### Common `oc` APIs

```javascript
// Events
oc.thread.on("MessageAdded", function() { ... });
oc.thread.on("MessageDeleted", function() { ... });

// Thread messages
oc.thread.messages.push({ content: "...", author: "system" });
oc.thread.messages.splice(index, count);

// Character properties
oc.character.name = "Bot Name";
oc.character.roleInstruction = "...";

// Text generation
oc.generateText({ prompt: "..." });

// Image generation
oc.textToImage({ prompt: "..." });

// Rendering pipeline
oc.messageRenderingPipeline.push({ ... });

// UI windows
oc.window.show();
oc.window.hide();

// Shortcut buttons (runtime)
oc.thread.shortcutButtons = [ ... ];
```

### Custom data initialization

Always guard against missing nested objects:

```javascript
oc.thread.customData ||= {};
oc.character.customData ||= {};
```

## Best Practices

### Structure

- Wrap larger systems in an IIFE to avoid polluting global scope:

```javascript
(() => {
  // bot code here
})();
```

- If globals are needed for `onclick` handlers, make them deliberate and namespaced
- Guard against duplicate initialization

### Message objects in code

When creating messages at runtime, use fully-formed message objects:

```javascript
oc.thread.messages.push({
  content: "System notification",
  author: "system",
  expectsReply: false,
  hiddenFrom: ["ai"]
});
```

### Stability

- Do not assume optional nested objects already exist
- Avoid brittle DOM dependencies unless the feature truly requires iframe UI
- Do not leave debug-only logs or dead handlers in release code
- Do not leave `TODO` placeholders in release output

## Common `customCode` Failures

| Failure | Cause | Fix |
|---|---|---|
| JSON parse error | Raw newlines or unescaped quotes in string | Use `JSON.stringify` to serialize |
| JS syntax error after parse | Unterminated template literal or string | Check JS syntax after extraction |
| `customCode` is not a string | Stored as object/number instead of string | Ensure field is a string type |
| Duplicate initialization | Code runs multiple times without guard | Add initialization guards |
| Broken escaping | Hand-assembled JSON string | Always serialize programmatically |

## Validation

After building your `customCode`:

1. Run the export validator:
   ```bash
   node scripts/validate-perchance-export.js /path/to/export.json
   ```

2. The validator checks that `customCode`:
   - Is a string type
   - Contains valid JavaScript syntax (parsed after JSON extraction)

See [Validation and Testing](Validation-and-Testing.md) for the full validation workflow.

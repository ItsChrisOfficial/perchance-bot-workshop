# Perchance Text‑to‑Speech Plugin (Speech Synthesiser)

This document summarises an example **text‑to‑speech (TTS) plugin** for Perchance.  The plugin uses the browser’s Web Speech API to speak characters’ messages aloud.  It illustrates how to build a custom text‑to‑speech helper within Perchance’s **custom code** environment.

## Overview

The plugin loads available voices from the browser’s `speechSynthesis` API, presents a simple UI for the user to choose a voice, and then listens to the **streaming message** events from Perchance.  As the AI’s message arrives in chunks, the plugin accumulates characters until it detects a sentence terminator (a period, exclamation mark or question mark).  It then speaks the complete sentence before continuing with the next one.

## Voice loading and selection

Because Chrome sometimes returns an empty voice list on first call, the plugin repeatedly polls `speechSynthesis.getVoices()` until a non‑empty array is returned:

```js
// Wait until voices are available
while (speechSynthesis.getVoices().length === 0) {
  await new Promise(r => setTimeout(r, 10));
}

const availableVoices = speechSynthesis.getVoices()
  .map(v => v.name)
  .sort((a, b) => a.toLowerCase().includes("english") ? -1 : 1);
window.chosenVoiceName = availableVoices[0];
```

The list of voice names is sorted to favour English voices and stored globally as `window.chosenVoiceName`.  A simple HTML interface is injected into the TTS iframe to allow voice selection:

```js
document.body.innerHTML = `
  Please choose a voice:<br>
  <select onchange="window.chosenVoiceName=this.value;">
    ${availableVoices.map(n => `<option>${n}</option>`).join("")}
  </select>
  <br>
  <button onclick="oc.window.hide();">submit</button>
  <br><br>
  (As you can see, this plugin is pretty rudimentary for now.  Feel free to ask for more features on the Discord.)
`;
oc.window.show();
```

The plugin uses `oc.window.show()` and `oc.window.hide()` to display and hide the voice‑selection dialog.

## Listening for streamed messages

Perchance emits a **StreamingMessage** event whenever the AI sends a message.  The plugin attaches a listener:

```js
let sentence = "";
oc.thread.on("StreamingMessage", async function (data) {
  for await (let chunk of data.chunks) {
    sentence += chunk.text;
    // Check for sentence terminators
    const endIdx = Math.max(
      sentence.indexOf("."),
      sentence.indexOf("!"),
      sentence.indexOf("?")
    );
    if (endIdx !== -1) {
      // Speak the sentence up to the terminator
      await textToSpeech({
        text: sentence.slice(0, endIdx + 1),
        voiceName: window.chosenVoiceName,
      });
      // Remove the spoken part and trim leading punctuation/spaces
      sentence = sentence.slice(endIdx + 1).replace(/^[.!?\s]+/g, "");
    }
  }
});
```

The listener accumulates partial text in `sentence` until a full sentence is formed, then calls a helper function to speak it.

## Speaking a sentence

The helper function constructs a `SpeechSynthesisUtterance` with the selected voice.  It returns a promise that resolves when speaking finishes:

```js
function textToSpeech({text, voiceName}) {
  return new Promise((resolve, reject) => {
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.rate = 1.2;  // adjust speed here
    utterance.pitch = 1.0; // adjust pitch here
    utterance.onend = () => resolve();
    utterance.onerror = e => reject(e);
    speechSynthesis.speak(utterance);
  });
}
```

You can customise the **rate** and **pitch** to achieve different speaking styles.  If no voice matches the selected name, the default browser voice is used.

## How to use

1. Paste the plugin code into the **custom code** editor of your character.
2. Open your character chat.  The voice selection dialog appears.  Choose a voice and click **submit**.
3. When the AI writes a message, the plugin will start speaking it sentence by sentence.
4. You can hide the TTS window by calling `oc.window.hide()`.  The speaking continues in the background.

## Considerations and extensions

- **Browser support**: The plugin relies on the [Web Speech API](https://developer.mozilla.org/en‑US/docs/Web/API/Web_Speech_API) which is supported in major browsers (Chromium‑based, Safari, Firefox with flags).  Voice availability varies by platform.
- **Sentence detection**: The plugin uses a simple heuristic to split sentences (`.`, `!`, `?`).  Punctuation inside numbers or abbreviations may cause mid‑sentence splits.  Consider extending the logic to better detect sentence boundaries.
- **Custom UI**: You can replace the basic HTML with a more sophisticated interface that includes volume controls, preview playback, or persistent settings stored in `oc.thread.customData`.
- **Language filtering**: Sort voices differently or filter by language to present only relevant voices.
- **Streaming**: The plugin speaks as the AI generates, which can be more natural for long messages.  For single final messages, you could buffer the full text instead.

This summary explains how the example **text‑to‑speech plugin** for Perchance works.  By adapting the code, you can give your characters a voice, use speech synthesis for notifications, or create interactive audio experiences in your Perchance generators.
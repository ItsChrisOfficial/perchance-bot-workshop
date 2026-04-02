# Perchance Text‑to‑Image Plugin

This document summarises the **text‑to‑image plugin** for Perchance.  The plugin lets you generate images from textual prompts using a server‑side model.  Because the model runs on GPUs, not in your browser, ad banners will appear for non‑logged‑in users when this plugin is imported; remove the plugin to remove the ads.

## Importing and basic usage

To use the text‑to‑image plugin, import it in your lists editor:

```text
image = {import:text‑to‑image‑plugin}
```

Define a prompt and call `[image(prompt)]` anywhere in your generator.  A minimal example:

```text
character
  a {mech|demon|cyberpunk} {warrior|minion|samurai}

place
  soviet russia
  a small village
  a mountainous region
  an underwater cavern

season
  winter
  summer

prompt
  detailed painting of [character] in [place], [season]

output
  [image(prompt)]
```

Write `[output]` in the HTML editor to display the image.  Hovering over the generated image (or long‑pressing on mobile) shows the prompt used.  The special variable `lastTextToImagePrompt` stores the most recent prompt; you can display it with something like `[image(prompt)]&nbsp;<br>&nbsp;[lastTextToImagePrompt]`.

The `prompt` list is evaluated each time it is used, so the prompt (and resulting image) will change if the list contains randomness.  To display the prompt text above the image and re‑use the exact prompt, evaluate the list once:

```text
output
  [p = prompt.evaluateItem] <br> [image(p)]
```

## Customising prompts and options

You can supply additional options in two ways:

1. **Prompt data object.**  Create a list with your desired prompt and options:

   ```text
   promptData
     prompt = painting of [character] in [place], [season]
     seed = 123                     // optional random seed; ‑1 chooses a random seed
     size = 400                     // image size; only valid for square resolutions
     style = border:4px solid blue; margin‑top:20px; // CSS applied to the resulting <img>
   ```

   Then call `[image(promptData)]`.  The plugin attaches `.lastUsedPrompt` to this object so you can reference the exact prompt used.

2. **Inline options in the prompt.**  Append `(name:::value)` pairs to your prompt text.  For example:

   ```text
   prompt
     [character] in [place] (size:::400) (seed:::123)

   output
     [image(prompt)]
   ```

   Options must appear at the end of the prompt and follow the `(name:::value)` format.  Omit settings you don’t need.

### Available options

- **seed** – A number controlling image randomness.  A seed of **‑1** (default) picks a random seed.  Using the same seed with the same prompt will generate similar images.
- **size** – Size of a square image; only valid for square resolutions.
- **resolution** – Resolution of the generated image.  Valid values are `512x512`, `512x768` and `768x512`.  You can also specify `width` and `height`; if one dimension is omitted, it is automatically calculated based on the chosen aspect ratio.
- **negativePrompt** – Comma‑separated list of elements you don’t want.  For example: `negativePrompt = blur, blurry image, motion blur` reduces blurriness.
- **guidanceScale** – Controls how closely the output matches the prompt.  Default is `7`; minimum `1`, maximum `30`.  Higher values make the image more literal at the expense of realism.
- **style** – CSS applied to the image; can adjust border, margin, etc.
- **hideGalleryButtons** – If `true`, hides the gallery buttons that appear when you hover over an image.
- **saveTitle** / **saveDescription** – Strings used when saving the image to a public gallery.  If omitted, the title defaults to the part of the prompt before the first punctuation mark; the description defaults to the full prompt.

## Galleries and moderation

After an image finishes generating, hovering over it shows buttons to **download**, **save to gallery**, or **open the gallery**.  To hide these gallery buttons, set `hideGalleryButtons = true` in your `promptData`.

To embed a gallery on your page, define a `galleryOptions` list:

```text
galleryOptions
  gallery = true
  sort = top                // or 'recent' or 'trending'
  timeRange = 1‑week        // 1‑day, 3‑day, 1‑week, 1‑month, 1‑year or all‑time
  hideIfScoreIsBelow = -2   // remove images with sufficiently negative votes
  adaptiveHeight = true     // expand height to fit all images
  style = ...               // optional CSS
  customButton = ...        // see below
  customButton2 = ...       // see below
  defaultGalleryNames = characters,memes,chat
```

Then embed it in your HTML editor:

```text
[image(galleryOptions)]
```

### Moderation

You can moderate the gallery by banning users or phrases.  In `galleryOptions`, specify:

- **bannedUsers** – List of user IDs to ban.  Get a user ID by toggling **admin mode** (click the settings button and type `admin`) and double‑clicking an image.
- **bannedPromptPhrases** – List of prompt phrases to ban.  You can prefix an entry with `pg13:` to apply it only in PG‑13 mode, or use regular expressions between slashes.  For example: `pg13:blood` bans the word “blood” in PG‑13 mode.  `/(twin.?towers?)/` bans various forms of “twin towers”.
- **bannedNegativePromptPhrases** – List of negative prompt phrases to ban.

### Custom buttons

You can add a **custom button** to every gallery image.  Define the button inside `galleryOptions`:

```text
customButton
  emoji = ⭐
  onClick(data) =>
    // data.imageId, data.imageUrl, data.userId, data.prompt, data.negativePrompt, data.guidanceScale, data.seed, data.galleryName
    console.log(data);
```

Add `customButton2` similarly for a second button.  Use the `data` object to implement your own functionality such as opening a full‑screen image, adding comments, or performing other actions.

## Advanced usage in JavaScript

You can call the plugin directly in JavaScript functions in your custom code.  The function returns a **String** with extra properties:

```js
async start() => {
  let result = await image({prompt: "a cute mouse"});
  document.body.append(result.canvas);  // append canvas element
  imageEl.src = result.dataUrl;         // or use result directly as the src
  console.log("prompt used:", result.inputs.prompt);
  console.log("all inputs:", result.inputs);
}

// simplified call
async start() => {
  imageEl.src = await image("a cute mouse");
}

// specify options in second argument
imageEl.src = await image("a cute mouse", {resolution: "512x768", removeBackground: true});
```

When passed a plain string, the plugin interprets it as the prompt.  The returned value is both a string (containing the data URL) and an object with properties:

- `.canvas` – The HTML5 `<canvas>` element containing the image.
- `.dataUrl` – The data URL representing the image.  Equivalent to the string itself.
- `.iframe` – The hidden iframe used for generation.  After generation, it exposes `.textToImagePluginOutput` with the `canvas`, `dataUrl`, and the input values.

## Notes and best practices

- **Images are not stored on the server** unless users explicitly save them to a gallery.  Each generated image exists only in the client’s browser.
- **Prompt quality matters.**  Small wording changes can dramatically affect results.  Use a separate generator (e.g., a prompt tester) to experiment.
- You can name your settings list anything.  If you call it `promptSettings`, write `[image(promptSettings)]` to use it.  Multiple settings lists can be used in one generator.
- **Seeds**: Provide any integer; a seed of `‑1` is the default and means “choose a random seed”.  Using the same seed with the same prompt aims to produce similar images, but minor differences may appear due to GPU hardware.
- **Retrying**: If using a seed of `‑1`, a “try again” button appears when hovering over the image.  To add your own retry button that reloads the image, set `id=yourImageId` in your `promptData` and include `<button onclick="yourImageId.reload()">try again</button>` in your HTML.
- **NSFW content**: The model will honour prompts; avoid NSFW terms to avoid NSFW outputs.  Add terms such as “NSFW” or “nudity” to the `negativePrompt` to steer images away from unwanted content.  You can also add “fully clothed” to your prompt.
- **Concurrency limits**: Each user can only have a few concurrent server requests.  When generating many images, requests will queue.
- **Ad‑viewer Appreciation Day**: On the 19th of each month, Perchance celebrates the users who view ads to fund the GPU servers.  Remember and appreciate these anonymous benefactors!
- **More plugins**: See [perchance.org/plugins](https://perchance.org/plugins) for additional plugins and examples.

This summary covers the essentials of using the **text‑to‑image plugin** in Perchance.  Combine it with the **AI text plugin** or your own custom code to create rich, interactive generators.
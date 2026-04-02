 text-to-image plugin: This plugin allows you input some text and get an image out. It doesn't run on your actual device like other Perchance plugins because it requires too much computational power (and would require a 3GB download), so it runs on server GPUs, which means it costs me money to run. For this reason, this plugin is funded with ads, so an ad will appear on your generator for non-logged-in users if you import this plugin. The ad will appear at the bottom of the screen like this. The ad will go away if you remove the plugin, of course. Please see the notes at the end of this page for more info.  
To use this plugin, you'll first need to import it by adding this line to your lists editor:  
image = {import:text-to-image-plugin}  
And now try putting this in your lists editor:  
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
Now just write [output] in the HTML wherever you want an image to appear. Here's a live, working example of what that outputs:  
  
randomize  
You can hover your mouse over the image (or long-press on mobile) to see the prompt that was used, or click the info icon in the corner of the image. You can also manually display the prompt below the image by using the special lastTextToImagePrompt variable that this plugin creates:  
output  
  [image(prompt)] <br> [lastTextToImagePrompt]  
Here's an example generator that uses the above code. Try playing around with the lists and saving your own copy.  
As the name suggests, [lastTextToImagePrompt] will always contain the most recently used prompt. If you instead wrote [image(prompt)] … [prompt] then the prompt used to generate the image (seen on hover) and the prompt output under the image would be different, because each time prompt is evaluated, it is randomized (it's just a normal Perchance list, after all).  
If you want the prompt text to be above/before the image, you can do that like this:  
output  
  [p = prompt.evaluateItem] <br> [image(p)]  
Here's an example generator that uses the above code. And this example shows how to add multiple images to your generator.  
Here's an example generator that has multiple images and also allows the user to input a text prompt.  
There are some options/settings that you can set two different ways - the first is by putting them in a promptData list like this:  
promptData  
  prompt = painting of [character] in [place], [season]  
  seed = 123  
  size = 400  // size is only a valid property for square resolutions  
  style = border:4px solid blue; margin-top:20px; // CSS styles  
You'd then write [image(promptData)] to generate an image using those settings (and in this case you can use [promptData.lastUsedPrompt] instead of [lastTextToImagePrompt] to get the prompt that was used if you want).  
The second way is to put the options directly in your prompt text like this:  
prompt  
  [character] in [place] (size:::400) (seed:::123)  
    
output  
  [image(prompt)]  
Here's an example generator that has the options/settings within the prompt text itself. The options should always be at the end of the prompt, and should follow the (name:::value) format.  
You can of course omit settings that you don't want to customize.  
You can choose between 3 different resolutions using the resolution. The valid resolution values are 512x512, 512x768 and 768x512:  
promptData  
  prompt = fantasy {forest|city|village|cafe|cavern|island|plains|castle|canyon|supercity|megalopolis}, extremely detailed oil painting, unreal 5 render, rhads, bruce pennington, studio ghibli, tim hildebrandt, digital art, octane render, beautiful composition, trending on artstation, award-winning photograph, masterpiece  
  resolution = 512x768  
  width = 400  // height will be auto-chosen based on aspect ratio if omitted, and vice versa for width  
Here's an example generator that uses the above code, and here's a live demo of that:  
  
randomize  
There are a couple of other parameters to play with:  
	•	negativePrompt: Tell the AI what you don't want in the image. E.g. if you don't want any blurriness in the output image, you'd write something like negativePrompt = blur, blurry image, motion blur. Here's an example generator showing this feature.  
	•	guidanceScale: Roughly speaking, this controls how much the output image "matches" the prompt. You can make the value higher to make the output "match" the prompt more, at the expense of realism. The default value is 7, the minimum is 1, and the maximum is 30.  
You'll notice that when you hover your mouse over the image there's a button which opens a menu that allows you to save images to a public gallery (for your generator), and to display said gallery. You can set the title and description that a gallery image will be saved with like this:  
promptData  
  prompt = ...  
  saveTitle = ...  
  saveDescription = ...  
If you don't set a saveTitle and saveDescription, then by default the title will be the part of the prompt that comes before the first full-stop/comma/question-mark/exclamation-mark, and the description will be the whole prompt.  
After an image has finished generating, if you mouseover it, you'll notice some buttons. One of the buttons opens a menu which shows a button to download the image, and to save to a gallery, or to open the gallery. You can hide the gallery buttons like this:  
promptData  
  prompt = ...  
  hideGalleryButtons = true  
Gallery Options  
If you'd like to display the gallery on your page, rather than users having to click the button to open it, you can use "special" options list with the gallery property like this:  
galleryOptions  
  gallery = true  
  sort = top // or 'recent' or 'trending'  
  timeRange = 1-week  
  hideIfScoreIsBelow = -2 // images will be removed if they get down-voted to a score below -2  
  adaptiveHeight = true // expand height to fit all images (so there's no scrollbar on the gallery)  
  style = ... // optional CSS styles (you can delete this line)  
  customButton = ... // see below for details  
  customButton2 = ... // see below for details  
  defaultGalleryNames = characters,memes,chat // clickable gallery names displayed by default  
And then just put this in your HTML editor (bottom-right editor):  
[image(galleryOptions)]  
The valid values for timeRange are: 1-day, 3-day, 1-week, 1-month, 1-year, all-time. Here's an example generator that displays the gallery.  
Gallery Moderation  
You can ban users and prompt phrases from the gallery using the bannedUsers, bannedPromptPhrases, and bannedNegativePromptPhrases options. Have a look at this example to see these features in action.  
galleryOptions  
  gallery = true  
  // ...  
  bannedUsers // click the settings button at the top of the gallery and type "admin" to toggle admin mode on, then double-click on an image to get the user ID of the creator.  
    263efb15c47c2d2f398e91bf169f50d4a0ca69251638c9d0eb5823c0e4fba538  
    f50d4a0ca69251638c9d0eb5823c0e4fba538263efb15c47c2d2f398e91bf169  
  bannedPromptPhrases  
    pg13:blood // ban the word 'blood' in pg13 mode  
    /twin.?towers?/ // example of 'regex'-based pattern matching to ban 'twin towers' or 'twin-tower' or 'twin_towers', and so on  
    pg13:/\b(gore|blood)\b/i // another example of 'regex'-based pattern matching - uses word boundaries and case-insensitive matching  
  bannedNegativePromptPhrases  
    pg13:wearing clothes // ban the word 'wearing clothes' in the *negative* prompt when in pg13 mode  
You can click the settings button at the top of the gallery and type "admin" to toggle on "admin mode". This will show images that contain banned phrases with a red border instead of hiding them (useful for debugging regexes and ensuring that your ban lists aren't banning harmless prompts), and you can double-click on any image to get the user ID of the creator. Again, look at this example, for an example of these moderation features.  
Custom Buttons in Gallery  
You can add a custom button to each gallery image, and when the user clicks it, you can run some code based on that:  
galleryOptions  
  gallery = true  
  customButton  
    emoji = ⭐  
    onClick(data) =>  
      // This code runs when the user clicks on the custom button.  
      // The 'data' variable includes information about the image they clicked your custom button on: data.imageId, data.imageUrl, data.userId, data.isNsfw, data.prompt, data.negativePrompt, data.guidanceScale, data.seed, data.galleryName  
      console.log(data);  
Here's an example of a custom button that shows a fullscreen version of the image when the custom button is clicked.  
You can create two different custom buttons: customButton and customButton2. See this page for an example that uses customButton2to add a comments box for each image in the gallery. If you need more buttons, then you could make one of the buttons show a popup menu which contains a list of actions the user can take for that image.  
Advanced Usage  
If you know JavaScript, then here's some code demonstrating how to use this plugin in your functions:  
async start() =>  
  let result = await image({prompt:"a cute mouse"});  
  document.body.append(result.canvas);  
  imageEl.src = result.dataUrl;  
  console.log("prompt used:", result.inputs.prompt);  
  console.log("all inputs used:", result.inputs);  
Here's an example of the above code. Also check this example.  
Also, here's a simplified version of the above example:  
async start() =>  
  imageEl.src = await image("a cute mouse");  
And here's an example showing how you can put options in the second argument if the first one is a string, and this also shows the removeBackground option:  
imageEl.src = await image("a cute mouse", {resolution: "512x768", removeBackground:true});  
This works because if we pass plain text into the plugin, it interprets it as the prompt. Also, the resulting 'object' returned by the plugin is always a String object with some extra properties added (i.e. canvas, dataUrl, iframe), so you can write imageEl.src=result instead of imageEl.src=result.dataUrl. They're the same.  
Also, the iframe has a property iframe.textToImagePluginOutput which is added after the generation is finished, and you can use that to access the image either as a HTML5 canvas or as a Data URL:  
iframe.textToImagePluginOutput.canvas  
iframe.textToImagePluginOutput.dataUrl  
iframe.textToImagePluginOutput.inputs.prompt  
iframe.textToImagePluginOutput.inputs.negativePrompt  
iframe.textToImagePluginOutput.inputs.seed  
...  
Notes:  
	•	You can use this example to get started. And here's another that hides the irrelevant parts of the prompt from the user.  
	•	Images are not stored on the server unless the user explicitely saves them to the gallery - see this post for more info.  
	•	If you want to programmatically get the actual image data that is generated - so e.g. you can draw some text on it, or make it greyscale, or collage multiple images together, or whatever, check out this example.  
	•	The quality of the output image can change dramatically depending on the wording in your prompt. You can use a generator like thisto play around with your prompt design (click the info icon on the output images to see the full prompt used).  
	•	You can call the promptData list whatever you want. If your settings list was called promptSettings then you'd write [image(promptSettings)] to generate the output image. You can have many prompt-settings lists in one generator.  
	•	The seed parameter should be any number like 3834329 or 9278236492. A seed of -1 is default and means "choose a random seed for me". If you provide the same seed with the same prompt, it should generate a very similar picture (ideally the same, but not always exact due to GPU hardware technicalities). But note: I'll be upgrading the machine learning models that power this as new ones are released, and during the upgrades, the image that a seed+prompt combination "refers to" will change.  
	•	If a seed of -1 is used (which again, is default), then an icon will appear (when you hover over the image) to allow you to try generating it again to get a different result. If you want to add your own "try again" button that just regenerates the image and nothing else, then add id=yourImageId to your promptData list and then use this code to create your "try again" button: <button onclick="yourImageId.reload()">try again</button>. Here's an example generator that does that.  
	•	The model can return NSFW/adult-themed results if prompted with NSFW/adult-themed terms. Treat this like a Google image search, and prompt responsibly. You can add terms like "NSFW" and "nudity" to the negativePrompt option as a way to reduce the probability that you'll get accidental NSFW results. May also want to add "fully clothed" to the prompt in some cases.  
	•	Each user can only have a few concurrent server requests, so if you have lots of images on one page, they'll queue up.  
	•	The 19th day of every month is observed as 'Ad-viewer Appreciation Day' in the Perchance community. On this day we pay our respects to the non-logged-in users who fund the GPU servers by viewing ads on generators that import AI-based plugins. Logged-in users are encouraged to spare a moment for these anonymous benefactors, wishing for them a month of relevant and interesting ads, and thanking them for their tolerance of increased browser tab memory usage, and their indirect but valuable contribution to the Perchance community via the digital attention economy. May their mobile game ads not be too sus, and may the gameplay reflect the real gameplay even if only abstractly 🕯️  
	•	Check out more plugins at perchance.org/plugins  
As some inspiration, here are some images produced using the prompt "fantasy [thing], extremely detailed oil painting, unreal 5 render, rhads, bruce pennington, studio ghibli, tim hildebrandt, digital art, octane render, beautiful composition, trending on artstation, award-winning photograph, masterpiece":  
  
Text-to-speech code:  
  
// work around Chrome bug:  
while(speechSynthesis.getVoices().length === 0) {  
  await new Promise(r => setTimeout(r, 10));  
}  
  
let availableVoiceNames = speechSynthesis.getVoices().map(v => v.name).sort((a,b) => a.toLowerCase().includes("english") ? -1 : 1);  
window.chosenVoiceName = availableVoiceNames[0];  
  
document.body.innerHTML = `  
  Please choose a voice:  
  <br>  
  <select onchange="window.chosenVoiceName=this.value;">${availableVoiceNames.map(n => `<option>${n}</option>`).join("")}</select>  
  <br>  
  <button onclick="oc.window.hide();">submit</button>  
  <br><br>  
  (As you can see, this plugin is pretty rudimentary for now. Feel free to ask for more features on the Discord.)  
`;  
  
oc.window.show();  
  
let sentence = "";  
oc.thread.on("StreamingMessage", async function (data) {  
  for await (let chunk of data.chunks) {  
    sentence += chunk.text;  
    let endOfSentenceIndex = Math.max(sentence.indexOf("."), sentence.indexOf("!"), sentence.indexOf("?"));  
    if(endOfSentenceIndex !== -1) {  
      console.log("Speaking sentence:", sentence);  
      await textToSpeech({text:sentence.slice(0, endOfSentenceIndex+1), voiceName:window.chosenVoiceName});  
      sentence = sentence.slice(endOfSentenceIndex+1);  
      sentence = sentence.replace(/^[.!?\s]+/g, "");  
    }  
  }  
});  
  
function textToSpeech({text, voiceName}) {  
  return new Promise((resolve, reject) => {  
    const voices = speechSynthesis.getVoices();  
    const voice = voices.find(v => v.name === voiceName);  
    const utterance = new SpeechSynthesisUtterance();  
    utterance.text = text;  
    utterance.voice = voice;  
    utterance.rate = 1.2;  
    utterance.pitch = 1.0;  
    utterance.onend = function() {  
      resolve();  
    };  
    utterance.onerror = function(e) {  
      reject(e);  
    };  
    speechSynthesis.speak(utterance);  
  });  
}  
  
ai text plugin:  
  
This plugin allows you generate text with AI. It doesn't run on your actual device like other Perchance plugins because it requires too much computational power (and would require a many-gigabyte download), so it runs on server GPUs, which means it costs me money to run. For that reason, this plugin is funded with ads, so an ad will appear on your generator for non-logged-in users if you import this plugin. The ad will appear at the bottom of the screen like this. The ad will go away if you remove the plugin, of course.  
To use this plugin, you'll first need to import it by adding this line to your lists editor:  
ai = {import:ai-text-plugin}  
And now try putting this in your lists editor:  
character  
  {mech|demon|cyberpunk} {warrior|minion|samurai}  
  
place  
  a retropunk distopia  
  a small village  
  a mountainous region  
  an underwater cavern  
  
season  
  winter  
  summer  
    
poemPrompt  
  instruction = Write a haiku about a [character] in [place] during [season].  
    
output  
  [ai(poemPrompt)]  
Here's an example generator to start you off, and here's a live version of the above code, running on this page:  
Steel claws scrape black ice,    
Depth charges hum through the  
randomize  
You can hover your mouse over the little icon that appears at the end of the text to see the instruction that was used to generate it.  
Here's an example where we give the AI an instruction, but we also ensure that the response starts with "It was the night before Christmas in":  
storyPrompt  
  instruction = Write a {spooky|silly} story involving {a} {import:object}.  
  startWith = It was the night before Christmas in  
Here's a simple example that uses startWith.  
If you pass some text directly into this plugin, it'll be interpreted as the instruction:  
output  
  [ai("Explain quantum field theory to a toddler.")]  
Check out some of these example generators to see different ways to use this plugin, and learn about some advanced features:  
	•	Fantasy Character - Description + image using onFinish and text-to-image-plugin.  
	•	Prompt Tester - Easily test your prompts. Also demonstrates outputTo property.  
	•	AI Chat - Design and chat with an AI character. Uses stopSequences and onFinish.  
	•	Render Example - Displays 'actions' like *smiles smugly* into smiles smugly using render.  
	•	Two Character Chat - Makes 2 random game characters chat with one another.  
	•	Short Story - Generates a short story with pictures. Uses render in an interesting way.  
	•	Story Outline - Generates a story outline (plot, characters, etc.) with a cover image.  
	•	Text-to-Speech - Streams generated text into the text-to-speech-plugin.  
	•	Story Writing Helper - Shows use of onChunk and stop().  
	•	Multi-Choice Text Adventure - Story where each step has several actions to choose from.  
	•	Hierarchical World Explorer - Similar to the nested-plugin.  
	•	User Input Example - Take some user input as part of the writing instructions for the AI.  
You can make instruction and/or startWith into a list, and then add $output = [this.joinItems("\n")] to the top of the list to join all the lines together like in this example:  
catGymPrompt  
  startWith  
    cat: i umm... *muffled heavy breathing* i am a cat, and i'm calling to ask about your tuesday pilates classes  
    kind staff member: sure! i can help you with that, can-  
    cat:  
    $output = [this.joinItems("\n")] // <-- this joins all the above lines together instead of selecting a random one  
Note: You might be accustomed to using this.joinItems("<br>"), but in this case \n (which means newline) is probably better since the AI is trained primarily on text, rather than HTML (but it definitely can generate HTML if you need that!). I've made it so \n does actually create a line break in the visual display of the AI's outputs (most HTML element types don't do this by default).  
Here's how to add a style option to adjust the visual display of the output text:  
marioAffirmationsPrompt  
  instruction = Be Mario, and give me 3 positive affirmations with Mario's accent.  
  style = text-align:left; color:blue; font-weight:bold; border:2px solid red; display:block; max-width:600px; margin:0 auto; padding:0.5rem;   
Prompt Options:  
You can see a bunch of the options below at play in the example generators listed above, and in this sandbox demo made by wthit56.  
	•	instruction - Your instruction to the AI on what to write.  
	•	startWith - The text that you want the AI's writing to start with.  
	•	stopSequences - The AI will stop writing "naturally" when it thinks it's finished, but you can use stopSequences to provide a list of words/phrases that should make the AI stop if it writes them.  
	•	hideStartWith - set this equal to true if you don't want the startWith text that you specified to actually get displayed. I.e. only the text after that will get displayed. You could also use a custom render(data) function (explained below) to achieve this.  
	•	outputTo - Use this to tell the plugin to output the AI's response into a specific element, based on that element's ID. If you had an element with id="myCoolElement" in the HTML editor, then you'd write outputTo = [myCoolElement] to get the AI to output to that element. By default the AI's text will be put wherever you write [ai(...)].  
	•	onChunk(data) - the code you put in this will run after every chunk (which is usually a word, or part of a word). See this generator for an example that uses it. You can access data.textChunk and data.fullTextSoFar and data.isFromStartWith (since the startWith text, if specified, is always the first chunk).  
	•	onStart(data) - the code you put in this will run at the start of the generation process. You can access the inputs being used with data.inputs.instruction, data.inputs.startWith, etc.  
	•	onFinish(data) - the code you put in this will run at the end of the generation process. You can access the final text with data.text, and note that this includes the startWith text, if you specified any. If you want the output text excluding the startWith, then you can access that via data.generatedText. If you didn't specify any startWith then data.generatedText and data.textwill be the same. You can use data.liveResponseText at any time to get the current text including any edits that the user has made using the edit button at the end of the response.  
	•	render(data) - the code you put in this will run after every chunk, and value that you return from this function is what actually gets displayed. This allows you to transform what the AI writes into something else - e.g. convert asterisks around text to bold or italic HTML tags. data.text contains the text so far and data.isPartial tells you whether the text is partial/incomplete (i.e. the AI is still generating). Here's a basic example, and here's one that uses data.isPartial.  
	•	endButtons - add endButtons = noneto your prompt options if you don't want the edit/continue buttons to show at the end of the response.  
	•	Note that instruction, startWith, and stopSequences can all be functions if you want. You return the value that you want to use. See this generator for an example where we use it to prevent evaluation of the square and curly blocks in the given instructionand startWith.  
	•	There are some other features not listed here, but they're used in the examples list above. If there's a feature that you want, but can't find, feel free to ask for it on the community forum.  
Here's an example of using it in JavaScript function where we console.log each chunk, and also the final generatedText:  
async start() =>  
  let result = await ai({  
    instruction: "write a poem",  
    onChunk: function(data) {  
      console.log("chunk:", data);  
    },  
  });  
  console.log(result.generatedText, result);  
The result.text includes the startWithtext, whereas result.generatedText doesn't, but in the above example they're equivalent because we didn't specify a startWith. Also note that result is also actually a Stringwhich is equivalent to result.text. So you can just write e.g. foo.innerHTML = resultinstead of foo.innerHTML = result.text.  
Notes:  
	•	Text prompt/response data is not stored on the server - see this post for more info.  
	•	If you'd like to play around with running AI text generation models on your own machine ("locally"), then r/LocalLLama is a good community to join.  
	•	Each user can only have a few concurrent server requests, so if you have lots of completions pending on one page, they'll queue up.  
	•	The model may produce NSFW/adult-themed content if instructed/prompted with NSFW/adult-themed terms. You should treat this a bit like a Google search - ask for inappropriate stuff, and you'll probably get inappropriate stuff. Please prompt responsibly. If the AI is producing inappropriate content without being prompted, you can try adding a sentence to your instruction telling it not to do that.  
	•	The 19th day of every month is observed as 'Ad-viewer Appreciation Day' in the Perchance community. On this day we pay our respects to the non-logged-in users who fund the GPU servers by viewing ads on generators that import AI-based plugins. Logged-in users are encouraged to spare a moment for these anonymous benefactors, wishing for them a month of relevant and interesting ads, and thanking them for their tolerance of increased browser tab memory usage, and their indirect but valuable contribution to the Perchance community via the digital attention economy. May their mobile game ads not be too sus, and may the gameplay reflect the real gameplay even if only abstractly 🕯️  
	•	Check out more plugins at perchance.org/plugins  

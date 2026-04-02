/**
 * Snippet: prebake-image-prompt-builder
 *
 * Purpose:
 *   Builds text-to-image prompts from conversation context by extracting key
 *   visual elements (characters, setting, mood, action) using
 *   oc.getInstructCompletion(). Stores the built prompt in per-message
 *   customData and appends it as a hidden annotation.
 *
 * Why realistic:
 *   Uses oc.getInstructCompletion() (documented LLM helper) for extraction,
 *   per-message customData (documented), and hidden-from-ai HTML comments
 *   (documented). Network-dependent with graceful fallback.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, extracts visual elements and builds an image prompt.
 *   - Stores prompt in per-message customData.
 *   - Appends hidden annotation showing the prompt (visible to user only).
 *   - Exposes window.__pcbw_imagePrompt API.
 *
 * Customization points:
 *   - PROMPT_PREFIX, PROMPT_SUFFIX: prepend/append to the generated prompt.
 *   - EXTRACT_INSTRUCTION: the LLM instruction for extraction.
 *
 * Caveats:
 *   - LLM call adds latency.
 *   - Generated prompts are for reference — call oc.textToImage() separately.
 */
(async () => {
  if (window.__pcbw_imgPrompt_init) return;
  window.__pcbw_imgPrompt_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_imgPrompt";
  const PROMPT_PREFIX = "detailed digital painting, ";
  const PROMPT_SUFFIX = ", high quality, dramatic lighting";

  const EXTRACT_INSTRUCTION =
    "From the following text, extract a concise visual scene description " +
    "suitable for an image generator. Include: characters (appearance, not names), " +
    "setting/environment, mood/atmosphere, key action or pose. " +
    "Output ONLY the scene description, 1-2 sentences max.";
  // ─────────────────────────────────────────────────────────────────────

  let lastBuiltPrompt = "";

  async function buildPrompt(text) {
    const instruction = EXTRACT_INSTRUCTION + "\n\nText:\n" + text.slice(0, 800);
    const extraction = await oc.getInstructCompletion({ instruction });
    const cleaned = extraction.trim();
    if (!cleaned || cleaned.length < 10) return null;
    return PROMPT_PREFIX + cleaned + PROMPT_SUFFIX;
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already processed
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      const prompt = await buildPrompt(lastMsg.content);
      if (!prompt) return;

      lastBuiltPrompt = prompt;

      // Store in per-message customData
      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = { prompt, at: new Date().toISOString() };

      // Append hidden annotation
      lastMsg.content +=
        `\n<!--hidden-from-ai-start-->` +
        `<div style="margin-top:6px;font-size:10px;color:light-dark(#888,#666);` +
        `font-family:sans-serif;border-top:1px dashed light-dark(#ddd,#444);padding-top:4px;">` +
        `🖼️ Image prompt: <em>${prompt}</em>` +
        `</div>` +
        `<!--hidden-from-ai-end-->`;

      console.log("[pcbw-imgPrompt] Built:", prompt);
    } catch (err) {
      console.error("[pcbw-imgPrompt] Error:", err);
    }
  });

  const api = {
    buildPrompt(text) { return buildPrompt(text); },
    getLastPrompt() { return lastBuiltPrompt; }
  };

  window.__pcbw_imagePrompt = api;
  console.log("[pcbw-imgPrompt] Image prompt builder loaded.");
})();

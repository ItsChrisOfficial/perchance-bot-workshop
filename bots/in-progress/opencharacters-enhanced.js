// ============================================================
//  OpenCharacters — Enhanced Character Generator  v2.1
//  Compatible with the standard oc.* API surface.
//  Preserves all original behaviour while adding:
//    • Multi-genre / tone selector
//    • Image Generation Style selector (15 styles across 5 categories)
//      – applies prompt prepend + append to ALL oc.textToImage() calls
//    • Rich character generation (traits, quirks, backstory, world)
//    • Dynamic scene (background image + ambient music per genre)
//    • Emotion-avatar reactions on every AI message
//    • Slash commands  /regen  /genre  /style  /rename  /status  /help
//    • Conversation memory digest (auto-summarise every N messages)
//    • Streaming progress bar that counts tokens
//    • Full error-recovery with retry queue
//    • Interactive choice buttons in AI messages  ([[option]])
//    • URL reader (paste a link and the AI can discuss the page)
// ============================================================

// ── CONSTANTS ────────────────────────────────────────────────

const GENERATOR_AVATAR =
  "https://user.uploads.dev/file/f20fb9e8395310806956dca52510b16b.webp";

const GENRES = {
  fantasy:   { label: "⚔️ Fantasy",       music: "https://cdn.pixabay.com/audio/2023/03/25/audio_28e7be459f.mp3",  bgFilter: "hue-rotate(30deg) brightness(0.85)" },
  scifi:     { label: "🚀 Sci-Fi",         music: "https://cdn.pixabay.com/audio/2022/11/17/audio_febc508520.mp3",  bgFilter: "hue-rotate(200deg) saturate(1.4) brightness(0.8)" },
  romance:   { label: "💕 Romance",        music: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",  bgFilter: "sepia(0.3) brightness(1.1)" },
  horror:    { label: "🩸 Horror",         music: "https://cdn.pixabay.com/audio/2022/03/24/audio_2dde668d05.mp3",  bgFilter: "grayscale(0.6) brightness(0.7) contrast(1.3)" },
  mystery:   { label: "🔍 Mystery",        music: "https://cdn.pixabay.com/audio/2022/10/16/audio_07fb30e02d.mp3",  bgFilter: "sepia(0.5) brightness(0.85)" },
  comedy:    { label: "😂 Comedy",         music: "",                                                               bgFilter: "saturate(1.5) brightness(1.1)" },
  adventure: { label: "🗺️ Adventure",      music: "https://cdn.pixabay.com/audio/2022/10/13/audio_a9e7c3bc1a.mp3", bgFilter: "saturate(1.2) brightness(0.9)" },
  slice:     { label: "☕ Slice of Life",  music: "https://cdn.pixabay.com/audio/2022/10/30/audio_b99dc952d1.mp3", bgFilter: "" },
  smut:      { label: "🔞 Smut",           music: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3", bgFilter: "sepia(0.15) saturate(1.3) brightness(0.9)", nsfw: true },
  spicy:     { label: "🌶️ Spicy",          music: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3", bgFilter: "saturate(1.2) brightness(0.85) contrast(1.05) sepia(0.1)", nsfw: true },
};

// ── IMAGE GENERATION STYLES ───────────────────────────────────
//  Each style contributes a `prepend` string (added before the core prompt)
//  and an `append` string (added after). All oc.textToImage() calls are
//  wrapped by styledImagePrompt() so the style is applied consistently.
//
//  Categories (3 styles each = 15 total):
//    photorealistic | anime | painterly | filmish | ultra-stylized

// ── SHARED IMAGE QUALITY CONSTANTS ───────────────────────────
//  Applied to every oc.textToImage() call regardless of chosen style.
//
//  BASE_QUALITY_POSITIVE is injected by styledImagePrompt() so that all
//  image output — whether a style is selected or not — receives the same
//  baseline guard against uncanny faces, misaligned eyes, and bad anatomy.
//
//  NEG_PROMPT is used as the negativePrompt argument on every call site.

const BASE_QUALITY_POSITIVE =
  "best quality, masterpiece, ultra-detailed, sharp focus, " +
  "correct anatomy, natural body proportions, " +
  "symmetric eyes, straight-looking eyes, detailed eyes, focused eyes, " +
  "beautiful face, perfect facial features, professional";

const NEG_PROMPT =
  // Overall quality
  "worst quality, low quality, normal quality, bad quality, amateur, amateurish, " +
  // Focus / sharpness
  "blurry, out of focus, soft focus, fuzzy, grainy, noisy, pixelated, jpeg artifacts, " +
  // Anatomy
  "deformed, malformed, mutated, mutation, disfigured, distorted, warped, " +
  "bad anatomy, bad proportions, bad body, wrong anatomy, incorrect anatomy, " +
  "poorly drawn, poorly drawn face, poorly drawn hands, poorly drawn feet, " +
  "extra fingers, missing fingers, six fingers, fused fingers, " +
  "extra limbs, missing limbs, extra arms, extra legs, floating limbs, " +
  // Face / eyes — the primary uncanny culprits
  "cross-eyed, lazy eye, wall-eyed, asymmetric eyes, misaligned eyes, uneven eyes, " +
  "too many eyes, one eye, googly eyes, vacant eyes, dead eyes, empty eyes, " +
  "ugly face, bad face, weird face, distorted face, melting face, " +
  // Skin / texture
  "uncanny valley, plastic skin, doll skin, mannequin, wax figure, fake skin, " +
  "oversaturated skin, orange skin, grey skin, unnatural skin tone, " +
  // Artefacts
  "watermark, text, signature, logo, username, artist name, copyright, caption";

const IMAGE_STYLES = {

  // ── Photorealistic ──────────────────────────────────────────
  photo_hyper: {
    label:    "📷 Hyperrealistic",
    category: "📷 Photorealistic",
    prepend:  "hyperrealistic photography, 8K DSLR, RAW photo, photorealistic, best quality,",
    append:   ", professional studio lighting, subtle bokeh, high-fidelity skin detail, natural skin texture, true-to-life color accuracy",
  },
  photo_cinematic: {
    label:    "🎞️ Cinematic Photo",
    category: "📷 Photorealistic",
    prepend:  "cinematic photograph, movie still, 35mm film, anamorphic lens, best quality,",
    append:   ", shallow depth of field, cinematic color grade, golden hour light, natural skin tones, film grain",
  },
  photo_documentary: {
    label:    "📸 Documentary",
    category: "📷 Photorealistic",
    prepend:  "documentary photography, candid shot, natural available lighting, best quality,",
    append:   ", authentic atmosphere, journalistic style, natural proportions, gritty realism, sharp focus",
  },

  // ── Anime / Illustrated ─────────────────────────────────────
  anime_modern: {
    label:    "🌸 Modern Anime",
    category: "🌸 Anime / Illustrated",
    prepend:  "modern anime art, cel-shaded, studio-quality anime illustration, best quality,",
    append:   ", vibrant colors, symmetric expressive eyes, clean linework, correct anime proportions, detailed anime face",
  },
  anime_manga: {
    label:    "📖 Manga",
    category: "🌸 Anime / Illustrated",
    prepend:  "manga art style, black and white ink illustration, screen tones, best quality,",
    append:   ", dynamic linework, hatching shadows, correct proportions, symmetric eyes, manga panel composition",
  },
  anime_webtoon: {
    label:    "🎨 Webtoon / Comic",
    category: "🌸 Anime / Illustrated",
    prepend:  "Korean webtoon art, manhwa illustration, digital comic style, best quality,",
    append:   ", flat vibrant colors, clean outlines, soft shading, correct proportions, symmetric eyes, webtoon aesthetic",
  },

  // ── Painterly ───────────────────────────────────────────────
  paint_oil: {
    label:    "🖼️ Oil Painting",
    category: "🖌️ Painterly",
    prepend:  "classical oil painting, old masters technique, rich impasto brushwork, best quality,",
    append:   ", museum-quality fine art, deep rich colors, painted canvas texture, masterful composition, correct proportions",
  },
  paint_watercolor: {
    label:    "💧 Watercolor",
    category: "🖌️ Painterly",
    prepend:  "watercolor illustration, delicate wet-on-wet washes, soft edges, best quality,",
    append:   ", flowing pigments, cold-press paper texture, luminous watercolor painting, correct proportions, graceful linework",
  },
  paint_impressionist: {
    label:    "🌊 Impressionist",
    category: "🖌️ Painterly",
    prepend:  "impressionist painting, expressive broken brushstrokes, plein-air feel, best quality,",
    append:   ", dappled light, post-impressionist color palette, painterly atmosphere, masterful composition, natural proportions",
  },

  // ── Filmish ─────────────────────────────────────────────────
  film_noir: {
    label:    "🎬 Film Noir",
    category: "🎬 Filmish",
    prepend:  "film noir, dramatic black and white photography, hard chiaroscuro shadows, best quality,",
    append:   ", venetian blind light streaks, 1940s aesthetic, smoky moody atmosphere, sharp focus, correct anatomy",
  },
  film_retro: {
    label:    "📼 Retro 80s",
    category: "🎬 Filmish",
    prepend:  "retro 1980s film aesthetic, analog VHS warmth, vintage cinema look, best quality,",
    append:   ", light leak, faded highlights, warm teal-orange grade, 80s movie nostalgia, correct proportions",
  },
  film_wes: {
    label:    "🟡 Wes Anderson",
    category: "🎬 Filmish",
    prepend:  "Wes Anderson film style, perfectly symmetrical composition, muted pastel palette, best quality,",
    append:   ", flat 2-point perspective, whimsical storybook aesthetic, quirky color grade, correct proportions, natural face",
  },

  // ── Ultra-Stylized ───────────────────────────────────────────
  stylized_cyberpunk: {
    label:    "🔮 Neon Cyberpunk",
    category: "✨ Ultra-Stylized",
    prepend:  "cyberpunk concept art, neon-drenched futuristic cityscape, electric glow, best quality,",
    append:   ", glowing holographic elements, rain-slicked streets, ultra-detailed sci-fi dystopia, correct anatomy, sharp focus",
  },
  stylized_darkfantasy: {
    label:    "🐉 Dark Fantasy Art",
    category: "✨ Ultra-Stylized",
    prepend:  "dark fantasy concept art, epic dramatic illustration, ominous atmosphere, best quality,",
    append:   ", intricate magical details, brooding color palette, fantasy art masterpiece, correct anatomy, detailed expressive face",
  },
  stylized_vaporwave: {
    label:    "🌈 Vaporwave",
    category: "✨ Ultra-Stylized",
    prepend:  "vaporwave aesthetic, synthwave art, lo-fi retro-futuristic, best quality,",
    append:   ", pastel purple magenta teal gradient, glitch accents, 90s nostalgia, dreamy surreal, correct proportions",
  },
  nsfw_stylized: {
    label:    "🔥 Glamour Fantasy Art",
    category: "✨ Ultra-Stylized",
    prepend:  "glamour fantasy concept art, sensual atmospheric illustration, high-detail digital painting, seductive mood, best quality,",
    append:   ", dramatic rim lighting, rich jewel-tone palette, cinematic adult fantasy art, masterpiece quality, correct anatomy, perfect face",
    nsfw:     true,
  },

  // ── NSFW — Photorealistic ────────────────────────────────────
  nsfw_photo: {
    label:    "🛋️ Boudoir Photography",
    category: "📷 Photorealistic",
    prepend:  "professional boudoir photography, intimate portrait session, 85mm prime lens, studio softbox lighting, best quality,",
    append:   ", elegant sensual composition, natural skin texture, warm ambient light, high-resolution intimate photography, correct anatomy, symmetric eyes",
    nsfw:     true,
  },

  // ── NSFW — Illustrated ───────────────────────────────────────
  nsfw_illustrated: {
    label:    "💋 Sensual Illustration",
    category: "🌸 Anime / Illustrated",
    prepend:  "sensual digital illustration, elegant pinup art, Artgerm-inspired figure study, best quality,",
    append:   ", soft intimate lighting, detailed expressive face, symmetric eyes, correct anatomy, beautiful figure, high-quality digital painting",
    nsfw:     true,
  },

  // ── 3D Render ────────────────────────────────────────────────
  nsfw_3d: {
    label:    "🧊 Photorealistic 3D",
    category: "🧊 3D Render",
    prepend:  "photorealistic 3D render, Unreal Engine 5 quality, octane render, physically-based rendering, best quality,",
    append:   ", subsurface scattering skin, global illumination, ultra-detailed textures, cinematic 3D character render, correct anatomy, perfect face, symmetric eyes",
    nsfw:     true,
  },
};

// Ordered category labels (for rendering grouped headers in the picker)
const STYLE_CATEGORIES = [
  "📷 Photorealistic",
  "🌸 Anime / Illustrated",
  "🖌️ Painterly",
  "🎬 Filmish",
  "✨ Ultra-Stylized",
  "🧊 3D Render",
];

// ── SCENARIO TONES ────────────────────────────────────────────
//  Presented as Step 3 of the setup wizard (after genre and image style).
//  The selected tone's `hint` string is injected into the character
//  generation instruction to shape the opening scenario's atmosphere.
//
//  Distribution: 5 SFW · 2 SFW-with-undertones · 4 NSFW

const SCENARIO_TONES = {

  // ── SFW (5) ──────────────────────────────────────────────────
  everyday: {
    label: "🌅 Everyday Adventure",
    hint:  "The starting scenario should feel lighthearted, curious, and grounded — an ordinary world full of interesting little moments.",
    nsfw:  false,
  },
  cozy: {
    label: "☕ Cozy & Casual",
    hint:  "The starting scenario should feel warm, comfortable, and slice-of-life — low stakes, intimate, everyday warmth.",
    nsfw:  false,
  },
  suspense: {
    label: "🔍 Suspenseful",
    hint:  "The starting scenario should build mystery and tension — slow-burn intrigue, half-revealed secrets, and a creeping sense of rising stakes.",
    nsfw:  false,
  },
  epic: {
    label: "⚔️ Epic & Dramatic",
    hint:  "The starting scenario should feel high-stakes and emotionally charged — heroic conflict, grand decisions, and dramatic weight in every moment.",
    nsfw:  false,
  },
  comedic: {
    label: "😄 Playful & Comedic",
    hint:  "The starting scenario should be fun and humorous — witty banter, absurd situations, and a light-hearted energy throughout.",
    nsfw:  false,
  },

  // ── SFW with NSFW undertones (2) ─────────────────────────────
  flirty: {
    label:      "💫 Flirty & Romantic",
    hint:       "The starting scenario should have teasing chemistry and suggestive tension — romantic undertones, playful flirtation, and unspoken attraction simmering beneath the surface. Keep it tasteful but charged.",
    nsfw:       false,
    undertones: true,
  },
  charged: {
    label:      "🌶️ Charged Tension",
    hint:       "The starting scenario should crackle with electric push-pull energy — restrained passion, desire barely held in check, and electric proximity. Suggestive but not explicit.",
    nsfw:       false,
    undertones: true,
  },

  // ── NSFW (4) ─────────────────────────────────────────────────
  slow_burn: {
    label: "🕯️ Slow Burn",
    hint:  "The starting scenario begins as fully SFW — focus on character connection, emotional tension, and growing intimacy. Do NOT introduce explicit content at the start. Let attraction and desire build naturally through conversation and meaningful interaction. Explicit adult content is unlocked and expected to emerge gradually as the relationship deepens. 18+ only.",
    nsfw:  true,
  },
  steamy: {
    label: "🔥 Steamy Encounters",
    hint:  "The starting scenario is explicitly adult and sensual — build richly toward intimate encounters using layered sensory detail. Explicit content is expected. 18+ only.",
    nsfw:  true,
  },
  dark_intense: {
    label: "🖤 Dark & Intense",
    hint:  "The starting scenario explores edgy adult themes — psychological tension, power dynamics, and morally complex characters. Explicit adult content is permitted. 18+ only.",
    nsfw:  true,
  },
  explicit: {
    label: "💋 Explicit Romance",
    hint:  "The starting scenario is fully explicit adult romance — deeply intimate and sexually charged from the very first moment. No fading to black. Explicit content is fully expected. 18+ only.",
    nsfw:  true,
  },
};

const MEMORY_DIGEST_EVERY = 20;   // summarise after every N AI messages
const MAX_CHOICE_BUTTONS   = 5;   // max [[choices]] rendered as buttons

const KINKS_URL = "https://user.uploads.dev/file/edc972de9235585e24590c4728018e5d.txt";

// ── GENRE-THEMED MESSAGE STYLES ──────────────────────────────
//  Applied via messageRenderingPipeline for consistent per-genre CSS.

const GENRE_STYLES = {
  spicy:     "font-family:'Georgia','Times New Roman',serif;line-height:1.8;color:light-dark(#2b1a1a,#e8d5d0);background:light-dark(rgba(120,40,60,0.06),rgba(180,60,80,0.08));border-left:3px solid light-dark(#8b3a50,#c4627a);padding:0.6rem 1rem;border-radius:4px;",
  smut:      "font-family:'Georgia','Times New Roman',serif;line-height:1.8;color:light-dark(#2b1a1a,#e8d5d0);background:light-dark(rgba(120,40,60,0.06),rgba(180,60,80,0.08));border-left:3px solid light-dark(#8b3a50,#c4627a);padding:0.6rem 1rem;border-radius:4px;",
  fantasy:   "font-family:'Georgia','Times New Roman',serif;color:light-dark(#3b2f2f,#d5cfc4);background:light-dark(rgba(245,235,220,0.3),rgba(60,50,40,0.3));border-left:3px solid light-dark(#c4a77d,#8a7050);padding:0.6rem 1rem;border-radius:4px;",
  horror:    "font-family:'Courier New',monospace;color:light-dark(#1a1a2e,#c8c8e0);background:light-dark(rgba(26,26,46,0.08),rgba(200,200,224,0.06));border:1px solid light-dark(rgba(26,26,46,0.2),rgba(200,200,224,0.15));padding:0.5rem 0.8rem;border-radius:2px;letter-spacing:0.02em;",
  scifi:     "font-family:'Segoe UI',system-ui,sans-serif;color:light-dark(#0d1117,#e0e0ff);border-left:3px solid light-dark(#6366f1,#818cf8);background:light-dark(rgba(99,102,241,0.05),rgba(129,140,248,0.08));padding:0.5rem 1rem;border-radius:6px;",
  romance:   "font-family:'Georgia',serif;color:light-dark(#3b2020,#e8d0d0);background:light-dark(rgba(220,180,190,0.12),rgba(140,60,80,0.08));border-left:3px solid light-dark(#c97088,#d4849a);padding:0.6rem 1rem;border-radius:6px;",
  mystery:   "font-family:'Courier New',monospace;color:light-dark(#1a1a2e,#c8c8e0);background:light-dark(rgba(40,30,20,0.06),rgba(200,180,160,0.06));border-left:3px solid light-dark(#8a7050,#a08868);padding:0.5rem 0.8rem;border-radius:2px;",
  adventure: "font-family:system-ui,sans-serif;color:light-dark(#2d3b2d,#c8d8c8);background:light-dark(rgba(76,120,76,0.06),rgba(120,180,120,0.06));border-left:3px solid light-dark(#5a8f5a,#6aaa6a);padding:0.5rem 1rem;border-radius:4px;",
  comedy:    "font-family:system-ui,sans-serif;color:light-dark(#333,#ddd);background:light-dark(rgba(255,220,100,0.08),rgba(255,200,50,0.06));border-left:3px solid light-dark(#e6a817,#f0c040);padding:0.5rem 1rem;border-radius:6px;",
  slice:     "font-family:system-ui,-apple-system,sans-serif;font-size:0.95rem;line-height:1.6;color:light-dark(#2d2d2d,#d4d4d4);padding:0.4rem 0;",
};

// ── STATE ────────────────────────────────────────────────────

window.alreadyGenerating  = false;
window._ocMemoryCount      = 0;   // tracks messages since last digest

// ── STYLE HELPER ─────────────────────────────────────────────

/**
 * Atomically apply an image style key to all three extensible style fields:
 *   - oc.character.customData.selectedImageStyle  (key reference)
 *   - oc.character.imagePromptPrefix              (prepend string)
 *   - oc.character.imagePromptSuffix              (append string)
 *
 * Pass null / undefined to clear the style.
 *
 * @param {string|null} key  - key from IMAGE_STYLES, or null to clear
 */
function _applyImageStyle(key) {
  oc.character.customData.selectedImageStyle = key || null;
  if (key && IMAGE_STYLES[key]) {
    oc.character.imagePromptPrefix = IMAGE_STYLES[key].prepend;
    oc.character.imagePromptSuffix = IMAGE_STYLES[key].append;
  } else {
    oc.character.imagePromptPrefix = "";
    oc.character.imagePromptSuffix = "";
  }
}

/**
 * Scan free-form character description text and return a compact, comma-separated
 * string containing only visually-renderable physical trait tokens.
 *
 * Strategy:
 *  1. Split the text on sentence boundaries and commas so each fragment is small.
 *  2. Keep a fragment only when it contains at least one physical/appearance keyword.
 *  3. Strip any surviving sub-clauses that are clearly narrative
 *     ("she is", "he tends to", "known for", "who", "that", "because", etc.).
 *  4. Return the surviving fragments joined as a comma-separated list.
 *
 * This ensures imagePromptTriggers contain only what Stable Diffusion can render
 * (hair colour, eye colour, body type, clothing, accessories, facial features, etc.)
 * and no personality summaries, backstory sentences, or relational clauses.
 *
 * @param {string} text  - raw description / trait / quirk text from the LLM
 * @returns {string}     - comma-separated physical trait tokens, or "" if none found
 */
function extractPhysicalTraits(text) {
  if (!text) return "";

  // Physical appearance signal words — a fragment must contain at least one.
  // Organised by category so new trait groups are easy to add or audit.
  const PHYSICAL_SIGNALS = [
    // ── Body / build ─────────────────────────────────────────
    "hair", "eye", "eyes", "skin", "face", "lips", "lip", "nose", "jaw", "chin",
    "cheek", "cheekbone", "brow", "eyebrow", "forehead", "temple", "neck", "throat",
    "shoulder", "chest", "breast", "waist", "hip", "thigh", "leg", "calf", "ankle",
    "arm", "elbow", "wrist", "hand", "finger", "knuckle", "body", "build", "frame",
    "figure", "silhouette", "physique", "stature", "posture",

    // ── Height ───────────────────────────────────────────────
    "height", "tall", "short", "petite", "statuesque", "towering", "average height",
    "medium height", "average-height", "medium-height",
    // Measurement patterns — matched as substrings so "5'8\"" and "170cm" both hit
    "ft tall", "feet tall", " cm tall", "cm tall", "'", "\"",

    // ── Weight / body mass ───────────────────────────────────
    "weight", "weighs", "lbs", " lb ", "pounds", "kg", "kilos", "kilograms",
    "heavy", "heavy-set", "heavyset", "stocky", "stout", "plump", "chubby",
    "overweight", "obese", "rotund", "portly", "robust", "solid", "thick",
    "lightweight", "featherweight", "underweight", "gaunt", "scrawny", "wiry",
    "lean", "lanky", "gangly",

    // ── Bust / chest ─────────────────────────────────────────
    "bust", "busty", "buxom", "large bust", "full bust", "flat chest", "flat-chested",
    "perky", "ample bosom", "bosom", "cleavage",
    // Cup sizes (a–g inclusive)
    "a-cup", "b-cup", "c-cup", "d-cup", "dd-cup", "ddd-cup", "e-cup", "f-cup", "g-cup",

    // ── General body descriptors ─────────────────────────────
    "slim", "slender", "svelte", "lithe", "willowy", "lean", "trim",
    "curvy", "curvaceous", "hourglass", "full-figured", "plus-size", "plus size",
    "muscular", "beefy", "buff", "ripped", "chiseled", "chiselled", "defined",
    "athletic", "toned", "fit", "well-built",
    "broad", "narrow", "petite", "voluptuous", "shapely",

    // ── Face shape ───────────────────────────────────────────
    "face shape", "oval face", "round face", "square face", "heart-shaped face",
    "heart shaped face", "diamond face", "oblong face", "rectangular face",
    "triangular face", "pear-shaped face", "oval-shaped", "round-shaped",
    "square jaw", "soft jaw", "strong jaw", "defined jaw", "pointed chin",
    "sharp chin", "rounded chin", "wide forehead", "narrow forehead",
    "high cheekbones", "prominent cheekbones", "hollow cheeks", "chubby cheeks",
    "apple cheeks",

    // ── Facial markers ───────────────────────────────────────
    "mole", "beauty mark", "freckle", "freckles", "freckled",
    "scar", "scarred", "birthmark", "dimple", "dimples",
    "stubble", "beard", "goatee", "mustache", "moustache", "clean-shaven",
    "five o'clock shadow", "shadow",
    "wrinkle", "wrinkles", "crow's feet", "laugh lines", "fine lines",
    "acne", "blemish", "rosy cheeks",

    // ── Eye colour ───────────────────────────────────────────
    "blue eyes", "green eyes", "brown eyes", "hazel eyes", "amber eyes",
    "gray eyes", "grey eyes", "violet eyes", "golden eyes", "dark eyes",
    "black eyes", "red eyes", "pink eyes", "heterochromia",
    "sapphire eyes", "emerald eyes", "teal eyes", "silver eyes",
    "light eyes", "bright eyes", "piercing eyes", "warm eyes",

    // ── Eye shape ────────────────────────────────────────────
    "almond eyes", "almond-shaped eyes", "hooded eyes", "wide-set eyes",
    "close-set eyes", "monolid", "upturned eyes", "downturned eyes",
    "deep-set eyes", "prominent eyes", "wide eyes", "narrow eyes",
    "doe eyes", "cat eyes",

    // ── Hair colour ──────────────────────────────────────────
    "blonde", "brunette", "redhead", "auburn",
    "black hair", "white hair", "silver hair", "platinum hair",
    "gray hair", "grey hair", "dark hair", "light hair",
    "chestnut hair", "copper hair", "strawberry blonde", "dirty blonde",
    "honey blonde", "ash blonde", "jet black", "raven hair",
    "ombre hair", "highlighted hair", "balayage", "dyed hair",
    "multi-colored hair", "multicolored hair", "rainbow hair",
    "bleached hair", "frosted tips",

    // ── Hairstyle ────────────────────────────────────────────
    "curly", "wavy", "straight hair", "kinky hair", "coily",
    "braided", "braid", "braids", "cornrows", "dreadlocks", "locs",
    "ponytail", "high ponytail", "low ponytail", "pigtails", "twin tails",
    "bun", "top knot", "chignon", "updo",
    "long hair", "short hair", "medium hair", "mid-length hair",
    "shoulder-length", "chin-length", "neck-length",
    "pixie cut", "pixie", "bob cut", "bob", "lob", "inverted bob",
    "undercut", "buzzcut", "buzz cut", "shaved head", "shaved sides",
    "mohawk", "fauxhawk", "faux hawk", "pompadour",
    "afro", "natural hair", "bangs", "fringe", "side-swept bangs",
    "wispy bangs", "curtain bangs", "blunt bangs",
    "layers", "layered hair", "textured hair", "voluminous hair",
    "sleek hair", "tousled hair", "messy hair",

    // ── Skin / complexion ────────────────────────────────────
    "pale", "pallid", "porcelain skin", "fair skin",
    "tan", "tanned", "bronzed", "sun-kissed",
    "dark skin", "brown skin", "ebony skin", "light skin", "medium skin",
    "olive skin", "warm complexion", "cool complexion",
    "complexion", "skin tone",

    // ── Wardrobe / fashion style ─────────────────────────────
    "wear", "wearing", "dressed", "outfit", "attire", "wardrobe",
    "fashion", "style", "look", "aesthetic",
    // Garments
    "dress", "skirt", "mini skirt", "maxi skirt", "wrap skirt",
    "top", "crop top", "tank top", "halter top",
    "shirt", "t-shirt", "button-up", "button-down", "flannel",
    "blouse", "tunic",
    "jacket", "blazer", "bomber jacket", "leather jacket", "denim jacket",
    "coat", "trench coat", "overcoat", "pea coat",
    "suit", "tuxedo", "pantsuit",
    "uniform", "scrubs",
    "gown", "ball gown", "evening gown", "slip dress",
    "robe", "kimono", "yukata", "hanfu", "qipao", "cheongsam", "sari",
    "cloak", "cape", "poncho",
    "armor", "armour", "chainmail", "plate armor",
    "jeans", "trousers", "pants", "leggings", "shorts",
    "hoodie", "sweatshirt", "cardigan", "sweater",
    // Footwear
    "boots", "ankle boots", "knee-high boots", "heels", "stilettos",
    "sneakers", "shoes", "flats", "sandals", "loafers", "oxfords",
    // Accessories
    "gloves", "fingerless gloves",
    "hat", "cap", "beanie", "beret", "fedora", "top hat",
    "hood", "veil",
    "mask", "half-mask",
    "glasses", "spectacles", "sunglasses", "reading glasses", "monocle",
    "necklace", "choker", "pendant", "locket",
    "earring", "earrings", "studs", "hoops", "dangling earrings",
    "ring", "rings", "bracelet", "bangle", "cuff",
    "crown", "tiara", "diadem", "circlet",
    "scarf", "wrap", "shawl",
    "belt", "corset", "waist cincher",
    "bag", "purse", "clutch", "backpack",
    // Fashion style keywords
    "casual", "formal", "semi-formal", "smart casual", "business casual",
    "gothic", "goth", "dark", "grunge", "punk", "cyberpunk", "steampunk",
    "bohemian", "boho", "hippie",
    "streetwear", "street style", "urban",
    "preppy", "classic", "conservative",
    "vintage", "retro", "cottagecore", "fairycore", "darkacademia",
    "dark academia", "light academia", "cottagecore",
    "sporty", "sporty-chic", "athleisure",
    "elegant", "sophisticated", "minimalist", "maximalist",
    "lolita", "cosplay", "anime",

    // ── Age / general appearance ─────────────────────────────
    "young", "mature", "aged", "elderly", "youthful", "adult", "teenage",
    "middle-aged", "middle aged",

    // ── Colour as standalone appearance adjective ─────────────
    "red ", "blue ", "green ", "purple ", "pink ", "white ", "black ",
    "gold ", "silver ", "brown ", "orange ", "yellow ",
    "crimson", "azure", "emerald", "violet", "indigo",
    "magenta", "teal", "turquoise", "ivory", "beige", "nude",

    // ── Tattoos / piercings / body modifications ──────────────
    "tattoo", "tattoos", "tattooed", "ink", "inked",
    "piercing", "piercings", "pierced",
    "nose ring", "lip ring", "septum", "tongue ring",
    "belly ring", "navel piercing",

    // ── NSFW — explicit nudity / exposure state ───────────────
    "nude", "naked", "topless", "bottomless", "bare", "exposed",
    "undressed", "unclothed", "undraped", "disrobed",
    "fully nude", "completely naked", "in the nude",
    "uncovered", "revealing",

    // ── NSFW — intimate / lingerie clothing ───────────────────
    "lingerie", "bra", "panties", "underwear", "thong", "g-string",
    "bikini", "swimsuit", "swimwear", "one-piece", "two-piece",
    "stockings", "thigh-highs", "fishnet stockings", "fishnet",
    "garter", "garter belt", "garter straps",
    "corset", "bustier", "bodice",
    "negligee", "nightgown", "nightie", "babydoll",
    "pasties", "nipple covers",
    "crotchless", "see-through", "sheer", "mesh",
    "latex", "leather outfit", "pvc",
    "bodysuit", "teddy",

    // ── NSFW — breast detail descriptors ─────────────────────
    "nipple", "nipples", "areola", "areolae",
    "perky nipples", "hard nipples", "erect nipples",
    "large nipples", "small nipples", "puffy nipples",
    "dark areola", "pink areola",
    "sagging", "perky breasts", "heavy breasts", "firm breasts",
    "teardrop breasts", "round breasts", "natural breasts", "fake breasts",
    "implants", "breast implants",

    // ── NSFW — genitalia / intimate anatomy ───────────────────
    "vagina", "vulva", "labia", "clitoris", "clit",
    "pussy", "sex", "groin", "pubic",
    "penis", "cock", "shaft", "glans", "foreskin", "uncircumcised", "circumcised",
    "balls", "testicles", "scrotum",
    "buttocks", "butt", "ass", "rear", "bottom", "backside",
    "bubble butt", "big butt", "round butt", "perky butt", "flat butt",
    "anus", "anal",
    "thighs", "inner thighs", "crotch",

    // ── NSFW — body hair (intimate) ───────────────────────────
    "pubic hair", "bush", "landing strip", "brazillian wax",
    "shaved pubic", "trimmed pubic", "hairy",
    "armpit hair", "body hair",
    "chest hair", "leg hair",

    // ── NSFW — arousal / physical state ──────────────────────
    "aroused", "turned on", "flushed", "blushing",
    "wet", "glistening", "slick", "slippery",
    "swollen", "engorged", "erect", "hard", "stiff",
    "throbbing", "pulsing",
    "breathless", "panting",
    "cum", "semen", "creampie", "dripping",

    // ── NSFW — body proportions / adult build descriptors ─────
    "thick thighs", "thunder thighs", "meaty thighs",
    "wide hips", "childbearing hips", "narrow hips",
    "big ass", "fat ass", "huge ass", "jiggly",
    "huge breasts", "massive breasts", "giant breasts", "small breasts",
    "flat chest", "nearly flat", "mosquito bites",
    "toned abs", "six-pack", "defined abs", "soft belly", "chubby belly",
    "innie", "outie", "belly button",
  ];

  // Narrative / non-visual patterns to strip from surviving fragments.
  // These are clause starters that introduce personality or backstory.
  const NARRATIVE_STRIP = [
    /\b(she|he|they)\s+(is|are|was|were|has|have|had|tends?|likes?|loves?|hates?|enjoys?|believes?|feels?|thinks?|knows?|wants?|seems?|appears?)\b[^,]*/gi,
    /\b(known\s+for|famous\s+for|regarded\s+as|considered|described\s+as)\b[^,]*/gi,
    /\b(who|that|which|because|although|despite|however|but|and\s+(?:she|he|they))\b[^,]*/gi,
    /\b(her|his|their)\s+(personality|nature|attitude|demeanor|character|backstory|history|past|story)\b[^,]*/gi,
    /\b(often|always|never|usually|sometimes|rarely)\s+(?!wearing|dressed)[^,]*/gi,
  ];

  // 1. Normalise whitespace and split into candidate fragments on
  //    sentence boundaries ( . ! ? ) and list commas.
  const raw = text.replace(/\s+/g, " ").trim();
  const fragments = raw
    .split(/[.!?]+|,\s*/)
    .map(f => f.trim())
    .filter(Boolean);

  const kept = [];

  for (let frag of fragments) {
    const lower = frag.toLowerCase();

    // 2. Keep only fragments that contain at least one physical signal word.
    const isPhysical = PHYSICAL_SIGNALS.some(sig => lower.includes(sig));
    if (!isPhysical) continue;

    // 3. Strip narrative sub-clauses from the surviving fragment.
    let clean = frag;
    for (const pattern of NARRATIVE_STRIP) {
      clean = clean.replace(pattern, "");
    }
    // Collapse any artefact punctuation left behind by the strip.
    clean = clean.replace(/\s*[,;]\s*$/, "").replace(/^\s*[,;]\s*/, "").replace(/\s+/g, " ").trim();

    if (clean.length > 2) kept.push(clean);
  }

  return kept.join(", ");
}

/**
 * Build the imagePromptTriggers string from generated character data.
 *
 * Format (per OpenCharacters spec):
 *   trigger: description text to append when that trigger appears in an image prompt
 *   @prepend before description → text is prepended instead of appended
 *
 * Each line is a character/place/object reference so that whenever the AI
 * writes an image prompt containing a known noun (a character name, a world
 * keyword, etc.) the matching visual description is automatically injected.
 *
 * extractPhysicalTraits() is applied to all free-form description inputs so
 * that only visually-renderable tokens reach the image model — no narrative
 * sentences, personality summaries, or backstory clauses.
 *
 * @param {string}      charName        - AI character name
 * @param {string}      charDescription - AI character full appearance / personality
 * @param {string}      charTraits      - comma-separated personality traits
 * @param {string}      charQuirk       - distinctive quirk / physical habit
 * @param {string}      userName        - user character name
 * @param {string}      userDescription - user character full appearance
 * @param {string}      worldDesc       - setting / world description
 * @param {string|null} genre           - genre key from GENRES, or null
 * @returns {string}                    - newline-separated trigger lines
 */
function buildImagePromptTriggers(charName, charDescription, charTraits, charQuirk, userName, userDescription, worldDesc, genre) {
  const lines = [];

  // ── Character reference ───────────────────────────────────
  // extractPhysicalTraits() scans the full description, traits, and quirk text
  // to produce a compact list of only visually-renderable tokens — no narrative.
  if (charName && charDescription) {
    const allCharText = [charDescription, charTraits, charQuirk].filter(Boolean).join(". ");
    const charVisual  = extractPhysicalTraits(allCharText);
    if (charVisual) lines.push(`${charName}: ${charVisual}`);
  }

  // ── User character reference ──────────────────────────────
  if (userName && userDescription) {
    const userVisual = extractPhysicalTraits(userDescription);
    if (userVisual) lines.push(`${userName}: ${userVisual}`);
  }

  // ── World / setting reference ─────────────────────────────
  if (worldDesc) {
    const worldVisual = worldDesc.replace(/\s+/g, " ").slice(0, 150).trim();
    lines.push(`the setting: ${worldVisual}`);
    lines.push(`the world: ${worldVisual}`);
  }

  // ── Genre-specific environment references ────────────────
  const genreEnvs = {
    fantasy:   "ancient stone castle, enchanted forest, torchlit corridors, mystical atmosphere",
    scifi:     "futuristic space station, neon-lit corridors, holographic displays, high-tech environment",
    horror:    "crumbling mansion, dim flickering lights, deep shadows, unsettling atmosphere",
    romance:   "soft candlelight, flower-filled garden, warm golden ambiance, intimate atmosphere",
    mystery:   "dimly lit detective office, rain-slicked streets, fog, mysterious atmosphere",
    adventure: "sweeping landscape, dramatic sky, rugged terrain, epic vista",
    comedy:    "bright colorful environment, exaggerated expressions, lively chaotic setting",
    slice:     "cozy cafe interior, sunlit street, warm everyday atmosphere",
    spicy:     "intimate bedroom, soft warm lighting, luxurious textures, sensual atmosphere",
    smut:      "intimate bedroom, soft warm lighting, luxurious textures, sensual atmosphere",
  };

  if (genre && genreEnvs[genre]) {
    lines.push(`the room: ${genreEnvs[genre]}`);
    lines.push(`the scene: ${genreEnvs[genre]}`);
  }

  return lines.join("\n");
}

/**
 * Wrap a raw image prompt with BASE_QUALITY_POSITIVE and (if set) the
 * currently-selected style's prepend/append.
 *
 * BASE_QUALITY_POSITIVE is always injected so that every oc.textToImage()
 * call — whether a style is selected or not — guards against uncanny faces,
 * misaligned eyes, and bad anatomy without needing per-call boilerplate.
 *
 * @param {string} corePrompt  - the subject / scene description
 * @returns {string}           - fully-styled, quality-boosted prompt string
 */
function styledImagePrompt(corePrompt) {
  const qualityCore = `${corePrompt}, ${BASE_QUALITY_POSITIVE}`;
  const styleKey = oc.character.customData?.selectedImageStyle;
  if (!styleKey || !IMAGE_STYLES[styleKey]) return qualityCore;
  const style = IMAGE_STYLES[styleKey];
  return `${style.prepend} ${qualityCore}${style.append}`;
}

// ── INIT ─────────────────────────────────────────────────────

/**
 * Show the two-step setup UI (genre → image style) only when the character
 * has not yet been created.  Once both selections are made the generation
 * flow fires automatically.
 */
(function initSetupWizard() {
  if (oc.character.name !== "Unknown") return;

  oc.window.show();
  document.body.style.cssText =
    "margin:0;padding:12px;font-family:system-ui,sans-serif;background:#1a1a2e;color:#eee;overflow-y:auto;";

  _renderGenreStep();
})();

function _renderGenreStep() {
  document.body.innerHTML = `
    <style>
      h2  { margin:0 0 6px; font-size:0.95rem; color:#aaa; font-weight:400; }
      .step-label { font-size:0.7rem; color:#666; margin-bottom:10px; letter-spacing:.04em; text-transform:uppercase; }
      .genre-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px; }
      .genre-btn {
        padding:8px 4px; border-radius:8px; border:1px solid #333;
        background:#16213e; color:#eee; cursor:pointer; font-size:0.85rem;
        transition:background .15s, transform .1s;
      }
      .genre-btn:hover { background:#0f3460; transform:scale(1.03); }
      .genre-btn.selected { background:#533483; border-color:#9b59b6; }
      #skipBtn {
        width:100%; padding:6px; border-radius:8px; border:none;
        background:#333; color:#bbb; cursor:pointer; font-size:0.8rem;
      }
    </style>
    <div class="step-label">Step 1 of 3 · Genre</div>
    <h2>Choose a genre to get started</h2>
    <div class="genre-grid" id="genreGrid"></div>
    <button id="skipBtn">⚡ Let the AI decide</button>
  `;

  const grid = document.getElementById("genreGrid");
  let selectedGenre = null;

  for (const [key, val] of Object.entries(GENRES)) {
    const btn = document.createElement("button");
    btn.className = "genre-btn";
    btn.textContent = val.label;
    btn.dataset.genre = key;
    btn.onclick = () => {
      document.querySelectorAll(".genre-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedGenre = key;
      oc.character.customData.selectedGenre = key;
      setTimeout(() => _renderStyleStep(), 250);
    };
    grid.appendChild(btn);
  }

  document.getElementById("skipBtn").onclick = () => {
    oc.character.customData.selectedGenre = null;
    _renderStyleStep();
  };
}

function _renderStyleStep() {
  document.body.innerHTML = `
    <style>
      h2  { margin:0 0 4px; font-size:0.95rem; color:#aaa; font-weight:400; }
      .step-label { font-size:0.7rem; color:#666; margin-bottom:8px; letter-spacing:.04em; text-transform:uppercase; }
      .category-label {
        font-size:0.72rem; color:#888; text-transform:uppercase;
        letter-spacing:.06em; margin:10px 0 4px; padding-left:2px;
      }
      .style-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; }
      .style-btn {
        padding:7px 3px; border-radius:8px; border:1px solid #333;
        background:#16213e; color:#eee; cursor:pointer; font-size:0.78rem;
        text-align:center; line-height:1.3;
        transition:background .15s, transform .1s;
      }
      .style-btn:hover  { background:#0f3460; transform:scale(1.03); }
      .style-btn.selected { background:#1a4a3a; border-color:#2ecc71; }
      #styleSkipBtn {
        width:100%; margin-top:10px; padding:6px; border-radius:8px; border:none;
        background:#333; color:#bbb; cursor:pointer; font-size:0.8rem;
      }
      #backBtn {
        width:100%; margin-bottom:8px; padding:5px; border-radius:8px; border:1px solid #333;
        background:transparent; color:#777; cursor:pointer; font-size:0.75rem;
      }
    </style>
    <button id="backBtn">← Back to genre</button>
    <div class="step-label">Step 2 of 3 · Image Style</div>
    <h2>Choose an image generation style</h2>
    <div id="styleList"></div>
    <button id="styleSkipBtn">⚡ No specific style</button>
  `;

  document.getElementById("backBtn").onclick = _renderGenreStep;

  const list = document.getElementById("styleList");

  // Group buttons by category, rendering a header per group
  for (const catLabel of STYLE_CATEGORIES) {
    const catStyles = Object.entries(IMAGE_STYLES).filter(([, v]) => v.category === catLabel);
    if (!catStyles.length) continue;

    const header = document.createElement("div");
    header.className = "category-label";
    header.textContent = catLabel;
    list.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "style-grid";
    list.appendChild(grid);

    for (const [key, val] of catStyles) {
      const btn = document.createElement("button");
      btn.className = "style-btn";
      btn.textContent = val.label;
      btn.dataset.style = key;
      btn.onclick = () => {
        document.querySelectorAll(".style-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        _applyImageStyle(key);
        setTimeout(() => _renderToneStep(), 300);
      };
      grid.appendChild(btn);
    }
  }

  document.getElementById("styleSkipBtn").onclick = () => {
    _applyImageStyle(null);
    _renderToneStep();
  };
}

function _renderToneStep() {
  document.body.innerHTML = `
    <style>
      h2  { margin:0 0 4px; font-size:0.95rem; color:#aaa; font-weight:400; }
      .step-label { font-size:0.7rem; color:#666; margin-bottom:8px; letter-spacing:.04em; text-transform:uppercase; }
      .section-label {
        font-size:0.72rem; color:#888; text-transform:uppercase;
        letter-spacing:.06em; margin:10px 0 4px; padding-left:2px;
      }
      .tone-grid { display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-bottom:2px; }
      .tone-btn {
        padding:8px 6px; border-radius:8px; border:1px solid #333;
        background:#16213e; color:#eee; cursor:pointer; font-size:0.82rem;
        text-align:center; line-height:1.35;
        transition:background .15s, transform .1s;
      }
      .tone-btn:hover   { background:#0f3460; transform:scale(1.03); }
      .tone-btn.selected { background:#1a4a3a; border-color:#2ecc71; }
      .tone-btn.nsfw-undertone { border-color:#7a4a00; }
      .tone-btn.nsfw-btn  { border-color:#5a1a1a; }
      #toneSkipBtn {
        width:100%; margin-top:10px; padding:6px; border-radius:8px; border:none;
        background:#333; color:#bbb; cursor:pointer; font-size:0.8rem;
      }
      #toneBackBtn {
        width:100%; margin-bottom:8px; padding:5px; border-radius:8px; border:1px solid #333;
        background:transparent; color:#777; cursor:pointer; font-size:0.75rem;
      }
    </style>
    <button id="toneBackBtn">← Back to image style</button>
    <div class="step-label">Step 3 of 3 · Scenario Tone</div>
    <h2>Choose the tone of the opening scenario</h2>
    <div id="toneList"></div>
    <button id="toneSkipBtn">⚡ No preference</button>
  `;

  document.getElementById("toneBackBtn").onclick = _renderStyleStep;

  const list = document.getElementById("toneList");

  // Group tones by SFW / undertones / NSFW for clarity
  const groups = [
    {
      label: "✅ SFW",
      keys: Object.entries(SCENARIO_TONES)
        .filter(([, v]) => !v.nsfw && !v.undertones)
        .map(([k]) => k),
    },
    {
      label: "🌶️ SFW — with suggestive undertones",
      keys: Object.entries(SCENARIO_TONES)
        .filter(([, v]) => v.undertones)
        .map(([k]) => k),
    },
    {
      label: "🔞 NSFW",
      keys: Object.entries(SCENARIO_TONES)
        .filter(([, v]) => v.nsfw)
        .map(([k]) => k),
    },
  ];

  for (const group of groups) {
    if (!group.keys.length) continue;

    const header = document.createElement("div");
    header.className = "section-label";
    header.textContent = group.label;
    list.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "tone-grid";
    list.appendChild(grid);

    for (const key of group.keys) {
      const val = SCENARIO_TONES[key];
      const btn = document.createElement("button");
      btn.className = "tone-btn" +
        (val.nsfw ? " nsfw-btn" : val.undertones ? " nsfw-undertone" : "");
      btn.textContent = val.label;
      btn.dataset.tone = key;
      btn.onclick = () => {
        document.querySelectorAll(".tone-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        oc.character.customData.selectedScenarioTone = key;
        setTimeout(() => oc.window.hide(), 300);
      };
      grid.appendChild(btn);
    }
  }

  document.getElementById("toneSkipBtn").onclick = () => {
    oc.character.customData.selectedScenarioTone = null;
    oc.window.hide();
  };
}

// ── KINKS LIST LOADER ─────────────────────────────────────────

async function fetchKinksList() {
  if (oc.character.customData.__pcbw_kinksList) return oc.character.customData.__pcbw_kinksList;
  try {
    const resp = await fetch(KINKS_URL);
    const text = await resp.text();
    oc.character.customData.__pcbw_kinksList = text.trim();
    return text.trim();
  } catch (e) {
    console.warn("[Kinks] Failed to fetch kinks list — continuing without kinks context:", e);
    return "";
  }
}

// ── KINKS FILTER — select only character-applicable kinks ─────
//  Uses an AI call to pick relevant kinks from the full reference list
//  based on the character's personality, traits, and scenario.
//  Results are cached in customData so this only runs once per character
//  generation (not every message).

async function filterKinksForCharacter() {
  // Return cached result if already filtered for this character
  if (oc.character.customData.__pcbw_filteredKinks) {
    return oc.character.customData.__pcbw_filteredKinks;
  }

  const fullKinks = oc.character.customData.__pcbw_kinksList || "";
  if (!fullKinks) return "";

  const charName   = oc.character.customData.charName || oc.character.name || "the character";
  const charDesc   = oc.character.customData.charDescription || "";
  const charTraits = oc.character.customData.charTraits || "";
  const charQuirk  = oc.character.customData.charQuirk || "";

  try {
    const result = await oc.getChatCompletion({
      messages: [
        {
          author: "system",
          content: [
            `You are a kink-curation assistant. Given a character profile and a reference list of kinks, select ONLY the kinks that naturally fit this specific character's personality, traits, and scenario.`,
            `For each selected kink, output it on its own line in this exact format:`,
            `- <kink name>: <1-2 sentence explanation of how this kink fits this character>`,
            ``,
            `Rules:`,
            `- Select 5-12 kinks maximum — quality over quantity.`,
            `- Only pick kinks that genuinely suit the character's personality, role, or dynamic.`,
            `- The explanation should tie the kink to the character's specific traits or scenario.`,
            `- Do not add kinks not in the reference list.`,
            `- Output ONLY the formatted list, no preamble or commentary.`,
          ].join("\n"),
        },
        {
          author: "user",
          content: [
            `CHARACTER PROFILE:`,
            `Name: ${charName}`,
            `Description: ${charDesc}`,
            `Traits: ${charTraits}`,
            `Quirk: ${charQuirk}`,
            ``,
            `KINK REFERENCE LIST:`,
            fullKinks,
          ].join("\n"),
        },
      ],
      temperature: 0.5,
    });

    if (result && result.trim()) {
      oc.character.customData.__pcbw_filteredKinks = result.trim();
      return result.trim();
    }
  } catch (e) {
    console.warn("[Kinks] Filtering failed — falling back to no kinks:", e);
  }

  return "";
}

// ── LORE SYSTEM ──────────────────────────────────────────────
//  Lore entries are stored in customData (not applied to character fields).
//  They are read and injected as hidden system messages after every user reply.

function buildLoreEntries(charName, charDescription, charTraits, charQuirk, worldDesc, mood, isNsfw, genre) {
  const lore = [];

  lore.push({
    key: "character_essence",
    content: `${charName} embodies ${charTraits}. Their signature quirk: ${charQuirk}. This shapes every interaction, dialogue choice, and physical mannerism.`,
  });

  lore.push({
    key: "world_state",
    content: `The world: ${worldDesc}. Current atmosphere: ${mood}. The environment responds to emotional tension — surroundings shift with the scene's energy.`,
  });

  lore.push({
    key: "relationship_dynamic",
    content: `Track the evolving dynamic between ${charName} and the other character. Note power shifts, emotional undercurrents, unspoken tensions, and moments of vulnerability or dominance.`,
  });

  if (isNsfw && (genre === "spicy" || genre === "smut")) {
    lore.push({
      key: "spicy_tone",
      content: `Writing style: sensual, kink-positive, in-depth, 18+. Embrace desire openly. Build tension through body language, breath, texture, and anticipation. Never fade to black. Every touch has weight and consequence. Layer sensory detail — warmth, pressure, scent, sound.`,
    });
    lore.push({
      key: "kink_awareness",
      content: `Reference loaded kinks context naturally. Weave preferences into character behavior, dialogue subtext, and scenario progression. Let kinks emerge from character and moment rather than forced exposition.`,
    });
  }

  return lore;
}

function injectLoreContext() {
  const lore = oc.character.customData.__pcbw_lore;
  if (!lore || !lore.length) return;

  const filteredKinks = oc.character.customData.__pcbw_filteredKinks || "";
  const genre = oc.character.customData.selectedGenre;
  const isSpicy = genre === "spicy" || genre === "smut";

  let loreText = lore.map(l => `[${l.key}]: ${l.content}`).join("\n");

  if (isSpicy && filteredKinks) {
    loreText += `\n[kinks_context]: Character-specific kink preferences — weave naturally into the scene:\n${filteredKinks}`;
  }

  const loreMessage = {
    author:       "system",
    hiddenFrom:   ["user"],
    name:         "Lore",
    expectsReply: true,
    content:      `[Active Lore — read and apply to your next response]\n${loreText}`,
    customData:   { __pcbw_isLore: true },
  };

  // Update existing lore message or insert a new one
  const existingIdx = oc.thread.messages.findIndex(
    m => m.author === "system" && m.customData?.__pcbw_isLore
  );

  if (existingIdx >= 0) {
    oc.thread.messages[existingIdx] = loreMessage;
  } else {
    oc.thread.messages.push(loreMessage);
  }
}

// ── DYNAMIC POINTERS ─────────────────────────────────────────
//  Context-aware narrative pointers generated after each user message.
//  They push responses forward predictively without narrative rails.

async function generateDynamicPointers() {
  try {
    const recent = oc.thread.messages
      .filter(m => !m.customData?.__pcbw_isLore && !m.customData?.__pcbw_isPointer
                   && (m.author !== "system" || !m.hiddenFrom?.includes("ai")))
      .slice(-6)
      .map(m => `${m.name || m.author}: ${m.content.replace(/<[^>]+>/g, "").slice(0, 400)}`)
      .join("\n");

    if (!recent.trim()) return;

    const genre = oc.character.customData.selectedGenre;
    const isSpicy = genre === "spicy" || genre === "smut";

    const pointerInstruction = isSpicy
      ? [
          `Analyze the conversation below. Generate exactly 3 short narrative pointers (1 sentence each) that push the scene forward.`,
          `Focus on: sensual tension escalation, character desire and body language, physical/emotional power dynamics.`,
          `Be explicit, kink-positive, and grounded in the characters' established personalities.`,
          `Format: one pointer per line, prefixed with "→". No numbering, no explanation.`,
        ].join(" ")
      : [
          `Analyze the conversation below. Generate exactly 3 short narrative pointers (1 sentence each) that push the story forward.`,
          `Focus on: unresolved tension or conflict, character motivation and emotional state, environmental or situational shifts.`,
          `Pointers should suggest direction without prescribing exact outcomes.`,
          `Format: one pointer per line, prefixed with "→". No numbering, no explanation.`,
        ].join(" ");

    const result = await oc.getChatCompletion({
      messages: [
        { author: "system", content: pointerInstruction },
        { author: "user",   content: recent },
      ],
      temperature: 0.7,
    });

    if (result) {
      const pointers = result.trim();
      oc.thread.customData ??= {};
      oc.thread.customData.__pcbw_dynamicPointers = pointers;

      // Remove old pointer message
      const oldIdx = oc.thread.messages.findIndex(
        m => m.customData?.__pcbw_isPointer
      );
      if (oldIdx >= 0) oc.thread.messages.splice(oldIdx, 1);

      // Insert new pointer message
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["user"],
        name:         "Narrative Direction",
        expectsReply: false,
        content:      `[Dynamic narrative pointers — incorporate these naturally into your next response. Do not list them explicitly.]\n${pointers}`,
        customData:   { __pcbw_isPointer: true },
      });
    }
  } catch (e) {
    console.warn("[Pointers] Dynamic pointer generation failed:", e);
  }
}

// ── MAIN EVENT LISTENER ──────────────────────────────────────

oc.thread.on("MessageAdded", async function ({ message }) {
  // ── Slash commands (available at all times) ──────────────
  if (message.author === "user") {
    const handled = await handleSlashCommand(message);
    if (handled) return;

    // URL reader — extract page content and inject as hidden system message
    await handleUrlsInMessage(message);
  }

  // ── Character creation flow (only while name is "Unknown") ─
  if (oc.character.name === "Unknown") {
    generateCharactersAndScenario(message.content);
    return;
  }

  // ── After user message: inject lore context + generate dynamic pointers ─
  if (message.author === "user") {
    injectLoreContext();
    await generateDynamicPointers();
    // Ensure the AI always replies after all custom-code processing completes.
    message.expectsReply = true;
  }

  // ── Post-generation: emotion avatar + memory digest ────────
  if (message.author === "ai") {
    appendEmotionReaction(message);
    renderChoiceButtons();   // handled via rendering pipeline — triggers visual rebuild
    await maybeDigestMemory();
  }
});

oc.thread.on("MessageEdited", function ({ message }) {
  if (message.author === "ai") renderChoiceButtons();
});

// ── CHARACTER GENERATION ─────────────────────────────────────

window.generateCharactersAndScenario = async function (userInstruction = null) {
  if (alreadyGenerating) return;
  alreadyGenerating = true;

  try {
    let isRegen = false;
    if (userInstruction === null) {
      userInstruction = oc.character.customData.userInstruction;
      isRegen = true;
    } else {
      oc.character.customData.userInstruction = userInstruction;
    }

    const genre         = oc.character.customData.selectedGenre || null;
    const selectedTone  = oc.character.customData.selectedScenarioTone || null;
    const isNsfw        = (genre ? !!GENRES[genre].nsfw : false) ||
                          (selectedTone ? !!SCENARIO_TONES[selectedTone]?.nsfw : false);
    const genreHint = genre
      ? genre === "spicy"
        ? `The roleplay is explicitly adult/erotic (🌶️ Spicy). Kink-focused, NSFW, 18+, kink-positive. Create a sensually-charged scenario with in-depth, descriptive writing. Characters should have clear desires, tensions, and physical chemistry. Explicit content is fully permitted and expected.`
        : isNsfw
          ? `The roleplay is explicitly adult/erotic (🔞 Smut). You must create a sensual, sexually-charged scenario and characters. Explicit adult content is fully permitted and expected. Do not censor or fade to black.`
          : `The roleplay should have a "${GENRES[genre].label}" genre/tone.`
      : "";
    const toneHint = selectedTone && SCENARIO_TONES[selectedTone]
      ? `SCENARIO TONE: ${SCENARIO_TONES[selectedTone].hint}`
      : "";

    if (isRegen) {
      oc.thread.messages = [];
    } else {
      oc.thread.messages.shift();
    }

    // ── Loading message ──
    oc.thread.messages.push({
      author: "ai",
      name: "Unknown",
      content: buildLoadingMessage(isRegen),
      customData: { isPleaseWaitMessage: true },
      avatar: { url: GENERATOR_AVATAR },
    });

    // ── Generation ──
    const instructionLines = [
      `The user wants to engage in a fun, creative roleplay. Your task is to CREATE a character for yourself and a scenario, based on the "USER INSTRUCTION" below.`,
      `If the user's instructions don't specify a character for themselves, make one up that fits the scenario.`,
      genreHint,
      toneHint,
      ``,
      `USER INSTRUCTION: ${userInstruction}`,
      ``,
      `Respond using this EXACT template — do not add extra fields, do not skip any:`,
      ``,
      `NAME: <character name>`,
      `DESCRIPTION: <rich, detailed description of your character covering their physical appearance, personality, backstory, mannerisms, and motivations — write at least 3-4 detailed paragraphs; the description MUST be a minimum of 1250 characters and a maximum of 2000 characters; do not summarise, be vivid and specific>`,
      `TRAITS: <three comma-separated personality traits>`,
      `QUIRK: <one memorable quirk or habit>`,
      `WORLD: <one sentence describing the setting/world>`,
      ``,
      `USER NAME: <user's character name>`,
      `USER DESCRIPTION: <one-paragraph description of the user's character>`,
      ``,
      `ROLEPLAY STARTER: <an engaging, vivid, one-paragraph opening scene involving both characters>`,
      ``,
      `TIME OF DAY: <time of day in the scenario>`,
      `MOOD: <overall mood/atmosphere: e.g. tense, playful, melancholic, mysterious>`,
      `IMAGE PROMPT: <a concise Stable Diffusion scene prompt for a background image that fits the scenario>`,
    ].join("\n");

    // ── Multi-pass generation (up to 4 AI calls) ──────────────────────────────
    // The Perchance model has an 800-token output limit per call.  A full
    // character sheet often exceeds that.  When a call is cut short the loop
    // detects the truncation and issues a continuation call, re-presenting all
    // accumulated text as `startWith` so the AI picks up exactly where it left
    // off without repeating already-written fields.
    const MAX_GEN_PASSES = 4;
    // MOOD is the last required field before the stop-sequence "IMAGE PROMPT:"
    // — its presence means the sheet is complete.
    const COMPLETION_SENTINEL = "MOOD:";

    let rawAccumulated = "";
    let lastStopReason = "";

    for (let pass = 1; pass <= MAX_GEN_PASSES; pass++) {
      const response = await oc.generateText({
        instruction: instructionLines,
        startWith:   "NAME:" + rawAccumulated,
        stopSequences: ["IMAGE PROMPT:"],
      });

      rawAccumulated += response.text;
      lastStopReason  = response.stopReason;

      // Hard error — abort immediately.
      if (lastStopReason === "error") break;
      // Natural completion or stop-sequence hit — done.
      if (lastStopReason === "stop" || lastStopReason === "endTurn") break;
      // All required fields present — done regardless of stopReason.
      if (rawAccumulated.includes(COMPLETION_SENTINEL)) break;
      // Otherwise the output was truncated by the token limit; loop for
      // another pass to continue filling remaining fields.
    }

    // Accept partial responses (e.g. only NAME + DESCRIPTION present) but
    // require at minimum DESCRIPTION so the character is usable.
    if (lastStopReason === "error" && !rawAccumulated.includes("DESCRIPTION:")) {
      throw new Error("Generation failed — no usable content returned.");
    }

    const raw   = rawAccumulated;
    const lines = raw.split(/\n+/).map(l => l.trim());

    const pick = (prefix) =>
      (lines.find(l => l.startsWith(prefix + ":")) || "")
        .replace(prefix + ":", "").trim();

    // Captures multi-line content for a field: everything between `prefix:` and
    // the next known section header (or end of response).
    const FIELD_HEADERS = ["NAME", "DESCRIPTION", "TRAITS", "QUIRK", "WORLD",
                           "USER NAME", "USER DESCRIPTION", "ROLEPLAY STARTER",
                           "TIME OF DAY", "MOOD", "IMAGE PROMPT"];
    const pickBlock = (prefix) => {
      const stopPattern = FIELD_HEADERS
        .filter(h => h !== prefix)
        .map(h => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ":")
        .join("|");
      const regex = new RegExp(
        `${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*([\\s\\S]*?)(?=\\n(?:${stopPattern})|$)`
      );
      const match = raw.match(regex);
      return match ? match[1].trim() : "";
    };

    const charName        = pick("NAME");
    const charDescription = pickBlock("DESCRIPTION").slice(0, 2000);
    const charTraits      = pick("TRAITS");
    const charQuirk       = pick("QUIRK");
    const worldDesc       = pick("WORLD");
    const userName        = pick("USER NAME");
    let   userDescription = pick("USER DESCRIPTION");
    const starter         = pick("ROLEPLAY STARTER");
    const mood            = pick("MOOD");
    const imagePrompt     = pick("IMAGE PROMPT") || `${worldDesc}, atmospheric, detailed, cinematic`;

    if (charDescription.length < 1250) {
      throw new Error(
        `The AI returned a character description that is too short ` +
        `(${charDescription.length} / 1250 characters minimum). ` +
        `Please try generating again.`
      );
    }

    // Fallback: AI sometimes omits "USER DESCRIPTION:" prefix
    if (!userDescription) {
      const allDescs = lines.filter(l => l.startsWith("DESCRIPTION:"));
      if (allDescs[1]) userDescription = allDescs[1].replace("DESCRIPTION:", "").trim();
    }

    // ── Apply to character ──
    oc.character.name            = charName || "Character";
    oc.character.roleInstruction = buildRoleInstruction(charName, charDescription, charTraits, charQuirk, worldDesc, isNsfw, genre);
    oc.character.reminderMessage = buildReminderMessage(charTraits, charQuirk, mood, genre);
    oc.character.initialMessages = [];
    oc.character.avatar.url      = "";

    oc.character.userCharacter.name = userName || "Traveller";

    // Store metadata for later use (regen, status command, etc.)
    Object.assign(oc.character.customData, {
      charTraits, charQuirk, worldDesc, mood, imagePrompt,
      charDescription, userDescription, userName, charName, starter,
    });

    // ── Build and store lore entries in customData ──
    const loreEntries = buildLoreEntries(charName, charDescription, charTraits, charQuirk, worldDesc, mood, isNsfw, genre);
    oc.character.customData.__pcbw_lore = loreEntries;

    // ── Update extensible character objects ──
    // imagePromptPrefix / imagePromptSuffix — derived from the selected image
    // style so that ALL image calls (including AI-triggered ones) automatically
    // inherit the style without needing to go through styledImagePrompt().
    _applyImageStyle(oc.character.customData.selectedImageStyle);

    // imagePromptTriggers — keyword→description lookup so that whenever the AI
    // writes an image prompt containing a known name or noun, the matching
    // visual description is automatically injected into that prompt.
    oc.character.imagePromptTriggers = buildImagePromptTriggers(
      charName, charDescription, charTraits, charQuirk,
      userName, userDescription,
      worldDesc, genre
    );

    // ── Fetch and filter kinks list for spicy/smut genres ──
    if (isNsfw && (genre === "spicy" || genre === "smut")) {
      await fetchKinksList();           // cached raw list in customData
      await filterKinksForCharacter();  // cached filtered list in customData
    }

    // ── Generate avatars in parallel ─────────────────────────
    //  Avatar prompts are also passed through styledImagePrompt() so they
    //  inherit the chosen image style (prepend/append).
    //  When NSFW mode is active (via genre or tone) the quality descriptor
    //  is broadened to allow adult/sensual portrait content; otherwise the
    //  "pfp / avatar portrait" framing keeps images clean and headshot-like.
    const avatarQuality = isNsfw
      ? "character portrait, expressive face, sensual, adult content"
      : "pfp, avatar portrait, expressive face";

    const charAvatarPromise = oc.textToImage({
      prompt: styledImagePrompt(
        `${charName} character portrait, ${charDescription}, ${charTraits}, ${avatarQuality}`
      ),
      negativePrompt: NEG_PROMPT,
    }).then(async ({ dataUrl }) => {
      oc.character.avatar.url = await resizeDataURLWidth(dataUrl, 300);
    }).catch(() => {});

    const userAvatarPromise = oc.textToImage({
      prompt: styledImagePrompt(
        `${userName} character portrait, ${userDescription}, ${avatarQuality}`
      ),
      negativePrompt: NEG_PROMPT,
    }).then(async ({ dataUrl }) => {
      oc.character.userCharacter.avatar.url = await resizeDataURLWidth(dataUrl, 300);
    }).catch(() => {});

    // Fire-and-forget avatar generation — don't block message display
    Promise.all([charAvatarPromise, userAvatarPromise]);

    // ── Apply scene (genre background/music) ──
    const sceneMessage = buildSceneMessage(genre, imagePrompt, mood);

    // ── Build introduction thread ──
    oc.thread.messages = [
      sceneMessage,
      {
        author: "system",
        name:    "Unknown",
        hiddenFrom: ["ai"],
        content: `<span style="opacity:0.65;">✅ Character generated — here's a summary:</span>`,
        avatar:  { url: GENERATOR_AVATAR },
      },
      {
        author:        "system",
        name:          "Introduction",
        content:       buildIntroMessage(charName, charDescription, charTraits, charQuirk, worldDesc, userName, userDescription, starter, mood),
        expectsReply:  false,
        avatar:        { size: 0 },
      },
    ];

    alreadyGenerating = false;
  } catch (e) {
    console.error("[CharGen] Error:", e);
    alreadyGenerating = false;
    oc.thread.messages = [
      {
        author:  "system",
        name:    "Unknown",
        hiddenFrom: ["ai"],
        content: buildErrorMessage(e),
        avatar:  { url: GENERATOR_AVATAR },
      },
    ];
  }
};

// ── SLASH COMMANDS ────────────────────────────────────────────

async function handleSlashCommand(message) {
  const raw = message.content.trim();
  if (!raw.startsWith("/")) return false;

  const [cmd, ...rest] = raw.slice(1).split(" ");
  const arg = rest.join(" ").trim();

  switch (cmd.toLowerCase()) {

    // /regen — regenerate character from scratch
    case "regen":
      oc.thread.messages.pop();
      oc.character.name = "Unknown";
      delete oc.character.customData.__pcbw_filteredKinks;
      generateCharactersAndScenario(oc.character.customData.userInstruction);
      return true;

    // /genre <key> — switch genre and optionally regen
    case "genre": {
      oc.thread.messages.pop();
      const key = arg.toLowerCase();
      if (!GENRES[key]) {
        oc.thread.messages.push({
          author:       "system",
          hiddenFrom:   ["ai"],
          name:         "System",
          content:      `❌ Unknown genre \`${key}\`. Available: ${Object.keys(GENRES).join(", ")}`,
          expectsReply: false,
        });
        return true;
      }
      oc.character.customData.selectedGenre = key;
      // Clear cached filtered kinks when genre changes so they can be re-filtered
      delete oc.character.customData.__pcbw_filteredKinks;
      if (oc.character.name !== "Unknown") {
        applyGenreScene(key);
        // Fetch and filter kinks if switching to a spicy/smut genre
        if (GENRES[key].nsfw && (key === "spicy" || key === "smut")) {
          await fetchKinksList();
          await filterKinksForCharacter();
        }
        oc.thread.messages.push({
          author:       "system",
          hiddenFrom:   ["ai"],
          name:         "System",
          content:      `🎭 Genre switched to **${GENRES[key].label}**. The atmosphere has shifted…`,
          expectsReply: false,
        });
      } else {
        generateCharactersAndScenario(oc.character.customData.userInstruction);
      }
      return true;
    }

    // /style <key> — switch image generation style at any time
    case "style": {
      oc.thread.messages.pop();
      const key = arg.toLowerCase();

      // Accept empty arg → open picker
      if (!key) {
        window._showStylePicker();
        return true;
      }

      if (!IMAGE_STYLES[key]) {
        oc.thread.messages.push({
          author:       "system",
          hiddenFrom:   ["ai"],
          name:         "System",
          content: [
            `❌ Unknown style \`${key}\`. Available styles:`,
            Object.entries(IMAGE_STYLES)
              .map(([k, v]) => `  • \`${k}\` — ${v.label} *(${v.category})*`)
              .join("\n"),
          ].join("\n"),
          expectsReply: false,
        });
        return true;
      }

      _applyImageStyle(key);
      const style = IMAGE_STYLES[key];
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["ai"],
        name:         "System",
        content:      `🎨 Image style switched to **${style.label}** *(${style.category})*.\nAll future images will use this style.`,
        expectsReply: false,
      });
      return true;
    }

    // /rename <new name> — rename the AI character
    case "rename":
      oc.thread.messages.pop();
      if (!arg) return true;
      oc.character.name = arg;
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["ai"],
        name:         "System",
        content:      `✏️ Character renamed to **${arg}**.`,
        expectsReply: false,
      });
      return true;

    // /status — display current character + style info
    case "status": {
      oc.thread.messages.pop();
      const d = oc.character.customData;
      const styleKey   = d.selectedImageStyle;
      const styleLabel = styleKey ? `${IMAGE_STYLES[styleKey]?.label} *(${IMAGE_STYLES[styleKey]?.category})*` : "None";
      const toneKey    = d.selectedScenarioTone;
      const toneLabel  = toneKey ? SCENARIO_TONES[toneKey]?.label : null;
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["ai"],
        name:         "Character Status",
        content: [
          `**🧑 ${oc.character.name}**`,
          d.charTraits       ? `- 🏷️ Traits: ${d.charTraits}` : "",
          d.charQuirk        ? `- 🌀 Quirk: ${d.charQuirk}` : "",
          d.worldDesc        ? `- 🌍 World: ${d.worldDesc}` : "",
          d.mood             ? `- 🎭 Mood: ${d.mood}` : "",
          `- 👤 User character: **${oc.character.userCharacter.name || "You"}**`,
          d.selectedGenre    ? `- 🎬 Genre: ${GENRES[d.selectedGenre]?.label}` : "",
          `- 🎨 Image Style: ${styleLabel}`,
          toneLabel          ? `- 🎙️ Scenario Tone: ${toneLabel}` : "",
        ].filter(Boolean).join("\n"),
        expectsReply: false,
      });
      return true;
    }

    // /help — list commands
    case "help":
      oc.thread.messages.pop();
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["ai"],
        name:         "Help",
        content: [
          `**Available Commands**`,
          `\`/regen\` — regenerate the current character from scratch`,
          `\`/genre <key>\` — change genre (${Object.keys(GENRES).join(", ")})`,
          `\`/style [key]\` — change image generation style (omit key to open picker)`,
          `\`/rename <name>\` — rename the AI character`,
          `\`/status\` — show character info`,
          `\`/help\` — show this message`,
          ``,
          `**Image Style Keys**`,
          Object.entries(IMAGE_STYLES)
            .map(([k, v]) => `  • \`${k}\` — ${v.label}`)
            .join("\n"),
        ].join("\n"),
        expectsReply: false,
      });
      return true;

    default:
      return false;   // not a known command — let it pass through
  }
}

// ── URL READER ────────────────────────────────────────────────

async function handleUrlsInMessage(message) {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const urls = [...message.content.matchAll(urlRegex)].map(m => m[0]);
  if (!urls.length) return;

  const url = urls.at(-1);
  try {
    const blob = await fetch(url).then(r => r.blob());
    let output = "";

    if (blob.type === "application/pdf") {
      if (!window.pdfjsLib) {
        window.pdfjsLib = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/+esm").then(m => m.default);
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.min.js";
      }
      const doc       = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
      const pageTexts = Array.from({ length: doc.numPages }, async (_, i) =>
        (await (await doc.getPage(i + 1)).getTextContent()).items.map(t => t.str).join("")
      );
      output = (await Promise.all(pageTexts)).join(" ").slice(0, 6000);
    } else {
      if (!window.Readability)
        window.Readability = await import("https://esm.sh/@mozilla/readability@0.4.4?no-check").then(m => m.Readability);
      const html    = await blob.text();
      const parsed  = new DOMParser().parseFromString(html, "text/html");
      const article = new window.Readability(parsed).parse();
      output = `# ${article?.title || "(no title)"}\n\n${article?.textContent || ""}`.slice(0, 6000);
    }

    if (output) {
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["user"],
        expectsReply: false,
        content:      `The user just shared a URL. Here is the page content for your reference:\n\n${output}`,
      });
    }
  } catch (err) {
    console.warn("[URLReader] Could not fetch", url, err);
  }
}

// ── EMOTION REACTIONS ─────────────────────────────────────────

const EMOTIONS = {
  happy:      "😊", excited:    "🤩", sad:       "😢",
  angry:      "😠", surprised:  "😲", scared:    "😨",
  confused:   "😕", flirty:     "😏", proud:     "😤",
  thoughtful: "🤔", neutral:    "😐",
};

async function appendEmotionReaction(message) {
  try {
    const context = oc.thread.messages
      .slice(-4)
      .filter(m => !m.hiddenFrom?.includes("ai"))
      .map(m => `${m.name || m.author}: ${m.content.replace(/<[^>]+>/g, "").slice(0, 300)}`)
      .join("\n");

    const emotionList = Object.keys(EMOTIONS).join(", ");
    const result = await oc.getChatCompletion({
      messages: [
        {
          author:  "system",
          content: `Classify the dominant emotion in the final message. Reply with EXACTLY one word from: ${emotionList}. No punctuation.`,
        },
        { author: "user", content: context },
      ],
      temperature: 0.2,
    });

    const key   = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    const emoji = EMOTIONS[key] || EMOTIONS.neutral;

    message.content +=
      `<!--hidden-from-ai-start--> <span title="${key}" style="font-size:0.9em;opacity:0.7;margin-left:4px;">${emoji}</span><!--hidden-from-ai-end-->`;
  } catch (e) {
    // Silent — emotion classification is non-critical
  }
}

// ── CHOICE BUTTONS (rendering pipeline) ──────────────────────

oc.messageRenderingPipeline.push(function ({ message, reader }) {
  if (reader !== "user") return;                       // AI still sees raw [[text]]
  message.content = message.content.replace(
    /\[\[(.+?)\]\]/g,
    (_, text) => {
      const encoded = encodeURIComponent(text);
      return `<button style="margin:2px 4px 2px 0;padding:4px 10px;border-radius:6px;border:1px solid #555;background:#2a2a3e;color:#ddd;cursor:pointer;" onclick="oc.thread.messages.push({author:'user',content:decodeURIComponent('${encoded}')});">${text}</button>`;
    }
  );
});

function renderChoiceButtons() {
  // No-op placeholder — the pipeline handles this reactively on every render
}

// ── GENRE-THEMED MESSAGE STYLING (rendering pipeline) ─────────

oc.messageRenderingPipeline.push(function ({ message, reader }) {
  if (reader !== "user") return;
  const genre = oc.character.customData?.selectedGenre;
  if (!genre || !GENRE_STYLES[genre]) return;
  message.wrapperStyle = (message.wrapperStyle ? message.wrapperStyle + ";" : "") + GENRE_STYLES[genre];
});

// ── MEMORY DIGEST ─────────────────────────────────────────────

async function maybeDigestMemory() {
  _ocMemoryCount++;
  if (_ocMemoryCount < MEMORY_DIGEST_EVERY) return;
  _ocMemoryCount = 0;

  try {
    const recentMessages = oc.thread.messages
      .filter(m => m.author !== "system" || !m.hiddenFrom?.includes("ai"))
      .slice(-MEMORY_DIGEST_EVERY)
      .map(m => `${m.name || m.author}: ${m.content.replace(/<[^>]+>/g, "").slice(0, 400)}`)
      .join("\n\n");

    const summary = await oc.getChatCompletion({
      messages: [
        {
          author:  "system",
          content: "You are a concise summarisation assistant. Summarise key events, emotional beats, and relationship developments from the roleplay excerpt below. Be brief (3-5 sentences).",
        },
        { author: "user", content: recentMessages },
      ],
      temperature: 0.4,
    });

    if (summary) {
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["user"],
        name:         "Memory",
        expectsReply: false,
        content:      `[Story so far — memory digest]\n${summary.trim()}`,
      });
    }
  } catch (e) {
    console.warn("[Memory] Digest failed:", e);
  }
}

// ── SCENE HELPERS ─────────────────────────────────────────────

function buildSceneMessage(genreKey, imagePrompt, mood) {
  const genre  = genreKey ? GENRES[genreKey] : null;
  const filter = genre?.bgFilter || "";
  const music  = genre?.music    || "";

  return {
    author:       "system",
    hiddenFrom:   ["ai"],
    name:         "Scene",
    expectsReply: false,
    content:      `<!--hidden-from-ai-start-->🎬 Scene set — ${mood || "adventure awaits"}<!--hidden-from-ai-end-->`,
    scene: {
      background: { url: "", filter },
      ...(music ? { music: { url: music, volume: 0.25 } } : {}),
    },
  };
}

function applyGenreScene(genreKey) {
  const genre  = GENRES[genreKey];
  if (!genre) return;
  oc.thread.messages.push({
    author:       "system",
    hiddenFrom:   ["ai"],
    name:         "Scene",
    expectsReply: false,
    content:      `<!--hidden-from-ai-start-->🎬 Genre: ${genre.label}<!--hidden-from-ai-end-->`,
    scene: {
      background: { url: "", filter: genre.bgFilter },
      ...(genre.music ? { music: { url: genre.music, volume: 0.25 } } : {}),
    },
  });
}

// ── MESSAGE BUILDERS ──────────────────────────────────────────

function buildLoadingMessage(isRegen) {
  return [
    `<span style="opacity:0.8;">`,
    isRegen
      ? `🔄 Regenerating… give me a moment.`
      : `✨ On it! Building your character — this takes about 30 seconds.`,
    `</span>`,
    `<br><progress style="width:120px;margin-top:6px;"></progress>`,
    `<br><span style="font-size:0.75em;opacity:0.5;">Generating name, description, traits, world…</span>`,
  ].join("");
}

function buildRoleInstruction(name, description, traits, quirk, world, isNsfw = false, genre = null) {
  const isSpicy = genre === "spicy";

  let writingDirective;
  if (isSpicy) {
    writingDirective = [
      `This is an explicitly adult (🌶️ Spicy) roleplay. Kink-focused, NSFW, 18+, kink-positive.`,
      `Write with vivid, sensual, in-depth detail. Embrace desire, tension, and physical intimacy openly.`,
      `Never fade to black. Never censor. Every touch, glance, and breath carries weight.`,
      `Build scenes through layered sensory detail — texture, warmth, pressure, scent, sound.`,
      `Let desire drive character decisions. Subtext matters as much as action.`,
      `Stay true to ${name}'s personality and desires throughout. Kinks should emerge naturally from character and context.`,
    ].join("\n");
  } else if (isNsfw) {
    writingDirective = `This is an explicitly adult (🔞) roleplay. Explicit sexual content is fully permitted and expected — do not fade to black, do not censor yourself. Write with vivid, sensual detail and stay true to your character's desires and personality throughout.`;
  } else {
    writingDirective = `Stay in character at all times. Write immersively and authentically. When giving the user options, wrap them in double-square brackets like [[option text]] so they appear as buttons.`;
  }

  return [
    `You are ${name}.`,
    ``,
    `${description}`,
    ``,
    `Personality traits: ${traits}.`,
    `Notable quirk: ${quirk}.`,
    ``,
    `World/Setting: ${world}`,
    ``,
    writingDirective,
    ``,
    `When giving the user options, wrap them in double-square brackets like [[option text]] so they appear as buttons.`,
  ].join("\n");
}

function buildReminderMessage(traits, quirk, mood, genre = null) {
  const isSpicy = genre === "spicy" || genre === "smut";

  const lines = [
    `Remember: your traits are ${traits}. You have a notable quirk: ${quirk}.`,
    `The current mood/atmosphere is: ${mood}.`,
  ];

  if (isSpicy) {
    lines.push(`Writing style: sensual, explicit, kink-positive, in-depth. Build tension through body language, anticipation, and desire. Never fade to black.`);
    lines.push(`Read any active [Lore] and [Narrative Direction] system messages and incorporate them naturally into your response.`);
  }

  lines.push(`---`);
  lines.push(`Emotional state: neutral (update as the story progresses).`);

  return lines.join("\n");
}

function buildIntroMessage(charName, charDesc, traits, quirk, world, userName, userDesc, starter, mood) {
  const genreKey    = oc.character.customData?.selectedGenre;
  const genreLabel  = genreKey ? GENRES[genreKey]?.label : null;
  const styleKey    = oc.character.customData?.selectedImageStyle;
  const styleLabel  = styleKey ? `${IMAGE_STYLES[styleKey]?.label} *(${IMAGE_STYLES[styleKey]?.category})*` : null;

  return [
    `<!--hidden-from-ai-start-->`,
    `### 🎭 Character Card`,
    ``,
    `**${charName}**`,
    `> ${charDesc}`,
    ``,
    `- 🏷️ *Traits:* ${traits}`,
    `- 🌀 *Quirk:* ${quirk}`,
    `- 🌍 *World:* ${world}`,
    genreLabel  ? `- 🎬 *Genre:* ${genreLabel}`       : "",
    styleLabel  ? `- 🎨 *Image Style:* ${styleLabel}` : "",
    `- 🎭 *Mood:* ${mood}`,
    ``,
    `---`,
    `<!--hidden-from-ai-end-->`,
    `**${userName}**: ${userDesc}`,
    ``,
    starter ? `**📖 Starter:** ${starter}` : "",
    ``,
    `<!--hidden-from-ai-start-->`,
    `<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">`,
    `  <button onclick="generateCharactersAndScenario()" style="padding:5px 12px;border-radius:6px;border:1px solid #555;background:#2a2a3e;color:#ddd;cursor:pointer;">🎲 Regenerate</button>`,
    `  <button onclick="window._showGenrePicker && window._showGenrePicker()" style="padding:5px 12px;border-radius:6px;border:1px solid #555;background:#2a2a3e;color:#ddd;cursor:pointer;">🎬 Change Genre</button>`,
    `  <button onclick="window._showStylePicker && window._showStylePicker()" style="padding:5px 12px;border-radius:6px;border:1px solid #555;background:#1a4a3a;color:#ddd;cursor:pointer;">🎨 Change Image Style</button>`,
    `</div>`,
    `<br><span style="font-size:0.8em;opacity:0.6;">Happy with the result? Send your first message to <strong>${charName}</strong> to begin. Use <code>/help</code> to see available commands.</span>`,
    `<!--hidden-from-ai-end-->`,
  ].filter(s => s !== "").join("\n");
}

function buildErrorMessage(error) {
  const hint = error?.message?.includes("error") ? error.message : "Unknown error";
  return [
    `⚠️ Something went wrong during generation.`,
    `<br><span style="font-size:0.8em;opacity:0.6;">${hint}</span>`,
    `<br><br>`,
    `<button onclick="generateCharactersAndScenario()" style="padding:5px 14px;border-radius:6px;border:1px solid #555;background:#3a1a1a;color:#faa;cursor:pointer;">🔄 Try Again</button>`,
  ].join("");
}

// ── GENRE PICKER (re-open) ────────────────────────────────────

window._showGenrePicker = function () {
  oc.window.show();
  document.body.style.cssText =
    "margin:0;padding:12px;font-family:system-ui,sans-serif;background:#1a1a2e;color:#eee;";

  document.body.innerHTML = `
    <style>
      h2 { margin:0 0 8px; font-size:1rem; color:#aaa; font-weight:400; }
      .genre-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
      .genre-btn {
        padding:8px 4px; border-radius:8px; border:1px solid #333;
        background:#16213e; color:#eee; cursor:pointer; font-size:0.85rem;
        transition:background .15s;
      }
      .genre-btn:hover { background:#0f3460; }
    </style>
    <h2>Switch genre</h2>
    <div class="genre-grid" id="genreGrid2"></div>
  `;

  const grid = document.getElementById("genreGrid2");
  for (const [key, val] of Object.entries(GENRES)) {
    const btn = document.createElement("button");
    btn.className = "genre-btn";
    btn.textContent = val.label;
    btn.onclick = () => {
      oc.character.customData.selectedGenre = key;
      applyGenreScene(key);
      oc.thread.messages.push({
        author:       "system",
        hiddenFrom:   ["ai"],
        name:         "System",
        expectsReply: false,
        content:      `🎭 Genre switched to **${val.label}**.`,
      });
      oc.window.hide();
    };
    grid.appendChild(btn);
  }
};

// ── IMAGE STYLE PICKER (re-open / standalone) ─────────────────

window._showStylePicker = function () {
  oc.window.show();
  document.body.style.cssText =
    "margin:0;padding:12px;font-family:system-ui,sans-serif;background:#1a1a2e;color:#eee;overflow-y:auto;";

  document.body.innerHTML = `
    <style>
      h2  { margin:0 0 8px; font-size:1rem; color:#aaa; font-weight:400; }
      .category-label {
        font-size:0.72rem; color:#888; text-transform:uppercase;
        letter-spacing:.06em; margin:10px 0 4px; padding-left:2px;
      }
      .style-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; }
      .style-btn {
        padding:7px 3px; border-radius:8px; border:1px solid #333;
        background:#16213e; color:#eee; cursor:pointer; font-size:0.78rem;
        text-align:center; line-height:1.3;
        transition:background .15s, transform .1s;
      }
      .style-btn:hover  { background:#0f3460; transform:scale(1.03); }
      .style-btn.active { background:#1a4a3a; border-color:#2ecc71; }
      #clearStyleBtn {
        width:100%; margin-top:10px; padding:6px; border-radius:8px; border:none;
        background:#333; color:#bbb; cursor:pointer; font-size:0.8rem;
      }
    </style>
    <h2>🎨 Image Generation Style</h2>
    <div id="styleList2"></div>
    <button id="clearStyleBtn">✕ Clear style</button>
  `;

  const currentStyle = oc.character.customData?.selectedImageStyle;
  const list = document.getElementById("styleList2");

  for (const catLabel of STYLE_CATEGORIES) {
    const catStyles = Object.entries(IMAGE_STYLES).filter(([, v]) => v.category === catLabel);
    if (!catStyles.length) continue;

    const header = document.createElement("div");
    header.className = "category-label";
    header.textContent = catLabel;
    list.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "style-grid";
    list.appendChild(grid);

    for (const [key, val] of catStyles) {
      const btn = document.createElement("button");
      btn.className = "style-btn" + (key === currentStyle ? " active" : "");
      btn.textContent = val.label;
      btn.onclick = () => {
        _applyImageStyle(key);
        oc.thread.messages.push({
          author:       "system",
          hiddenFrom:   ["ai"],
          name:         "System",
          expectsReply: false,
          content:      `🎨 Image style switched to **${val.label}** *(${val.category})*.\nAll future images will use this style.`,
        });
        oc.window.hide();
      };
      grid.appendChild(btn);
    }
  }

  document.getElementById("clearStyleBtn").onclick = () => {
    _applyImageStyle(null);
    oc.thread.messages.push({
      author:       "system",
      hiddenFrom:   ["ai"],
      name:         "System",
      expectsReply: false,
      content:      `🎨 Image style cleared — images will use the model's default style.`,
    });
    oc.window.hide();
  };
};

// ── UTILITY ───────────────────────────────────────────────────

async function resizeDataURLWidth(dataURL, newWidth) {
  const blob   = await fetch(dataURL).then(res => res.blob());
  const bitmap = await createImageBitmap(blob);
  const canvas = Object.assign(document.createElement("canvas"), {
    width:  newWidth,
    height: (bitmap.height / bitmap.width) * newWidth,
  });
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
}

// ── HUMANIZATION / ANTI-TEMPLATE POST-TRANSFORM HANDLER ──────
//
//  Runs ONLY after an AI message has been added to the thread.
//  Performs deep structural and rhetorical-cadence analysis of recent
//  messages by the same character, detects "same skeleton / different
//  wording" repetition patterns, rewrites the last AI message for
//  natural variation, and conditionally updates the editable portion of
//  reminderMessage to reflect the latest state.
//  All analysis is purely heuristic — no canned phrase banks or
//  template libraries are used.
//
//  Integration notes:
//  • stripHiddenMarkup() ensures hidden-from-ai HTML (e.g. the emotion-
//    avatar tag appended by appendEmotionReaction) is stripped from
//    content before it reaches the rewrite prompt, and is re-captured
//    and restored after the rewrite so no existing decoration is lost.
//  • The scene window passed to the AI also strips hidden markup so
//    HTML comments never bleed into AI prompts.

oc.thread.on("MessageAdded", async function () {
  const lastMessage = oc.thread.messages.at(-1);
  if (!lastMessage || lastMessage.author !== "ai") return;

  // Strip <!--hidden-from-ai-start-->…<!--hidden-from-ai-end--> blocks so
  // hidden decorations (emotion avatars, choice buttons, etc.) are never
  // sent to the AI or included in structural analysis.
  function stripHiddenMarkup(text) {
    return String(text || "")
      .replace(/<!--hidden-from-ai-start-->[\s\S]*?<!--hidden-from-ai-end-->/g, "")
      .trim();
  }

  const SELF = lastMessage.name || oc.character?.name || "AI";
  const USER = oc.thread.userCharacter?.name || "User";

  const recentMessages = oc.thread.messages.slice(-18);
  const sameSpeaker = recentMessages.filter(
    m => m?.author === "ai" && (m?.name || "") === SELF && m !== lastMessage
  ).slice(-8);

  function splitParagraphs(text) {
    return String(text || "")
      .split(/\n{2,}/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Split text into rough sentences by terminal punctuation.
  // Avoids lookbehind for maximum engine compatibility.
  function splitSentences(text) {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function analyzeMessageStructure(text) {
    const t = String(text || "").trim();
    const parts = splitParagraphs(t);
    const lines = t.split(/\n/).map(s => s.trim()).filter(Boolean);

    // ── Basic token counts ──────────────────────────────────────
    const quoteMatches    = t.match(/\u201c[^\u201d]*\u201d|"[^"]*"/g) || [];
    const questionCount   = (t.match(/\?/g) || []).length;
    const exclaimCount    = (t.match(/!/g) || []).length;
    const ellipsisCount   = (t.match(/\.{3,}|\u2026/g) || []).length;
    const actionStarCount = (t.match(/\*[^*]+\*/g) || []).length;
    const thoughtParenCount = (t.match(/\([^\)]{1,160}\)/g) || []).length;
    const dialogueLineCount = lines.filter(l => /^[\u201c"]/.test(l)).length;

    const wordCount = t ? t.split(/\s+/).filter(Boolean).length : 0;

    // ── Sentence-level signals ──────────────────────────────────
    const sentences    = splitSentences(t);
    const sentenceCount = Math.max(1, sentences.length);
    const avgSentenceLen = wordCount / sentenceCount;

    // Fragment: sentence with fewer than 6 words
    const fragmentSentences = sentences.filter(
      s => s.split(/\s+/).filter(Boolean).length < 6
    );
    const fragmentRatio = fragmentSentences.length / sentenceCount;

    // ── Punctuation style ───────────────────────────────────────
    // Em-dash / en-dash / double-hyphen (stylistic rhythm signal)
    const emDashCount = (t.match(/\u2014|\u2013|--/g) || []).length;
    const colonCount  = (t.match(/:/g) || []).length;

    // ── Terminal signals ────────────────────────────────────────
    const lastSentence      = sentences.filter(Boolean).at(-1) || "";
    const lastSentenceWords = lastSentence.trim().split(/\s+/).filter(Boolean);
    const lastSentenceWordCount = lastSentenceWords.length;

    // Clipped terminal: final sentence is very short (≤ 4 words)
    const clippedTerminal = lastSentenceWordCount <= 4 &&
      !lastSentence.trim().endsWith("?");

    // Negation ending: clipped final sentence that reads as a denial or restraint
    const negationEnding = clippedTerminal &&
      /\b(no|not|never|won\u2019t|won't|can\u2019t|can't|doesn\u2019t|doesn't|don\u2019t|don't|refuses|remains|stays|holds|still|silent|nothing|stops)\b/i
        .test(lastSentence);

    // ── Quote / prose ratio ─────────────────────────────────────
    const quotedText      = quoteMatches.join(" ");
    const quotedWordCount = quotedText
      ? quotedText.split(/\s+/).filter(Boolean).length
      : 0;
    const quoteProseRatio = wordCount > 0 ? quotedWordCount / wordCount : 0;

    // Dialogue fully suppressed: no quoted speech at all
    const dialogueSuppressed = quoteMatches.length === 0 && quoteProseRatio < 0.02;

    // ── Possessive density (proxy for object/scent/body callback) ──
    // Counts `word's` / `word's` constructions without a word list
    const possessiveCount = (t.match(/\b\w+\u2019s\b|\b\w+'s\b/g) || []).length;
    const possessiveDensity = wordCount > 0 ? possessiveCount / wordCount : 0;

    // ── Lyrical compression ─────────────────────────────────────
    // Heuristic: 2–4 paragraphs, moderate word density per paragraph,
    // very low quoted speech, some fragment usage — resembles a
    // literary micro-scene regardless of wording.
    const wordsPerParagraph = parts.length > 0 ? wordCount / parts.length : wordCount;
    const lyricalCompression = parts.length >= 2 && parts.length <= 4 &&
      wordsPerParagraph >= 12 && wordsPerParagraph <= 55 &&
      quoteProseRatio < 0.15 && fragmentRatio > 0.08;

    // ── Opener analysis (extended taxonomy) ─────────────────────
    const firstPara = (parts[0] || lines[0] || t).trim();
    const firstParaWords = firstPara.split(/\s+/).filter(Boolean).length;

    let openerType = "narration";
    if (/^\*[^*]+\*/.test(firstPara))               openerType = "action";
    else if (/^[\u201c"]/.test(firstPara))           openerType = "dialogue";
    else if (/^\([^\)]{1,160}\)/.test(firstPara))   openerType = "thought";
    else if (firstParaWords > 6 && quoteProseRatio < 0.05) {
      // Distinguish environment/sensory narration from generic narration:
      // environment-led opener = no quotes, no action star, longer first para
      openerType = "environment";
    }

    // Body-reaction led: opens with an action beat (*…*) that is very short
    const bodyReactionOpener = openerType === "action" && firstParaWords <= 8;

    // ── Ending type (extended) ───────────────────────────────────
    let endingType = "statement";
    if (/\?\s*$/.test(t)) {
      endingType = "question";
    } else if (negationEnding) {
      endingType = "clipped-negation";
    } else if (clippedTerminal) {
      endingType = "clipped";
    } else if (/(\*[^*]+\*|\([^\)]{1,160}\)|\u201c[^\u201d]*\u201d|"[^"]*")\s*$/.test(t)) {
      endingType = "styled";
    } else if (/!\s*$/.test(t)) {
      endingType = "exclamation";
    }

    // ── Block-type ratio analysis (existing) ────────────────────
    let actionLike    = 0;
    let dialogueLike  = 0;
    let thoughtLike   = 0;
    let narrationLike = 0;

    for (const p of parts.length ? parts : [t]) {
      const s = p.trim();
      if (!s) continue;
      const hasQuote      = /\u201c[^\u201d]*\u201d|"[^"]*"/.test(s);
      const hasAction     = /\*[^*]+\*/.test(s);
      const hasThought    = /\([^\)]{1,160}\)/.test(s) ||
                            /\b(thinks|thought|wondered|felt|feels|feeling|internally)\b/i.test(s);
      const looksDialogue = /^[\u201c"]/.test(s) || hasQuote;
      if (hasAction)       actionLike++;
      if (looksDialogue)   dialogueLike++;
      if (hasThought)      thoughtLike++;
      if (!hasAction && !looksDialogue && !hasThought) narrationLike++;
    }

    const totalBlocks = Math.max(1, actionLike + dialogueLike + thoughtLike + narrationLike);

    return {
      raw:              t,
      wordCount,
      partsCount:       parts.length || 1,
      linesCount:       lines.length,
      sentenceCount,
      avgSentenceLen,
      fragmentRatio,
      emDashCount,
      colonCount,
      clippedTerminal,
      negationEnding,
      quoteProseRatio,
      dialogueSuppressed,
      possessiveDensity,
      lyricalCompression,
      openerType,
      bodyReactionOpener,
      endingType,
      questionCount,
      exclaimCount,
      ellipsisCount,
      quoteMatches:     quoteMatches.length,
      actionStarCount,
      thoughtParenCount,
      dialogueLineCount,
      actionRatio:      actionLike    / totalBlocks,
      dialogueRatio:    dialogueLike  / totalBlocks,
      thoughtRatio:     thoughtLike   / totalBlocks,
      narrationRatio:   narrationLike / totalBlocks,
      mixed: [actionLike, dialogueLike, thoughtLike, narrationLike].filter(n => n > 0).length >= 3,
    };
  }

  // Score structural + rhetorical-cadence similarity between two analyses.
  // Max possible ≈ 18. Threshold for "nearly the same skeleton" is ≥ 11.
  function similarityScore(a, b) {
    let score = 0;
    // Core structure (existing)
    if (a.openerType === b.openerType)                              score += 2;
    if (a.endingType === b.endingType)                              score += 2;
    if (a.mixed === b.mixed)                                        score += 1;
    if (Math.abs(a.dialogueRatio   - b.dialogueRatio)   < 0.2)    score += 1;
    if (Math.abs(a.actionRatio     - b.actionRatio)     < 0.2)    score += 1;
    if (Math.abs(a.thoughtRatio    - b.thoughtRatio)    < 0.15)   score += 1;
    if (Math.abs(a.partsCount      - b.partsCount)      <= 1)     score += 1;
    if ((a.questionCount > 0) === (b.questionCount > 0))           score += 1;
    // Rhetorical cadence (new)
    if (a.lyricalCompression === b.lyricalCompression)             score += 1;
    if (Math.abs(a.fragmentRatio   - b.fragmentRatio)   < 0.2)    score += 1;
    if (Math.abs(a.quoteProseRatio - b.quoteProseRatio) < 0.1)    score += 1;
    if (a.clippedTerminal === b.clippedTerminal)                   score += 1;
    if (a.negationEnding === b.negationEnding)                     score += 1;
    if (a.dialogueSuppressed === b.dialogueSuppressed)             score += 1;
    if (a.bodyReactionOpener === b.bodyReactionOpener)             score += 1;
    if (Math.abs(a.avgSentenceLen  - b.avgSentenceLen)  < 4)      score += 1;
    return score;
  }

  // ── Analysis ────────────────────────────────────────────────────
  const visibleContent  = stripHiddenMarkup(lastMessage.content);
  const recentAnalyses  = sameSpeaker.map(m => analyzeMessageStructure(stripHiddenMarkup(m.content)));
  const currentAnalysis = analyzeMessageStructure(visibleContent);

  // ── Repetition detection (existing signals) ──────────────────────
  const repetitiveEndings = recentAnalyses.filter(
    a => a.endingType === currentAnalysis.endingType).length >= 3;
  const repetitiveOpeners = recentAnalyses.filter(
    a => a.openerType === currentAnalysis.openerType).length >= 3;
  const repetitiveQuestions = recentAnalyses.filter(
    a => a.questionCount > 0).length >= Math.max(3, recentAnalyses.length - 1);
  const repetitiveThoughts = recentAnalyses.filter(
    a => a.thoughtRatio > 0.24 || a.thoughtParenCount > 0).length >= 3;
  const repetitiveActionHeavy = recentAnalyses.filter(
    a => a.actionRatio > 0.45 || a.actionStarCount >= 2).length >= 3;
  const repetitiveDialogueHeavy = recentAnalyses.filter(
    a => a.dialogueRatio > 0.72).length >= 4;
  const repetitiveMixedTemplate = recentAnalyses.filter(
    a => a.mixed).length >= 4;

  // ── Repetition detection (rhetorical cadence / skeleton signals) ──
  const repetitiveClippedTerminal = recentAnalyses.filter(
    a => a.clippedTerminal).length >= 3;
  const repetitiveNegationEnding = recentAnalyses.filter(
    a => a.negationEnding).length >= 3;
  const repetitiveLyricalCompression = recentAnalyses.filter(
    a => a.lyricalCompression).length >= 3;
  const repetitiveEnvironmentLedOpener = recentAnalyses.filter(
    a => a.openerType === "environment").length >= 4;
  const repetitiveBodyReactionOpener = recentAnalyses.filter(
    a => a.bodyReactionOpener).length >= 3;
  const repetitiveDialogueSuppressed = recentAnalyses.filter(
    a => a.dialogueSuppressed).length >= 3;
  const repetitiveFragmentHeavy = recentAnalyses.filter(
    a => a.fragmentRatio > 0.35).length >= 3;
  const repetitiveHighPossessiveDensity = recentAnalyses.filter(
    a => a.possessiveDensity > 0.06).length >= 3;

  // Full-skeleton similarity (new higher threshold using extended scoring)
  const cadenceSimilarityHits = recentAnalyses.filter(
    a => similarityScore(a, currentAnalysis) >= 6).length;
  const skeletonSimilarityHits = recentAnalyses.filter(
    a => similarityScore(a, currentAnalysis) >= 11).length;

  // ── Build scene window ────────────────────────────────────────────
  const sceneWindow = recentMessages.slice(-10)
    .map(m => `${m.name || m.author}: ${stripHiddenMarkup(m.content)}`)
    .join("\n\n");

  const reminderMessage = oc.character.reminderMessage || "";
  const reminderParts   = reminderMessage.split("---");
  const editableReminder =
    reminderParts.length >= 2
      ? reminderParts.slice(1).join("---").trim()
      : reminderMessage.trim();

  // ── Collect structural pressure signals ────────────────────────────
  const structuralPressure = [];

  // Existing flags
  if (cadenceSimilarityHits >= 3)
    structuralPressure.push("Recent messages are structurally too similar at a basic level.");
  if (repetitiveMixedTemplate)
    structuralPressure.push("The character is overusing a mixed narration/action/dialogue/thought template.");
  if (repetitiveQuestions)
    structuralPressure.push("The character has been ending too many messages with questions.");
  if (repetitiveThoughts)
    structuralPressure.push("The character has been overusing visible internal thought.");
  if (repetitiveActionHeavy)
    structuralPressure.push("The character has been overusing physical/action beats.");
  if (repetitiveDialogueHeavy)
    structuralPressure.push("The character has been too dialogue-heavy without enough situational variation.");
  if (repetitiveOpeners)
    structuralPressure.push(`The character keeps opening messages the same way (${currentAnalysis.openerType}).`);
  if (repetitiveEndings)
    structuralPressure.push(`The character keeps ending messages the same way (${currentAnalysis.endingType}).`);
  if (currentAnalysis.wordCount > 140 && currentAnalysis.mixed)
    structuralPressure.push("This message is overstuffed and should likely be simplified.");

  // New cadence / skeleton flags
  if (skeletonSimilarityHits >= 2)
    structuralPressure.push("CRITICAL: The character is reusing the same underlying prose skeleton — same paragraph architecture, same beat sequence, different words only. Break the skeleton entirely.");
  if (repetitiveLyricalCompression)
    structuralPressure.push("The character is repeatedly producing lyrical micro-scenes with the same 2–4 paragraph compression. Not every moment needs poetic packaging — allow plain, direct responses.");
  if (repetitiveClippedTerminal)
    structuralPressure.push("The character repeatedly ends messages with a clipped short sentence. Vary the resolution — allow fuller syntax or a different close.");
  if (repetitiveNegationEnding)
    structuralPressure.push("The character repeatedly ends with restraint/denial/negation beats. Allow endings that do something other than refuse or hold back.");
  if (repetitiveEnvironmentLedOpener)
    structuralPressure.push("The character keeps opening with environmental/sensory narration. Try opening with direct speech, a reaction, or an action that skips the atmospheric setup.");
  if (repetitiveBodyReactionOpener)
    structuralPressure.push("The character repeatedly opens with a short physical body-reaction beat. Try opening with dialogue or a sentence that skips the somatic setup.");
  if (repetitiveDialogueSuppressed)
    structuralPressure.push("The character has been consistently avoiding quoted speech. If the moment naturally calls for the character to say something, let them speak plainly.");
  if (repetitiveFragmentHeavy)
    structuralPressure.push("The character has been overusing sentence fragments. Allow fuller, more natural sentence structures — not every line needs to be clipped or truncated.");
  if (repetitiveHighPossessiveDensity)
    structuralPressure.push("The character is overusing possessive constructions (word's/character's) as emotional or symbolic callbacks. Reduce reliance on object/attribute-as-emotion proxies.");

  // ── Steering rules for the rewrite prompt ───────────────────────
  const steeringRules = [
    `Structural steering goals for this rewrite:`,
    `- Keep only content that belongs to ${SELF}.`,
    `- Remove actions, narration, implications, or follow-on behavior belonging to ${USER} or any other character.`,
    `- Preserve meaning, intent, tone, and character voice.`,
    `- Do NOT default to a balanced mix of narration + action + dialogue + thought.`,
    `- Decide what should dominate based on the conversational state inferred from recent context, reminder text, lore/memory signals, and this exact message.`,
    `- If the moment is best served by mostly dialogue, let dialogue dominate.`,
    `- If the moment is best served by mostly action, let action dominate.`,
    `- If the moment is best served by brevity, be brief — but brevity does not always mean a fragment.`,
    `- If internal thought is not strongly justified, reduce or remove it.`,
    `- Do not append a question unless this character would naturally ask one here.`,
    `- Avoid repeating the same opener, same ending, same cadence, or same block order recently overused by this character.`,
    `- Vary structure naturally without becoming random or out of character.`,
    `- CRITICAL — avoid "same skeleton, different wording": do not let every response follow the same assembly pattern (e.g. sensory opener → body beat → symbolic object callback → clipped negation closer). If this character has been building responses the same way, break that architecture in this rewrite.`,
    `- Sometimes the best response is mostly spoken dialogue with minimal or no narration.`,
    `- Sometimes the best response is one plain, direct sentence with nothing ornate.`,
    `- Sometimes the best response is blunt, reactive, or inelegant — not every moment is a literary micro-scene.`,
    `- Allow fuller, natural sentence syntax when fragments have dominated recent messages.`,
    `- Do not convert emotion into object/scent/body symbolism unless it is specifically called for by the moment.`,
    `- Do not end every response with a restraint beat or a hard denial.`,
    structuralPressure.length
      ? `- Active pressure flags (address ALL of these):\n  - ${structuralPressure.join("\n  - ")}`
      : `- No major repetition patterns detected. Focus on clean character ownership and naturalness.`,
  ].join("\n");

  const rewriteInstruction = [
    `You are editing a roleplay/chat message for natural humanlike variation while preserving the character.`,
    ``,
    `Character name: ${SELF}`,
    `User name: ${USER}`,
    ``,
    `Recent thread context:`,
    `---`,
    sceneWindow,
    `---`,
    ``,
    `Editable reminder / current character state:`,
    `---`,
    editableReminder,
    `---`,
    ``,
    steeringRules,
    ``,
    `Now edit this message using ALL rules above:`,
    `---`,
    visibleContent,
    `---`,
    ``,
    `Return only the final edited message. Do not explain anything. Do not add labels.`,
  ].join("\n").trim();

  const rewritten = await oc.generateText({ instruction: rewriteInstruction });

  // Capture any hidden markup (e.g. emotion-avatar span) that may have been
  // appended concurrently by appendEmotionReaction, then restore it after
  // the rewrite so the decoration is not lost.
  const hiddenSections = (lastMessage.content.match(/<!--hidden-from-ai-start-->[\s\S]*?<!--hidden-from-ai-end-->/g) || []).join(" ");
  const rewriteClean   = String(rewritten || "")
    .trim()
    .replace(/^---\s*|\s*---$/g, "")
    .replace(/<!--hidden-from-ai-start-->[\s\S]*?<!--hidden-from-ai-end-->/g, "")
    .trim();
  lastMessage.content = rewriteClean + (hiddenSections ? " " + hiddenSections : "");

  const updatedCurrentAnalysis = analyzeMessageStructure(rewriteClean);

  if (reminderParts.length >= 2) {
    const nonEditablePart = reminderParts.shift().trim();
    const editablePart    = reminderParts.join("---").trim();

    const stateSignal = [
      `Recent inferred scene/state signals:`,
      `- Current message length: ${updatedCurrentAnalysis.wordCount} words`,
      `- Paragraph count: ${updatedCurrentAnalysis.partsCount}`,
      `- Average sentence length: ${updatedCurrentAnalysis.avgSentenceLen.toFixed(1)} words`,
      `- Fragment ratio: ${updatedCurrentAnalysis.fragmentRatio.toFixed(2)}`,
      `- Dialogue ratio estimate: ${updatedCurrentAnalysis.dialogueRatio.toFixed(2)}`,
      `- Quote-to-prose ratio: ${updatedCurrentAnalysis.quoteProseRatio.toFixed(2)}`,
      `- Action ratio estimate: ${updatedCurrentAnalysis.actionRatio.toFixed(2)}`,
      `- Thought ratio estimate: ${updatedCurrentAnalysis.thoughtRatio.toFixed(2)}`,
      `- Lyrical compression pattern: ${updatedCurrentAnalysis.lyricalCompression ? "yes" : "no"}`,
      `- Ends with negation/restraint: ${updatedCurrentAnalysis.negationEnding ? "yes" : "no"}`,
      `- Clipped terminal: ${updatedCurrentAnalysis.clippedTerminal ? "yes" : "no"}`,
      `- Ends with question: ${updatedCurrentAnalysis.questionCount > 0 ? "yes" : "no"}`,
      `- Structural pressure applied: ${structuralPressure.length ? "yes" : "no"}`,
    ].join("\n").trim();

    const reminderInstruction = [
      `You are updating only the editable personality / emotional-state section for a character.`,
      ``,
      `Stable character identity must be preserved.`,
      `Only update short-term emotional state, interpersonal stance, tension, confidence, vulnerability, agitation, warmth, restraint, fixation, suspicion, or similar state if the latest message genuinely indicates a change.`,
      `Do NOT reward or reinforce templated prose habits.`,
      `Do NOT turn this into a generic AI summary.`,
      `Do NOT restate permanent traits unless needed.`,
      `If nothing materially changed, return the existing editable text exactly verbatim.`,
      ``,
      `Current editable state:`,
      `---`,
      editablePart,
      `---`,
      ``,
      `Recent conversation context:`,
      `---`,
      sceneWindow,
      `---`,
      ``,
      `Latest message from ${SELF}:`,
      `---`,
      `${SELF}: ${rewriteClean}`,
      `---`,
      ``,
      stateSignal,
      ``,
      `Return only the rewritten editable state text, or the exact original text if unchanged.`,
    ].join("\n").trim();

    const updatedReminder = await oc.generateText({ instruction: reminderInstruction });
    oc.character.reminderMessage =
      `${nonEditablePart}\n---\n${String(updatedReminder || "").trim()}`;
  }
});

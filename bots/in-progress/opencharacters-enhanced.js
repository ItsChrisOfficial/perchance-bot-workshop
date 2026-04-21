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

const IMAGE_STYLES = {

  // ── Photorealistic ──────────────────────────────────────────
  photo_hyper: {
    label:    "📷 Hyperrealistic",
    category: "📷 Photorealistic",
    prepend:  "hyperrealistic photography, 8K DSLR, ultra-sharp focus, photorealistic,",
    append:   ", RAW photo, professional lighting, subtle bokeh, high-fidelity detail",
  },
  photo_cinematic: {
    label:    "🎞️ Cinematic Photo",
    category: "📷 Photorealistic",
    prepend:  "cinematic photograph, movie still, 35mm film, anamorphic lens,",
    append:   ", film grain, shallow depth of field, cinematic color grade, golden hour",
  },
  photo_documentary: {
    label:    "📸 Documentary",
    category: "📷 Photorealistic",
    prepend:  "documentary photography, candid shot, natural available lighting,",
    append:   ", authentic atmosphere, journalistic style, gritty realism",
  },

  // ── Anime / Illustrated ─────────────────────────────────────
  anime_modern: {
    label:    "🌸 Modern Anime",
    category: "🌸 Anime / Illustrated",
    prepend:  "modern anime art, cel-shaded, studio-quality anime illustration,",
    append:   ", vibrant colors, expressive eyes, clean linework, detailed anime background",
  },
  anime_manga: {
    label:    "📖 Manga",
    category: "🌸 Anime / Illustrated",
    prepend:  "manga art style, black and white ink illustration, screen tones,",
    append:   ", dynamic linework, hatching shadows, manga panel composition",
  },
  anime_webtoon: {
    label:    "🎨 Webtoon / Comic",
    category: "🌸 Anime / Illustrated",
    prepend:  "Korean webtoon art, manhwa illustration, digital comic style,",
    append:   ", flat vibrant colors, clean outlines, soft shading, webtoon aesthetic",
  },

  // ── Painterly ───────────────────────────────────────────────
  paint_oil: {
    label:    "🖼️ Oil Painting",
    category: "🖌️ Painterly",
    prepend:  "classical oil painting, old masters technique, rich impasto brushwork,",
    append:   ", museum-quality fine art, deep rich colors, painted canvas texture",
  },
  paint_watercolor: {
    label:    "💧 Watercolor",
    category: "🖌️ Painterly",
    prepend:  "watercolor illustration, delicate wet-on-wet washes, soft edges,",
    append:   ", flowing pigments, cold-press paper texture, luminous watercolor painting",
  },
  paint_impressionist: {
    label:    "🌊 Impressionist",
    category: "🖌️ Painterly",
    prepend:  "impressionist painting, expressive broken brushstrokes, plein-air feel,",
    append:   ", dappled light, post-impressionist color palette, painterly atmosphere",
  },

  // ── Filmish ─────────────────────────────────────────────────
  film_noir: {
    label:    "🎬 Film Noir",
    category: "🎬 Filmish",
    prepend:  "film noir, dramatic black and white photography, hard chiaroscuro shadows,",
    append:   ", venetian blind light streaks, 1940s aesthetic, smoky moody atmosphere",
  },
  film_retro: {
    label:    "📼 Retro 80s",
    category: "🎬 Filmish",
    prepend:  "retro 1980s film aesthetic, analog VHS warmth, vintage cinema look,",
    append:   ", light leak, faded highlights, warm teal-orange grade, 80s movie nostalgia",
  },
  film_wes: {
    label:    "🟡 Wes Anderson",
    category: "🎬 Filmish",
    prepend:  "Wes Anderson film style, perfectly symmetrical composition, muted pastel palette,",
    append:   ", flat 2-point perspective, whimsical storybook aesthetic, quirky color grade",
  },

  // ── Ultra-Stylized ───────────────────────────────────────────
  stylized_cyberpunk: {
    label:    "🔮 Neon Cyberpunk",
    category: "✨ Ultra-Stylized",
    prepend:  "cyberpunk concept art, neon-drenched futuristic cityscape, electric glow,",
    append:   ", glowing holographic elements, rain-slicked streets, ultra-detailed sci-fi dystopia",
  },
  stylized_darkfantasy: {
    label:    "🐉 Dark Fantasy Art",
    category: "✨ Ultra-Stylized",
    prepend:  "dark fantasy concept art, epic dramatic illustration, ominous atmosphere,",
    append:   ", intricate magical details, brooding color palette, fantasy art masterpiece",
  },
  stylized_vaporwave: {
    label:    "🌈 Vaporwave",
    category: "✨ Ultra-Stylized",
    prepend:  "vaporwave aesthetic, synthwave art, lo-fi retro-futuristic,",
    append:   ", pastel purple magenta teal gradient, glitch accents, 90s nostalgia, dreamy surreal",
  },
  nsfw_stylized: {
    label:    "🔥 Glamour Fantasy Art",
    category: "✨ Ultra-Stylized",
    prepend:  "glamour fantasy concept art, sensual atmospheric illustration, high-detail digital painting, seductive mood,",
    append:   ", dramatic rim lighting, rich jewel-tone palette, cinematic adult fantasy art, masterpiece quality",
    nsfw:     true,
  },

  // ── NSFW — Photorealistic ────────────────────────────────────
  nsfw_photo: {
    label:    "🛋️ Boudoir Photography",
    category: "📷 Photorealistic",
    prepend:  "professional boudoir photography, intimate portrait session, 85mm prime lens, studio softbox lighting,",
    append:   ", elegant sensual composition, silky skin texture, warm ambient light, high-resolution intimate photography",
    nsfw:     true,
  },

  // ── NSFW — Illustrated ───────────────────────────────────────
  nsfw_illustrated: {
    label:    "💋 Sensual Illustration",
    category: "🌸 Anime / Illustrated",
    prepend:  "sensual digital illustration, elegant pinup art, Artgerm-inspired figure study,",
    append:   ", soft intimate lighting, detailed expressive face, beautiful figure, high-quality digital painting",
    nsfw:     true,
  },

  // ── 3D Render ────────────────────────────────────────────────
  nsfw_3d: {
    label:    "🧊 Photorealistic 3D",
    category: "🧊 3D Render",
    prepend:  "photorealistic 3D render, Unreal Engine 5 quality, octane render, physically-based rendering,",
    append:   ", subsurface scattering skin, global illumination, ultra-detailed textures, cinematic 3D character render",
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
//  Distribution: 5 SFW · 2 SFW-with-undertones · 3 NSFW

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

  // ── NSFW (3) ─────────────────────────────────────────────────
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
 * @param {string}      charName        - AI character name
 * @param {string}      charDescription - AI character appearance / personality
 * @param {string}      charTraits      - comma-separated personality traits
 * @param {string}      userName        - user character name
 * @param {string}      userDescription - user character appearance
 * @param {string}      worldDesc       - setting / world description
 * @param {string|null} genre           - genre key from GENRES, or null
 * @returns {string}                    - newline-separated trigger lines
 */
function buildImagePromptTriggers(charName, charDescription, charTraits, userName, userDescription, worldDesc, genre) {
  const lines = [];

  // ── Character reference ───────────────────────────────────
  if (charName && charDescription) {
    // Trim the description to a compact visual summary (first sentence / 200 chars)
    const charVisual = charDescription.replace(/\s+/g, " ").slice(0, 200).replace(/[^.!?]*$/, "").trim()
      || charDescription.slice(0, 120).trim();
    lines.push(`${charName}: ${charVisual}${charTraits ? `, ${charTraits}` : ""}`);
  }

  // ── User character reference ──────────────────────────────
  if (userName && userDescription) {
    const userVisual = userDescription.replace(/\s+/g, " ").slice(0, 200).replace(/[^.!?]*$/, "").trim()
      || userDescription.slice(0, 120).trim();
    lines.push(`${userName}: ${userVisual}`);
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
 * Wrap a raw image prompt with the currently-selected style's prepend/append.
 * Falls back gracefully when no style is selected.
 *
 * @param {string} corePrompt  - the subject / scene description
 * @returns {string}           - fully-styled prompt string
 */
function styledImagePrompt(corePrompt) {
  const styleKey = oc.character.customData?.selectedImageStyle;
  if (!styleKey || !IMAGE_STYLES[styleKey]) return corePrompt;
  const style = IMAGE_STYLES[styleKey];
  return `${style.prepend} ${corePrompt}${style.append}`;
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
      `DESCRIPTION: <detailed one-paragraph description of your character's appearance, personality, and background>`,
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

    const response = await oc.generateText({
      instruction: instructionLines,
      startWith: `NAME:`,
      stopSequences: ["IMAGE PROMPT:"],
    });

    // Accept partial responses too
    if (response.stopReason === "error" && !response.text.includes("DESCRIPTION:")) {
      throw new Error("Generation failed — no usable content returned.");
    }

    const raw   = response.text;
    const lines = raw.split(/\n+/).map(l => l.trim());

    const pick = (prefix) =>
      (lines.find(l => l.startsWith(prefix + ":")) || "")
        .replace(prefix + ":", "").trim();

    const charName        = pick("NAME");
    const charDescription = pick("DESCRIPTION");
    const charTraits      = pick("TRAITS");
    const charQuirk       = pick("QUIRK");
    const worldDesc       = pick("WORLD");
    const userName        = pick("USER NAME");
    let   userDescription = pick("USER DESCRIPTION");
    const starter         = pick("ROLEPLAY STARTER");
    const mood            = pick("MOOD");
    const imagePrompt     = pick("IMAGE PROMPT") || `${worldDesc}, atmospheric, detailed, cinematic`;

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
      charName, charDescription, charTraits,
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
      ? "highly detailed, masterpiece, character portrait, expressive, sensual, adult content"
      : "digital art, highly detailed, masterpiece, pfp, avatar portrait, expressive";
    const negPrompt = "worst quality, blurry, low resolution, distorted, watermark";

    const charAvatarPromise = oc.textToImage({
      prompt: styledImagePrompt(
        `${charName} character portrait, ${charDescription}, ${charTraits}, ${avatarQuality}`
      ),
      negativePrompt: negPrompt,
    }).then(async ({ dataUrl }) => {
      oc.character.avatar.url = await resizeDataURLWidth(dataUrl, 300);
    }).catch(() => {});

    const userAvatarPromise = oc.textToImage({
      prompt: styledImagePrompt(
        `${userName} character portrait, ${userDescription}, ${avatarQuality}`
      ),
      negativePrompt: negPrompt,
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

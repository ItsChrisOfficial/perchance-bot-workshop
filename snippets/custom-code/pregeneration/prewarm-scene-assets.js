/**
 * Snippet: prewarm-scene-assets
 *
 * Purpose:
 *   Combines image and audio preloading for complete scene packages.
 *   Defines scenes with background image, music, CSS filter, and ambient
 *   color. Preloads all assets on init and provides a loadScene() API
 *   that applies scene properties to messages.
 *
 * Why realistic:
 *   Uses standard Image()/Audio() for preloading and documented message
 *   scene properties (scene.background.url, scene.background.filter,
 *   scene.music.url, scene.music.volume). Offline after initial preload.
 *
 * Immediate behavior when pasted:
 *   - Preloads all scene assets.
 *   - Exposes window.__pcbw_sceneAssets.loadScene(name) API.
 *
 * Customization points:
 *   - SCENES: named scene objects with all asset URLs and settings.
 *
 * Caveats:
 *   - All URLs must be accessible. Empty URLs are skipped.
 *   - Network-dependent for preloading; graceful per-asset failure.
 */
(async () => {
  if (window.__pcbw_sceneAssets_init) return;
  window.__pcbw_sceneAssets_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const SCENES = {
    forest: {
      label: "🌲 Forest",
      backgroundUrl: "",     // Set your own URL
      musicUrl: "",          // Set your own URL
      filterCss: "saturate(120%) brightness(95%)",
      musicVolume: 0.3
    },
    city: {
      label: "🏙️ City",
      backgroundUrl: "",
      musicUrl: "",
      filterCss: "contrast(105%)",
      musicVolume: 0.2
    },
    night: {
      label: "🌙 Night",
      backgroundUrl: "",
      musicUrl: "",
      filterCss: "brightness(70%) hue-rotate(220deg)",
      musicVolume: 0.15
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  const imageCache = new Map();
  const audioCache = new Map();
  let activeMusic = null;

  function preloadImage(url) {
    if (!url || imageCache.has(url)) return Promise.resolve();
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { imageCache.set(url, img); resolve(); };
      img.onerror = () => { console.warn("[pcbw-sceneAssets] Image failed:", url); resolve(); };
      img.src = url;
    });
  }

  function preloadAudio(url) {
    if (!url || audioCache.has(url)) return Promise.resolve();
    return new Promise(resolve => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.oncanplaythrough = () => { audioCache.set(url, audio); resolve(); };
      audio.onerror = () => { console.warn("[pcbw-sceneAssets] Audio failed:", url); resolve(); };
      audio.src = url;
      audio.load();
    });
  }

  async function preloadAll() {
    const promises = [];
    for (const scene of Object.values(SCENES)) {
      if (scene.backgroundUrl) promises.push(preloadImage(scene.backgroundUrl));
      if (scene.musicUrl) promises.push(preloadAudio(scene.musicUrl));
    }
    await Promise.all(promises);
    console.log(`[pcbw-sceneAssets] Preloaded ${promises.length} assets.`);
  }

  await preloadAll();

  const api = {
    /**
     * Apply a scene to a message object.
     * @param {string} name - Scene key from SCENES
     * @param {Object} [message] - Message to apply scene to. If omitted, returns scene config.
     */
    loadScene(name, message) {
      const scene = SCENES[name];
      if (!scene) { console.warn("[pcbw-sceneAssets] Unknown scene:", name); return null; }

      // Stop current music
      if (activeMusic) {
        activeMusic.pause();
        activeMusic.currentTime = 0;
      }

      // Start new music
      if (scene.musicUrl && audioCache.has(scene.musicUrl)) {
        activeMusic = audioCache.get(scene.musicUrl);
        activeMusic.volume = scene.musicVolume || 0.3;
        activeMusic.loop = true;
        activeMusic.play().catch(() => {});
      }

      // Apply to message if provided
      if (message) {
        message.scene = message.scene || {};
        message.scene.background = message.scene.background || {};
        if (scene.backgroundUrl) message.scene.background.url = scene.backgroundUrl;
        if (scene.filterCss) message.scene.background.filter = scene.filterCss;
        if (scene.musicUrl) {
          message.scene.music = message.scene.music || {};
          message.scene.music.url = scene.musicUrl;
          message.scene.music.volume = scene.musicVolume || 0.3;
        }
      }

      return scene;
    },

    getScenes() { return Object.keys(SCENES); },
    isReady(name) {
      const scene = SCENES[name];
      if (!scene) return false;
      const imgOk = !scene.backgroundUrl || imageCache.has(scene.backgroundUrl);
      const audOk = !scene.musicUrl || audioCache.has(scene.musicUrl);
      return imgOk && audOk;
    },
    preloadAll() { return preloadAll(); },
    stopMusic() {
      if (activeMusic) { activeMusic.pause(); activeMusic.currentTime = 0; activeMusic = null; }
    }
  };

  window.__pcbw_sceneAssets = api;
  console.log("[pcbw-sceneAssets] Scene assets manager loaded.");
})();

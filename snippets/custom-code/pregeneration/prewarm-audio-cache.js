/**
 * Snippet: prewarm-audio-cache
 *
 * Purpose:
 *   Preloads configurable audio file URLs into Audio objects. Provides an
 *   API for playing, stopping, and checking readiness of cached audio.
 *
 * Why realistic:
 *   Uses standard browser Audio() constructor. No frameworks. Network-dependent
 *   for initial load, then cached locally. Graceful per-file failure.
 *
 * Immediate behavior when pasted:
 *   - Preloads all configured audio URLs.
 *   - Exposes window.__pcbw_audioCache API with play/stop controls.
 *
 * Customization points:
 *   - AUDIO_URLS: array of URLs to preload.
 *
 * Caveats:
 *   - URLs must be CORS-friendly or same-origin.
 *   - Browser autoplay policies may block playback until user interaction.
 *   - Empty default URL list — populate with your own URLs.
 */
(async () => {
  if (window.__pcbw_audioCache_init) return;
  window.__pcbw_audioCache_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const AUDIO_URLS = [
    // Add your audio URLs here, e.g.:
    // "https://example.com/ambient-forest.mp3",
    // "https://example.com/notification.wav",
  ];
  // ─────────────────────────────────────────────────────────────────────

  const cache = new Map(); // url → { status, audio }

  function loadAudio(url) {
    return new Promise(resolve => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.oncanplaythrough = () => {
        cache.set(url, { status: "loaded", audio });
        resolve("loaded");
      };
      audio.onerror = () => {
        cache.set(url, { status: "failed", audio: null });
        resolve("failed");
      };
      cache.set(url, { status: "loading", audio });
      audio.src = url;
      audio.load();
    });
  }

  async function preloadAll(urls) {
    if (urls.length === 0) return;
    let loaded = 0, failed = 0;

    const promises = urls.map(async url => {
      if (cache.has(url) && cache.get(url).status === "loaded") {
        loaded++;
        return;
      }
      const result = await loadAudio(url);
      if (result === "loaded") loaded++;
      else failed++;
    });

    await Promise.all(promises);
    console.log(`[pcbw-audioCache] Preloaded: ${loaded} loaded, ${failed} failed.`);
  }

  await preloadAll(AUDIO_URLS);

  const api = {
    preload(urls) { return preloadAll(urls); },

    play(url, opts = {}) {
      const entry = cache.get(url);
      if (!entry || entry.status !== "loaded") {
        console.warn(`[pcbw-audioCache] Not loaded: ${url}`);
        return false;
      }
      const audio = entry.audio;
      audio.volume = Math.max(0, Math.min(1, opts.volume !== undefined ? opts.volume : 1));
      audio.loop = !!opts.loop;
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn("[pcbw-audioCache] Play blocked (autoplay policy):", err.message);
      });
      return true;
    },

    stop(url) {
      const entry = cache.get(url);
      if (entry && entry.audio) {
        entry.audio.pause();
        entry.audio.currentTime = 0;
      }
    },

    stopAll() {
      for (const [, entry] of cache) {
        if (entry.audio) {
          entry.audio.pause();
          entry.audio.currentTime = 0;
        }
      }
    },

    isReady(url) { const e = cache.get(url); return e && e.status === "loaded"; },

    getStatus() {
      const result = {};
      for (const [url, entry] of cache) result[url] = entry.status;
      return result;
    }
  };

  window.__pcbw_audioCache = api;
  console.log("[pcbw-audioCache] Audio cache loaded.");
})();

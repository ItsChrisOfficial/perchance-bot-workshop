/**
 * Snippet: prewarm-image-cache
 *
 * Purpose:
 *   Preloads a configurable list of image URLs into the browser cache using
 *   new Image(). Tracks loading status, retries failed loads once, and
 *   provides an API for checking readiness.
 *
 * Why realistic:
 *   Uses standard browser Image() constructor for preloading. No frameworks.
 *   Network-dependent for initial load but images are cached locally.
 *   Graceful failure per-image.
 *
 * Immediate behavior when pasted:
 *   - Begins preloading all configured URLs immediately.
 *   - Shows a progress indicator in the iframe during loading.
 *   - Exposes window.__pcbw_imageCache API.
 *
 * Customization points:
 *   - IMAGE_URLS: array of URLs to preload.
 *   - RETRY_COUNT: number of retries for failed loads.
 *
 * Caveats:
 *   - URLs must be accessible (CORS-friendly or same-origin).
 *   - Empty default URL list — populate with your own URLs.
 *   - Network-dependent; fails gracefully per-image.
 */
(async () => {
  if (window.__pcbw_imageCache_init) return;
  window.__pcbw_imageCache_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const IMAGE_URLS = [
    // Add your image URLs here, e.g.:
    // "https://example.com/avatar-happy.png",
    // "https://example.com/avatar-sad.png",
  ];
  const RETRY_COUNT = 1;
  // ─────────────────────────────────────────────────────────────────────

  const cache = new Map(); // url → { status, img, retries }

  // ─── Status Indicator ────────────────────────────────────────────────
  const indicator = document.createElement("div");
  indicator.id = "pcbw-imgcache-status";
  indicator.style.cssText = [
    "position:fixed; bottom:8px; left:8px; z-index:9999;",
    "padding:3px 8px; border-radius:8px; font-size:11px;",
    "font-family:sans-serif; opacity:0; transition:opacity .3s;",
    "background:light-dark(#E8F5E9,#1B5E20); color:light-dark(#2E7D32,#69F0AE);"
  ].join("");
  document.body.appendChild(indicator);

  function showStatus(text) { indicator.textContent = text; indicator.style.opacity = "1"; }
  function hideStatus() { indicator.style.opacity = "0"; }

  function loadImage(url, retries) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        cache.set(url, { status: "loaded", img, retries: 0 });
        resolve("loaded");
      };
      img.onerror = () => {
        if (retries > 0) {
          setTimeout(() => {
            loadImage(url, retries - 1).then(resolve);
          }, 500);
        } else {
          cache.set(url, { status: "failed", img: null, retries: 0 });
          resolve("failed");
        }
      };
      cache.set(url, { status: "loading", img, retries });
      img.src = url;
    });
  }

  async function preloadAll(urls) {
    if (urls.length === 0) return;
    showStatus(`🖼️ Preloading ${urls.length} images…`);
    let loaded = 0, failed = 0;

    const promises = urls.map(async url => {
      if (cache.has(url) && cache.get(url).status === "loaded") {
        loaded++;
        return;
      }
      const result = await loadImage(url, RETRY_COUNT);
      if (result === "loaded") loaded++;
      else failed++;
      showStatus(`🖼️ ${loaded + failed}/${urls.length} (${failed} failed)`);
    });

    await Promise.all(promises);
    showStatus(`🖼️ Done: ${loaded} loaded, ${failed} failed`);
    setTimeout(hideStatus, 2000);
    console.log(`[pcbw-imgCache] Preloaded: ${loaded} loaded, ${failed} failed.`);
  }

  // Start preloading
  await preloadAll(IMAGE_URLS);

  const api = {
    preload(urls) { return preloadAll(urls); },
    isReady(url) { const e = cache.get(url); return e && e.status === "loaded"; },
    getImage(url) { const e = cache.get(url); return e && e.status === "loaded" ? e.img : null; },
    getStatus() {
      const result = {};
      for (const [url, entry] of cache) result[url] = entry.status;
      return result;
    }
  };

  window.__pcbw_imageCache = api;
  console.log("[pcbw-imgCache] Image cache loaded.");
})();

/**
 * Snippet: transforms-scene-transition-engine
 *
 * Purpose:
 *   Classifies the environment/setting of each AI message using
 *   oc.getInstructCompletion() and applies scene properties (background URL,
 *   CSS filter, optional music URL) to that message. Caches the last detected
 *   scene in customData to skip redundant LLM calls.
 *
 * Why realistic:
 *   Uses documented message properties (scene.background.url, scene.background.filter,
 *   scene.music.url, scene.music.volume), oc.getInstructCompletion() for classification,
 *   and oc.thread.customData for persistence. Network-dependent (LLM call) with
 *   graceful fallback.
 *
 * Immediate behavior when pasted:
 *   - On each AI message, classifies the setting into one of the configured scenes.
 *   - Applies background, filter, and optional music to the message.
 *   - Skips LLM call if the scene hasn't changed based on recent context.
 *
 * Customization points:
 *   - SCENES: define scenes with name, backgroundUrl, filterCss, musicUrl, musicVolume.
 *   - SCENE_LABELS: must match the keys in SCENES.
 *   - CACHE_TOLERANCE: number of messages before re-classifying even if cached.
 *
 * Caveats:
 *   - Background/music URLs must be publicly accessible or data URIs.
 *   - LLM classification adds latency; errors fall back to cached scene.
 *   - Music playback depends on browser autoplay policies.
 */
(async () => {
  if (window.__pcbw_sceneEngine_init) return;
  window.__pcbw_sceneEngine_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_scene";
  const CACHE_TOLERANCE = 5; // Re-classify after this many messages even if cached

  const SCENES = {
    forest: {
      label: "🌲 Forest",
      backgroundUrl: "",  // Set your own URL or leave empty
      filterCss: "saturate(120%) brightness(95%)",
      musicUrl: "",
      musicVolume: 0.3
    },
    city: {
      label: "🏙️ City",
      backgroundUrl: "",
      filterCss: "contrast(105%) brightness(100%)",
      musicUrl: "",
      musicVolume: 0.2
    },
    cave: {
      label: "🕳️ Cave",
      backgroundUrl: "",
      filterCss: "brightness(70%) contrast(110%)",
      musicUrl: "",
      musicVolume: 0.2
    },
    ocean: {
      label: "🌊 Ocean",
      backgroundUrl: "",
      filterCss: "hue-rotate(10deg) saturate(130%)",
      musicUrl: "",
      musicVolume: 0.3
    },
    interior: {
      label: "🏠 Interior",
      backgroundUrl: "",
      filterCss: "brightness(105%) sepia(10%)",
      musicUrl: "",
      musicVolume: 0.15
    }
  };

  const SCENE_LABELS = Object.keys(SCENES);
  // ─────────────────────────────────────────────────────────────────────

  // Initialize state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = {
      currentScene: null,
      lastClassifiedAt: 0  // message index when last classified
    };
  }
  const sceneState = oc.thread.customData[NAMESPACE];

  async function classifyScene(text) {
    const instruction =
      `Based on the following text, determine which environment/setting it takes place in. ` +
      `Choose exactly one from: ${SCENE_LABELS.join(", ")}. ` +
      `Respond with ONLY the label, nothing else.\n\nText:\n${text.slice(0, 600)}`;
    const result = await oc.getInstructCompletion({ instruction });
    const cleaned = result.trim().toLowerCase().replace(/[^a-z]/g, "");
    return SCENE_LABELS.includes(cleaned) ? cleaned : null;
  }

  function applyScene(message, sceneKey) {
    const scene = SCENES[sceneKey];
    if (!scene) return;

    if (scene.backgroundUrl) {
      message.scene = message.scene || {};
      message.scene.background = message.scene.background || {};
      message.scene.background.url = scene.backgroundUrl;
    }
    if (scene.filterCss) {
      message.scene = message.scene || {};
      message.scene.background = message.scene.background || {};
      message.scene.background.filter = scene.filterCss;
    }
    if (scene.musicUrl) {
      message.scene = message.scene || {};
      message.scene.music = message.scene.music || {};
      message.scene.music.url = scene.musicUrl;
      message.scene.music.volume = scene.musicVolume || 0.3;
    }
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      const msgIndex = oc.thread.messages.length;
      const needsClassification =
        !sceneState.currentScene ||
        (msgIndex - sceneState.lastClassifiedAt) >= CACHE_TOLERANCE;

      let sceneKey = sceneState.currentScene;

      if (needsClassification) {
        const detected = await classifyScene(lastMsg.content);
        if (detected) {
          sceneKey = detected;
          sceneState.currentScene = detected;
          sceneState.lastClassifiedAt = msgIndex;
          console.log(`[pcbw-scene] Classified: ${detected}`);
        }
      }

      if (sceneKey) {
        applyScene(lastMsg, sceneKey);
      }
    } catch (err) {
      console.error("[pcbw-scene] Error:", err);
      // On error, keep last cached scene — no change
    }
  });

  console.log("[pcbw-scene] Scene transition engine loaded. Current:", sceneState.currentScene || "none");
})();

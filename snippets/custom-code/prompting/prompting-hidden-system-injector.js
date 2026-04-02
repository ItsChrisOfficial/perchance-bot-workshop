/**
 * Snippet: prompting-hidden-system-injector
 *
 * Purpose:
 *   Injects a configurable set of hidden system messages into the thread
 *   that only the AI can see (hiddenFrom: ["user"]). Tracks which messages
 *   have already been injected via customData to avoid duplicates.
 *
 * Why realistic:
 *   Uses oc.thread.messages.push() with hiddenFrom (documented), and
 *   oc.thread.customData for dedup tracking (documented). Pure offline.
 *
 * Immediate behavior when pasted:
 *   - Injects all configured hidden context messages immediately.
 *   - Each injection is tracked by ID so re-execution won't duplicate.
 *   - Messages appear in the thread as system messages hidden from the user.
 *
 * Customization points:
 *   - INJECTIONS: array of { id, content } objects to inject.
 *   - Set author, hiddenFrom, expectsReply as needed per injection.
 *
 * Caveats:
 *   - Hidden system messages still consume context window.
 *   - Too many injections can reduce space for conversation.
 *   - Messages are summarizable if thread grows long.
 */
(async () => {
  if (window.__pcbw_sysInjector_init) return;
  window.__pcbw_sysInjector_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_sysInject";

  const INJECTIONS = [
    {
      id: "world-rules",
      content: "The world follows internally consistent rules. Events have consequences that persist across scenes."
    },
    {
      id: "tone-guide",
      content: "Maintain a tone appropriate to the current scene. Match intensity to the situation."
    },
    {
      id: "pacing-note",
      content: "Keep responses focused and appropriately paced. Avoid rushing through important moments."
    }
  ];
  // ─────────────────────────────────────────────────────────────────────

  // Initialize tracking state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { injected: [] };
  }
  const state = oc.thread.customData[NAMESPACE];

  let injectedCount = 0;

  for (const injection of INJECTIONS) {
    if (state.injected.includes(injection.id)) continue;

    oc.thread.messages.push({
      content: injection.content,
      author: "system",
      hiddenFrom: ["user"],
      expectsReply: false
    });

    state.injected.push(injection.id);
    injectedCount++;
  }

  if (injectedCount > 0) {
    console.log(`[pcbw-sysInject] Injected ${injectedCount} hidden system message(s).`);
  } else {
    console.log("[pcbw-sysInject] All messages already injected. No action taken.");
  }

  /**
   * Expose an API to inject additional messages at runtime.
   * @param {string} id      - Unique identifier for dedup
   * @param {string} content - Message content
   */
  window.__pcbw_injectSystem = function (id, content) {
    if (state.injected.includes(id)) {
      console.log(`[pcbw-sysInject] "${id}" already injected. Skipping.`);
      return false;
    }
    oc.thread.messages.push({
      content: content,
      author: "system",
      hiddenFrom: ["user"],
      expectsReply: false
    });
    state.injected.push(id);
    console.log(`[pcbw-sysInject] Injected: "${id}"`);
    return true;
  };
})();

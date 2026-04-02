/**
 * Snippet: transforms-state-safe-init-guard
 *
 * Purpose:
 *   Provides a reusable, safe initialization pattern for oc.thread.customData.
 *   Merges caller-supplied defaults with any existing persisted state, preventing
 *   data loss on re-execution while ensuring new keys are always present.
 *
 * Why realistic:
 *   Uses only oc.thread.customData (documented persistent storage) and a
 *   window-level init flag to prevent duplicate listener registration.
 *   No network, no external deps, pure offline JS.
 *
 * Immediate behavior when pasted:
 *   - Initializes a demo namespace in customData with message counter and timestamp.
 *   - Registers a MessageAdded handler that increments the counter on every message.
 *   - Logs current state to console on each message for verification.
 *
 * Customization points:
 *   - NAMESPACE: change the customData key to avoid collisions with other snippets.
 *   - DEFAULT_STATE: add/remove keys as needed for your bot's state.
 *
 * Caveats:
 *   - Only one snippet should own a given namespace key.
 *   - customData is serialized as JSON; avoid storing functions or circular refs.
 */
(async () => {
  if (window.__pcbw_stateSafeInit_init) return;
  window.__pcbw_stateSafeInit_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_state";
  const DEFAULT_STATE = {
    messageCount: 0,
    firstSeenAt: null,
    lastActivity: null,
    flags: {}
  };
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Safely initialize a namespaced key in oc.thread.customData.
   * Merges defaults with existing persisted values so new keys are added
   * without overwriting data that already exists.
   *
   * @param {string} ns        - The key under oc.thread.customData
   * @param {Object} defaults  - Default values to merge
   * @returns {Object}         - The live reference to the merged state
   */
  function safeInit(ns, defaults) {
    if (!oc.thread.customData) {
      oc.thread.customData = {};
    }
    const existing = oc.thread.customData[ns];
    if (existing && typeof existing === "object") {
      // Merge: keep existing values, add missing defaults
      for (const key of Object.keys(defaults)) {
        if (!(key in existing)) {
          existing[key] = defaults[key];
        }
      }
      return existing;
    }
    // First run — deep-clone defaults so mutations don't affect the template
    oc.thread.customData[ns] = JSON.parse(JSON.stringify(defaults));
    return oc.thread.customData[ns];
  }

  // Expose safeInit for other snippets to reuse
  window.__pcbw_safeInit = safeInit;

  // Initialize this snippet's own state
  const state = safeInit(NAMESPACE, DEFAULT_STATE);

  // Set first-seen timestamp if not already recorded
  if (!state.firstSeenAt) {
    state.firstSeenAt = new Date().toISOString();
  }

  // ─── MessageAdded Handler ────────────────────────────────────────────
  oc.thread.on("MessageAdded", async function () {
    try {
      const s = oc.thread.customData[NAMESPACE];
      s.messageCount += 1;
      s.lastActivity = new Date().toISOString();

      console.log(
        `[pcbw-state] Message #${s.messageCount} | ` +
        `First seen: ${s.firstSeenAt} | ` +
        `Last activity: ${s.lastActivity}`
      );
    } catch (err) {
      console.error("[pcbw-state] Error in MessageAdded handler:", err);
    }
  });

  console.log("[pcbw-state] State safe-init guard loaded. Current state:", state);
})();

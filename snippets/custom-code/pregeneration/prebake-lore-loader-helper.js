/**
 * Snippet: prebake-lore-loader-helper
 *
 * Purpose:
 *   Manages lore-like data entries via oc.thread.customData. Stores a
 *   structured lore database as an array of { id, keywords, content,
 *   category } objects. Provides search, CRUD, and auto-injection of
 *   relevant lore as hidden system messages.
 *
 * Why realistic:
 *   Uses oc.thread.customData (documented) for persistent storage and
 *   oc.thread.messages.push() with hiddenFrom (documented) for injection.
 *   No network. Keyword matching is local string operations.
 *
 * Immediate behavior when pasted:
 *   - Initializes a lore database in customData with default entries.
 *   - On each user message, searches for relevant lore and injects matches
 *     as hidden system messages.
 *   - Exposes window.__pcbw_lore API.
 *
 * Customization points:
 *   - DEFAULT_LORE: initial lore entries.
 *   - MAX_INJECTIONS_PER_MESSAGE: limit lore injections per message.
 *
 * Caveats:
 *   - Keyword matching is simple substring/token matching — not semantic.
 *   - Too many lore entries may slow matching or consume context space.
 *   - Injected lore messages are summarizable.
 */
(async () => {
  if (window.__pcbw_lore_init) return;
  window.__pcbw_lore_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_lore";
  const MAX_INJECTIONS_PER_MESSAGE = 3;

  const DEFAULT_LORE = [
    {
      id: "lore-magic",
      keywords: ["magic", "spell", "enchant", "arcane", "wizard", "sorcerer"],
      content: "Magic in this world draws from natural elemental forces. Overuse causes physical exhaustion. Rare individuals are born with innate magical affinity.",
      category: "world"
    },
    {
      id: "lore-geography",
      keywords: ["mountain", "river", "forest", "city", "town", "village", "kingdom"],
      content: "The land consists of diverse regions: mountain ranges to the north, vast forests in the center, and coastal cities to the south. Trade routes connect major settlements.",
      category: "world"
    },
    {
      id: "lore-social",
      keywords: ["guild", "council", "law", "rule", "government", "politics", "trade"],
      content: "Society is organized around guilds and a ruling council. Laws vary by region. Trade is the primary driver of inter-regional relations.",
      category: "society"
    }
  ];
  // ─────────────────────────────────────────────────────────────────────

  // Initialize lore database
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = {
      entries: JSON.parse(JSON.stringify(DEFAULT_LORE)),
      injectedIds: {}
    };
  }
  const loreDB = oc.thread.customData[NAMESPACE];

  function search(query) {
    const queryLower = query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/);

    return loreDB.entries.filter(entry => {
      return entry.keywords.some(kw => {
        const kwLower = kw.toLowerCase();
        return queryTokens.some(token => token.includes(kwLower) || kwLower.includes(token));
      });
    });
  }

  function injectRelevant(messageContent) {
    const matches = search(messageContent);
    let injected = 0;

    // Track which lore was injected for which message index to avoid re-injection
    const msgIdx = oc.thread.messages.length;
    if (!loreDB.injectedIds[msgIdx]) loreDB.injectedIds[msgIdx] = [];

    for (const entry of matches) {
      if (injected >= MAX_INJECTIONS_PER_MESSAGE) break;
      if (loreDB.injectedIds[msgIdx].includes(entry.id)) continue;

      oc.thread.messages.push({
        content: `[Lore: ${entry.category}] ${entry.content}`,
        author: "system",
        hiddenFrom: ["user"],
        expectsReply: false
      });

      loreDB.injectedIds[msgIdx].push(entry.id);
      injected++;
    }

    if (injected > 0) {
      console.log(`[pcbw-lore] Injected ${injected} relevant lore entries.`);
    }
    return injected;
  }

  // Auto-inject on user messages
  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "user") return;
      injectRelevant(lastMsg.content);
    } catch (err) {
      console.error("[pcbw-lore] Error:", err);
    }
  });

  const api = {
    addEntry(entry) {
      if (!entry.id) entry.id = "lore-" + Date.now();
      if (!entry.keywords) entry.keywords = [];
      if (!entry.category) entry.category = "general";
      loreDB.entries.push(entry);
      console.log(`[pcbw-lore] Added: ${entry.id}`);
    },
    removeEntry(id) {
      const idx = loreDB.entries.findIndex(e => e.id === id);
      if (idx >= 0) { loreDB.entries.splice(idx, 1); console.log(`[pcbw-lore] Removed: ${id}`); }
    },
    search(query) { return search(query); },
    getAll() { return loreDB.entries; },
    getByCategory(cat) { return loreDB.entries.filter(e => e.category === cat); },
    injectRelevant(content) { return injectRelevant(content); }
  };

  window.__pcbw_lore = api;
  console.log(`[pcbw-lore] Lore loader loaded. ${loreDB.entries.length} entries.`);
})();

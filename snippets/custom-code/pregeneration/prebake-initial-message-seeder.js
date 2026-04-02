/**
 * Snippet: prebake-initial-message-seeder
 *
 * Purpose:
 *   Programmatically seeds oc.character.initialMessages from a configurable
 *   template array. Supports conditional messages based on customData flags.
 *   Provides an API for modifying initial messages at runtime.
 *
 * Why realistic:
 *   Uses oc.character.initialMessages (documented, writable) and
 *   oc.thread.customData (documented). No network, fully offline.
 *
 * Immediate behavior when pasted:
 *   - Sets initial messages from the configured template.
 *   - Exposes window.__pcbw_initialSeeder API.
 *
 * Customization points:
 *   - MESSAGE_TEMPLATE: array of message config objects.
 *   - Each entry: { content, author, hiddenFrom, expectsReply, name, condition }.
 *   - condition: optional function returning boolean; message only included if true.
 *
 * Caveats:
 *   - Overwrites oc.character.initialMessages on each init.
 *   - Initial messages are summarizable — don't use for persistent rules.
 *   - Coordinate with other snippets that modify initialMessages.
 */
(async () => {
  if (window.__pcbw_initialSeeder_init) return;
  window.__pcbw_initialSeeder_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_initSeed";

  const MESSAGE_TEMPLATE = [
    {
      content: "Welcome! The scene begins as you enter an unfamiliar place. Look around and take in your surroundings.",
      author: "ai",
      expectsReply: true
    },
    {
      content: "You notice the atmosphere feels charged with possibility. Every choice here will matter.",
      author: "system",
      hiddenFrom: ["user"],
      expectsReply: false
    },
    {
      content: "Take your time to explore. When you're ready, describe what you'd like to do.",
      author: "ai",
      expectsReply: true,
      condition: () => {
        // Example: only include if a flag is set
        // Replace with your own condition logic, or remove to always include
        return true;
      }
    }
  ];
  // ─────────────────────────────────────────────────────────────────────

  function buildMessages(template) {
    const messages = [];
    for (const entry of template) {
      // Evaluate condition if present
      if (typeof entry.condition === "function" && !entry.condition()) {
        continue;
      }

      const msg = { content: entry.content, author: entry.author || "ai" };
      if (entry.hiddenFrom) msg.hiddenFrom = entry.hiddenFrom;
      if (entry.expectsReply !== undefined) msg.expectsReply = entry.expectsReply;
      if (entry.name) msg.name = entry.name;
      messages.push(msg);
    }
    return messages;
  }

  function applyTemplate(template) {
    const messages = buildMessages(template || MESSAGE_TEMPLATE);
    oc.character.initialMessages = messages;
    console.log(`[pcbw-initSeed] Set ${messages.length} initial message(s).`);
    return messages;
  }

  // Apply on init
  applyTemplate(MESSAGE_TEMPLATE);

  const api = {
    setMessages(template) { return applyTemplate(template); },
    addMessage(msg) {
      if (!oc.character.initialMessages) oc.character.initialMessages = [];
      const formatted = { content: msg.content, author: msg.author || "ai" };
      if (msg.hiddenFrom) formatted.hiddenFrom = msg.hiddenFrom;
      if (msg.expectsReply !== undefined) formatted.expectsReply = msg.expectsReply;
      if (msg.name) formatted.name = msg.name;
      oc.character.initialMessages.push(formatted);
      return formatted;
    },
    getMessages() { return oc.character.initialMessages || []; },
    reset() { return applyTemplate(MESSAGE_TEMPLATE); }
  };

  window.__pcbw_initialSeeder = api;
  console.log("[pcbw-initSeed] Initial message seeder loaded.");
})();

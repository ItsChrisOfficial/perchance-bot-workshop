/**
 * Snippet: prompting-slash-command-interpreter
 *
 * Purpose:
 *   Intercepts user messages starting with a configurable command prefix
 *   (default "!") and dispatches to a registry of custom commands. Each
 *   command is a function receiving parsed args. The command message is
 *   removed and a system response is injected.
 *
 * Why realistic:
 *   Uses oc.thread.on("MessageAdded") (documented), oc.thread.messages
 *   array manipulation (documented: splice, push), and oc.thread.customData
 *   (documented). All offline-safe with no network dependencies.
 *
 * Immediate behavior when pasted:
 *   - Registers built-in commands: !help, !status, !reset, !roll, !note.
 *   - On user message starting with "!", parses command and dispatches.
 *   - Removes the command message and injects a system response.
 *
 * Customization points:
 *   - CMD_PREFIX: the prefix character(s) that trigger command parsing.
 *   - COMMANDS: add/remove commands in the registry object.
 *
 * Caveats:
 *   - Commands that modify thread state should be tested carefully.
 *   - The !reset command clears all thread customData — use with care.
 *   - Command messages are removed from the thread (spliced out).
 */
(async () => {
  if (window.__pcbw_slashCmd_init) return;
  window.__pcbw_slashCmd_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_slashCmd";
  const CMD_PREFIX = "!";

  // Notes storage
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = { notes: [] };
  }
  const cmdState = oc.thread.customData[NAMESPACE];

  // ─── Command Registry ────────────────────────────────────────────────
  const COMMANDS = {
    help: {
      description: "Show available commands",
      handler: function () {
        const lines = ["**Available Commands:**"];
        for (const [name, cmd] of Object.entries(COMMANDS)) {
          lines.push(`\`${CMD_PREFIX}${name}\` — ${cmd.description}`);
        }
        return lines.join("\n");
      }
    },

    status: {
      description: "Show current thread state summary",
      handler: function () {
        const msgCount = oc.thread.messages.length;
        const aiMsgs = oc.thread.messages.filter(m => m.author === "ai").length;
        const userMsgs = oc.thread.messages.filter(m => m.author === "user").length;
        const noteCount = cmdState.notes.length;
        return [
          "**Thread Status:**",
          `📝 Total messages: ${msgCount}`,
          `🤖 AI messages: ${aiMsgs}`,
          `👤 User messages: ${userMsgs}`,
          `📌 Saved notes: ${noteCount}`
        ].join("\n");
      }
    },

    reset: {
      description: "Clear all thread custom data (careful!)",
      handler: function () {
        const keys = Object.keys(oc.thread.customData || {});
        oc.thread.customData = {};
        oc.thread.customData[NAMESPACE] = { notes: [] };
        return `✅ Cleared ${keys.length} customData key(s). Thread state reset.`;
      }
    },

    roll: {
      description: "Roll dice — usage: !roll 2d6",
      handler: function (args) {
        const diceStr = args[0] || "1d6";
        const match = diceStr.match(/^(\d+)d(\d+)$/i);
        if (!match) return "❌ Invalid format. Use NdS (e.g. 2d6, 1d20).";

        const count = Math.min(parseInt(match[1], 10), 100);
        const sides = Math.min(parseInt(match[2], 10), 1000);
        if (count < 1 || sides < 1) return "❌ Invalid dice values.";

        const rolls = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
          const r = Math.floor(Math.random() * sides) + 1;
          rolls.push(r);
          total += r;
        }
        return `🎲 **${diceStr}**: [${rolls.join(", ")}] = **${total}**`;
      }
    },

    note: {
      description: "Save a note — usage: !note Your text here",
      handler: function (args) {
        const text = args.join(" ").trim();
        if (!text) {
          if (cmdState.notes.length === 0) return "📌 No notes saved yet.";
          const list = cmdState.notes.map((n, i) => `${i + 1}. ${n}`).join("\n");
          return `**Saved Notes:**\n${list}`;
        }
        cmdState.notes.push(text);
        return `📌 Note #${cmdState.notes.length} saved: "${text}"`;
      }
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  // Expose command registry for runtime extension
  window.__pcbw_commands = COMMANDS;

  function respond(text) {
    oc.thread.messages.push({
      content: text,
      author: "system",
      hiddenFrom: ["ai"],
      expectsReply: false
    });
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "user") return;

      const content = (lastMsg.content || "").trim();
      if (!content.startsWith(CMD_PREFIX)) return;

      // Parse command and args
      const parts = content.slice(CMD_PREFIX.length).split(/\s+/);
      const cmdName = parts[0].toLowerCase();
      const args = parts.slice(1);

      // Remove the command message from thread
      const idx = oc.thread.messages.indexOf(lastMsg);
      if (idx >= 0) {
        oc.thread.messages.splice(idx, 1);
      }

      // Dispatch
      const cmd = COMMANDS[cmdName];
      if (cmd) {
        const result = cmd.handler(args);
        respond(result);
        console.log(`[pcbw-cmd] Executed: ${CMD_PREFIX}${cmdName}`);
      } else {
        respond(`❌ Unknown command: \`${CMD_PREFIX}${cmdName}\`. Type \`${CMD_PREFIX}help\` for available commands.`);
      }
    } catch (err) {
      console.error("[pcbw-cmd] Error:", err);
      respond("❌ Command execution error. Check console for details.");
    }
  });

  console.log("[pcbw-cmd] Slash command interpreter loaded. Type !help for commands.");
})();

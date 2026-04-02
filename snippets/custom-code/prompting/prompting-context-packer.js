/**
 * Snippet: prompting-context-packer
 *
 * Purpose:
 *   Periodically summarizes recent messages into a compact context block
 *   using oc.getInstructCompletion() and injects it as a hidden system
 *   message. Rate-limits summarization to avoid excessive LLM calls.
 *
 * Why realistic:
 *   Uses documented APIs: oc.thread.messages, oc.getInstructCompletion(),
 *   oc.thread.customData, hiddenFrom. Adds context summaries that help
 *   the AI maintain coherence over long conversations.
 *
 * Immediate behavior when pasted:
 *   - Every SUMMARIZE_INTERVAL messages, summarizes the last WINDOW_SIZE
 *     messages into a compact block.
 *   - Injects the summary as a hidden system message.
 *   - Shows summarization status in iframe.
 *
 * Customization points:
 *   - WINDOW_SIZE: how many recent messages to include in summary.
 *   - SUMMARIZE_INTERVAL: how many messages between summarizations.
 *   - MAX_SUMMARY_LENGTH: maximum tokens/chars for the summary instruction.
 *
 * Caveats:
 *   - LLM call for summarization is network-dependent.
 *   - Summaries consume context window space.
 *   - Frequent summarization increases latency and cost.
 */
(async () => {
  if (window.__pcbw_ctxPacker_init) return;
  window.__pcbw_ctxPacker_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_ctxPack";
  const WINDOW_SIZE = 10;
  const SUMMARIZE_INTERVAL = 8; // Summarize every N messages
  const MAX_SUMMARY_LENGTH = 500;
  // ─────────────────────────────────────────────────────────────────────

  // Initialize state
  if (!oc.thread.customData) oc.thread.customData = {};
  if (!oc.thread.customData[NAMESPACE]) {
    oc.thread.customData[NAMESPACE] = {
      lastSummarizedAt: 0,
      summaryCount: 0,
      lastSummary: ""
    };
  }
  const state = oc.thread.customData[NAMESPACE];

  // ─── Status Badge ────────────────────────────────────────────────────
  const badge = document.createElement("div");
  badge.id = "pcbw-ctxpack-badge";
  badge.style.cssText = [
    "position:fixed; top:8px; right:8px; z-index:9999;",
    "padding:3px 8px; border-radius:8px; font-size:11px;",
    "font-family:sans-serif; opacity:0; transition:opacity .3s;",
    "background:light-dark(#E3F2FD,#1A237E); color:light-dark(#1565C0,#82B1FF);"
  ].join("");
  document.body.appendChild(badge);

  function showBadge(text) {
    badge.textContent = text;
    badge.style.opacity = "1";
  }
  function hideBadge() {
    badge.style.opacity = "0";
  }

  oc.thread.on("MessageAdded", async function () {
    try {
      const msgCount = oc.thread.messages.length;
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Check if it's time to summarize
      const messagesSinceLastSummary = msgCount - state.lastSummarizedAt;
      if (messagesSinceLastSummary < SUMMARIZE_INTERVAL) return;

      showBadge("📦 Packing context…");

      // Gather recent messages
      const startIdx = Math.max(0, msgCount - WINDOW_SIZE);
      const recentMessages = oc.thread.messages.slice(startIdx, msgCount);
      const transcript = recentMessages
        .filter(m => !m.hiddenFrom || !m.hiddenFrom.includes("ai"))
        .map(m => `[${m.author}]: ${(m.content || "").slice(0, 200)}`)
        .join("\n");

      const instruction =
        `Summarize the following conversation excerpt into a compact context block ` +
        `of at most ${MAX_SUMMARY_LENGTH} characters. Focus on: key events, ` +
        `character actions, emotional states, and plot points. ` +
        `Write in third person, past tense, as concise notes.\n\n` +
        `Conversation:\n${transcript}\n\nSummary:`;

      const summary = await oc.getInstructCompletion({ instruction });

      if (summary && summary.trim().length > 20) {
        const trimmedSummary = summary.trim().slice(0, MAX_SUMMARY_LENGTH);

        // Inject as hidden system message
        oc.thread.messages.push({
          content: `[Context Summary] ${trimmedSummary}`,
          author: "system",
          hiddenFrom: ["user"],
          expectsReply: false
        });

        state.lastSummarizedAt = msgCount;
        state.summaryCount += 1;
        state.lastSummary = trimmedSummary;

        console.log(`[pcbw-ctxPack] Summary #${state.summaryCount} injected.`);
      }
    } catch (err) {
      console.error("[pcbw-ctxPack] Summarization error:", err);
    } finally {
      hideBadge();
    }
  });

  console.log(`[pcbw-ctxPack] Context packer loaded. Summaries so far: ${state.summaryCount}`);
})();

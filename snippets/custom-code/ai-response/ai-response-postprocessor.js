/**
 * Snippet: ai-response-postprocessor
 *
 * Purpose:
 *   An extensible post-processing pipeline for AI messages. Defines an
 *   ordered array of processor functions that run sequentially on each
 *   AI message. Processors can modify content, add styling, or append
 *   hidden metadata.
 *
 * Why realistic:
 *   Uses MessageAdded event (documented) and message property modification
 *   (documented). Pure offline processing with optional LLM steps.
 *   Processors are configurable functions — users add their own.
 *
 * Immediate behavior when pasted:
 *   - Runs all configured processors on each AI message.
 *   - Default processors: trim whitespace, normalize line breaks, add timestamp.
 *   - Tracks processing via per-message customData.
 *   - Exposes window.__pcbw_postprocess API for adding/removing processors.
 *
 * Customization points:
 *   - PROCESSORS: array of { id, name, fn(message) } objects.
 *   - Processors run in order; each receives the message object.
 *
 * Caveats:
 *   - Processor errors are caught individually; one failure won't block others.
 *   - Async processors are awaited sequentially.
 */
(async () => {
  if (window.__pcbw_postprocess_init) return;
  window.__pcbw_postprocess_init = true;

  // ─── Customization Points ────────────────────────────────────────────
  const NAMESPACE = "__pcbw_postproc";

  const PROCESSORS = [
    {
      id: "trim-whitespace",
      name: "Trim Whitespace",
      fn: (message) => {
        message.content = message.content.trim();
      }
    },
    {
      id: "normalize-linebreaks",
      name: "Normalize Line Breaks",
      fn: (message) => {
        // Collapse 3+ consecutive newlines into 2
        message.content = message.content.replace(/\n{3,}/g, "\n\n");
      }
    },
    {
      id: "append-timestamp",
      name: "Append Timestamp",
      fn: (message) => {
        const time = new Date().toLocaleTimeString("en-US", { hour12: false });
        message.content +=
          `\n<!--hidden-from-ai-start-->` +
          `<div style="text-align:right;font-size:9px;color:light-dark(#aaa,#555);` +
          `font-family:sans-serif;margin-top:4px;">${time}</div>` +
          `<!--hidden-from-ai-end-->`;
      }
    }
  ];
  // ─────────────────────────────────────────────────────────────────────

  const pipeline = [...PROCESSORS];

  oc.thread.on("MessageAdded", async function () {
    try {
      const lastMsg = oc.thread.messages.at(-1);
      if (!lastMsg || lastMsg.author !== "ai") return;

      // Skip if already processed
      if (lastMsg.customData && lastMsg.customData[NAMESPACE]) return;

      for (const proc of pipeline) {
        try {
          await proc.fn(lastMsg);
        } catch (err) {
          console.error(`[pcbw-postproc] Processor "${proc.id}" error:`, err);
        }
      }

      if (!lastMsg.customData) lastMsg.customData = {};
      lastMsg.customData[NAMESPACE] = {
        processed: true,
        processors: pipeline.map(p => p.id),
        at: new Date().toISOString()
      };

      console.log(`[pcbw-postproc] Ran ${pipeline.length} processor(s).`);
    } catch (err) {
      console.error("[pcbw-postproc] Pipeline error:", err);
    }
  });

  const api = {
    addProcessor(config) {
      if (!config.id || !config.fn) return;
      if (pipeline.some(p => p.id === config.id)) return;
      pipeline.push(config);
    },
    removeProcessor(id) {
      const idx = pipeline.findIndex(p => p.id === id);
      if (idx >= 0) pipeline.splice(idx, 1);
    },
    getProcessors() {
      return pipeline.map(p => ({ id: p.id, name: p.name }));
    }
  };

  window.__pcbw_postprocess = api;
  console.log(`[pcbw-postproc] Post-processor loaded with ${pipeline.length} processors.`);
})();

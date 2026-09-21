/**
 * Answers a message carrying a run of amounts with the total of that run.
 *
 * @remarks
 *   One message in produces one message out, and the worker keeps no state between them, so two
 *   runs may be in flight at once. Each reply carries the number its request came with, so the
 *   page tells the two apart. A run mixing currencies throws inside the handler, which posts
 *   nothing and surfaces as an error event on the worker rather than as a reply.
 */

/// <reference lib="webworker" />

import { type Reply, type Request } from "#total.worker-client.ts";
import { totalling } from "#totalling.ts";

self.addEventListener("message", (held: MessageEvent<Request>) => {
  const reply: Reply = { id: held.data.id, total: totalling(held.data.amounts) };

  self.postMessage(reply);
});

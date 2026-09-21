/**
 * Posts back the total of the amounts each request message holds.
 *
 * @remarks
 *   The worker keeps no state between messages, so two requests may be in flight at once, and each
 *   reply echoes the id of its request. A run mixing currencies throws inside the handler, which
 *   posts nothing and surfaces as an error event on the worker.
 */

/// <reference lib="webworker" />

import { type Reply, type Request } from "#total.worker-client.ts";
import { totalling } from "#totalling.ts";

self.addEventListener("message", (held: MessageEvent<Request>) => {
  const reply: Reply = { id: held.data.id, total: totalling(held.data.amounts) };

  self.postMessage(reply);
});

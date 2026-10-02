/**
 * Delivers events between plugins over one `EventTarget`, under the host's policy: declared events
 * alone, who may emit, a wrapper per handler, a limit on nested deliveries, and sticky payloads.
 *
 * @remarks
 *   `dispatchEvent` delivers synchronously, in subscription order, and runs an emit made inside a
 *   handler at once, depth first. A listener that throws would surface as an uncaught exception
 *   after the dispatch, which ends a server process, so every handler runs inside a wrapper that
 *   reports its error and returns.
 */

import { type ResolvedEvent } from "@stealthscale/sdk-core";
import { type EventBus, type HostReport } from "@stealthscale/sdk-plugin";

/**
 * Deliveries that may run inside one another. The emit that would start one more is dropped.
 */
export const NESTING = 16;

/**
 * Lists what the bus is created from.
 */
export interface BusOptions {
  /**
   * Every event the installed plugins declare, the host's included.
   */
  readonly events: readonly ResolvedEvent[];

  /**
   * Receives `event-handler-failed` for a handler that throws, and `event-chain-cut` for an emit
   * the bus drops.
   */
  readonly report: (entry: HostReport) => void;
}

/**
 * Returns the message of an emit by a party that may not emit an event.
 */
function refused(event: ResolvedEvent, by: string | undefined): string {
  const party = by === undefined ? "The product" : `The plugin ${by}`;

  return `${party} may not emit ${event.id}: only ${event.plugin} emits it.`;
}

/**
 * Returns the event bus over the declared events.
 *
 * @remarks
 *   An emit of an event no installed plugin declares throws, and so does an emit by a party other
 *   than the declaring plugin, unless the event states `emit: "anyone"`. The product's own code
 *   emits as no plugin, so it emits an `anyone` event alone. A sticky event keeps its last payload
 *   and hands it to each new subscriber when it subscribes. A subscription to an event no installed
 *   plugin declares receives nothing.
 */
export function createEventBus({ events, report }: BusOptions): EventBus {
  const declared = new Map(events.map((event) => [event.id, event]));
  const target = new EventTarget();
  const kept = new Map<string, unknown>();
  let depth = 0;

  return {
    emit: (by, eventId, payload) => {
      const event = declared.get(eventId);

      if (event === undefined)
        throw new Error(`No installed plugin declares the event ${eventId}.`);

      if (event.emit !== "anyone" && by !== event.plugin) throw new Error(refused(event, by));

      if (depth >= NESTING) {
        report({ kind: "event-chain-cut", plugin: by, target: eventId });

        return;
      }

      if (event.sticky) kept.set(eventId, payload);

      depth += 1;

      try {
        target.dispatchEvent(new CustomEvent(eventId, { detail: payload }));
      } finally {
        depth -= 1;
      }
    },
    subscribe: (by, eventId, handler) => {
      /**
       * Passes a payload to the handler, and reports what the handler throws.
       */
      const deliver = (payload: unknown): void => {
        try {
          handler(payload);
        } catch (error) {
          report({ error, kind: "event-handler-failed", plugin: by, target: eventId });
        }
      };

      /**
       * Receives the event on the target.
       */
      const listener = (event: Event): void => {
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the bus dispatches nothing but the CustomEvent of an emit
        deliver((event as CustomEvent<unknown>).detail);
      };

      target.addEventListener(eventId, listener);

      if (kept.has(eventId)) deliver(kept.get(eventId));

      return () => {
        target.removeEventListener(eventId, listener);
      };
    },
  };
}

/**
 * Wraps the request and reply a worker exchanges in a promise the page awaits.
 *
 * @remarks
 *   The `Totaller` interface declares only the members this module calls, so a specification drives
 *   it with an object literal and needs no worker runtime. Every request carries an id the worker
 *   echoes, so two requests in flight at once settle independently.
 */

import { type Amount } from "@stealthscale/example-lib-core";

/**
 * Describes the message the client posts for one run of amounts.
 */
export interface Request {
  /**
   * Lists the amounts to total.
   */
  readonly amounts: readonly Amount[];

  /**
   * Gives the id the reply echoes, which matches a total to the request that asked for it.
   */
  readonly id: number;
}

/**
 * Describes the message the worker posts back with the total.
 */
export interface Reply {
  /**
   * Gives the id of the request this total belongs to.
   */
  readonly id: number;

  /**
   * Gives the total, or undefined for an empty run.
   */
  readonly total: Amount | undefined;
}

/**
 * Maps each event this module listens for to the event object its listener receives.
 */
interface Heard {
  /**
   * Fires when the worker throws, or could not be started at all.
   */
  readonly error: ErrorEvent;

  /**
   * Fires when the worker posts a reply.
   */
  readonly message: MessageEvent<Reply>;
}

/**
 * Declares the members of a worker this module calls.
 *
 * @remarks
 *   A DOM `Worker` satisfies this interface without a cast. `terminate` is left out, because
 *   ending a worker stays the caller's business.
 */
export interface Totaller {
  /**
   * Registers a listener for a reply or for the worker's failure.
   */
  addEventListener: <Of extends keyof Heard>(of: Of, held: (event: Heard[Of]) => void) => void;

  /**
   * Posts one run of amounts to the worker.
   */
  postMessage: (request: Request) => void;

  /**
   * Removes a listener once its request has settled.
   */
  removeEventListener: <Of extends keyof Heard>(of: Of, held: (event: Heard[Of]) => void) => void;
}

/**
 * Sets how long a run may take before the promise rejects, in milliseconds.
 */
const PATIENCE = 10_000;

/**
 * Counts the requests this module has posted, which gives each one its id.
 */
let next = 0;

/**
 * Posts a run of amounts to a worker and resolves with the total it replies.
 *
 * @remarks
 *   Both listeners are registered before the request is posted, so a worker that replies inside
 *   `postMessage` is still heard, and both come off once the promise settles either way. A reply
 *   naming another id is left to that request's listener. The timeout keeps a page from waiting on
 *   a total that is not coming.
 * @param worker - The worker the request is posted to.
 * @param amounts - The amounts to total.
 * @param patience - The time to wait for the reply, in milliseconds. Ten seconds where absent.
 * @returns The total the worker computed, or undefined for an empty run.
 * @throws {@link Error} When the worker reports an error, or sends no reply before the timeout.
 */
export function totalled(
  worker: Totaller,
  amounts: readonly Amount[],
  patience = PATIENCE,
): Promise<Amount | undefined> {
  next += 1;

  const id = next;

  return new Promise<Amount | undefined>((settle, reject) => {
    /**
     * Removes both listeners and clears the timeout, however the promise settled.
     */
    const done = (): void => {
      clearTimeout(clock);
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
    };

    /**
     * Resolves with the total when the reply names this request's id, and ignores every other
     * reply.
     */
    const onMessage = (event: MessageEvent<Reply>): void => {
      if (event.data.id !== id) return;

      done();
      settle(event.data.total);
    };

    /**
     * Rejects with the message the error event reported.
     */
    const onError = (event: ErrorEvent): void => {
      done();
      reject(new Error(`the worker failed: ${event.message}`));
    };

    const clock = setTimeout(() => {
      done();
      reject(new Error(`the worker answered nothing within ${String(patience)} ms`));
    }, patience);

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.postMessage({ amounts, id });
  });
}

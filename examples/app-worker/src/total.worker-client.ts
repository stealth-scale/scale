/**
 * Turns the worker's message exchange into a promise the page can await.
 *
 * @remarks
 *   The worker is described by the members this module actually calls, so a test drives it with
 *   an object literal and needs no worker runtime. Every request carries a number of its own and
 *   the worker echoes it, so two runs in flight at once each settle with their own total.
 */

import { type Amount } from "@stealthscale/example-lib-core";

/**
 * The message a run is sent as.
 */
export interface Request {
  /**
   * The run of amounts to total.
   */
  readonly amounts: readonly Amount[];

  /**
   * The number the reply carries back, so the page tells one run's total from another's.
   */
  readonly id: number;
}

/**
 * The message a total comes back as.
 */
export interface Reply {
  /**
   * The number of the request the total answers.
   */
  readonly id: number;

  /**
   * The total, or undefined for an empty run.
   */
  readonly total: Amount | undefined;
}

/**
 * The events the client listens for, and what each hands the listener.
 */
interface Heard {
  /**
   * The worker threw, or could not be started at all.
   */
  readonly error: ErrorEvent;

  /**
   * The worker sent a reply.
   */
  readonly message: MessageEvent<Reply>;
}

/**
 * The part of a worker that sends a run of amounts and hears the total back.
 *
 * @remarks
 *   A DOM Worker satisfies this without being cast. Describing these members rather than the
 *   whole interface also keeps this module away from terminate, which would end a worker its
 *   caller still owns.
 */
export interface Totaller {
  /**
   * Registers a listener for a reply or for the worker's failure.
   */
  addEventListener: <Of extends keyof Heard>(of: Of, held: (event: Heard[Of]) => void) => void;

  /**
   * Hands the worker a run of amounts to total.
   */
  postMessage: (request: Request) => void;

  /**
   * Takes a listener off again, once its request is settled.
   */
  removeEventListener: <Of extends keyof Heard>(of: Of, held: (event: Heard[Of]) => void) => void;
}

/**
 * How long a run may take before the promise rejects, in milliseconds.
 */
const PATIENCE = 10_000;

/**
 * The number the next request is sent under.
 */
let next = 0;

/**
 * Sends a run of amounts to a worker and settles with the total it sends back.
 *
 * @remarks
 *   The listeners go on before the run is sent, so a worker replying inside postMessage is still
 *   heard, and both come off once the promise settles, however it settled. A reply to another
 *   request is left for that request's listener. A worker that throws on the run, or dies, rejects
 *   the promise with the error event's message, and a worker that answers nothing rejects it when
 *   the patience runs out, so a page never waits on a total that is not coming.
 * @param worker - The worker to send the run to.
 * @param amounts - The run to total.
 * @param patience - How long to wait for the total, in milliseconds.
 * @returns The total the worker computed, or undefined for an empty run.
 * @throws {@link Error} When the worker fails, or answers nothing within the patience.
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
     * Takes every listener off and stops the clock, whichever way the promise settled.
     */
    const done = (): void => {
      clearTimeout(clock);
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
    };

    /**
     * Settles with the total when the reply answers this request, and ignores any other reply.
     */
    const onMessage = (event: MessageEvent<Reply>): void => {
      if (event.data.id !== id) return;

      done();
      settle(event.data.total);
    };

    /**
     * Rejects with what the worker reported.
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

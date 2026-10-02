/**
 * Runs a client's changes stream, and reconnects it after it drops.
 */

import { noop, type QueryClient } from "@tanstack/react-query";

import { type ChangeBatch, invalidateChanges } from "#changes.ts";
import { type DataSettings } from "#client.ts";
import { type NoVariables, type Operation } from "#operation.ts";
import { type Transport } from "#transport.ts";

/**
 * Describes a changes stream: the subscription and the transport it runs through.
 */
interface Stream {
  /**
   * The subscription whose events are change batches.
   */
  readonly changes: Operation<ChangeBatch, NoVariables, "subscription">;

  /**
   * The transport the subscription runs through.
   */
  readonly transport: Transport;
}

/**
 * Milliseconds before the first reconnection.
 */
const FIRST_WAIT = 1000;

/**
 * Milliseconds the wait before a reconnection grows to at most.
 */
const LONGEST_WAIT = 30_000;

/**
 * Share of a wait by which it varies either way, so pages that dropped together reconnect apart.
 */
const JITTER = 0.2;

/**
 * Returns the wait before a reconnection.
 *
 * @param attempt - Reconnections since the stream last delivered a batch, 1 for the first.
 * @param random - A number from 0 up to 1, which decides the variation.
 * @returns Milliseconds: 1 s doubled per attempt up to 30 s, varied by up to 20% either way.
 */
export function waitBefore(attempt: number, random: number): number {
  const wait = Math.min(FIRST_WAIT * 2 ** (attempt - 1), LONGEST_WAIT);

  return wait * (1 - JITTER + 2 * JITTER * random);
}

/**
 * Resolves after a delay, or at once when the signal aborts.
 *
 * @param delay - Milliseconds to wait.
 * @param signal - Signal that ends the wait early.
 * @returns A promise that resolves when either happens.
 */
function waited(delay: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, delay);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/**
 * Connects the stream once, after the wait its attempt calls for, and reads it until it ends.
 *
 * @remarks
 *   A reconnection invalidates every query first, because the changes made while the stream was
 *   down never arrived. The active queries refetch.
 * @param client - The data client.
 * @param stream - The subscription and the transport it runs through.
 * @param signal - Signal that stops the stream.
 * @param attempt - Reconnections since the stream last delivered a batch, 0 for the first
 *   connection.
 * @returns The attempt of the next connection.
 */
async function connected(
  client: QueryClient,
  stream: Stream,
  signal: AbortSignal,
  attempt: number,
): Promise<number> {
  if (attempt > 0) {
    await waited(waitBefore(attempt, Math.random()), signal);

    if (signal.aborted) return attempt;

    client.invalidateQueries().catch(noop);
  }

  let delivered = false;

  await stream.transport
    .subscribe(
      stream.changes,
      {},
      (batch) => {
        delivered = true;
        invalidateChanges(client, batch.changes).catch(noop);
      },
      signal,
    )
    .catch(noop);

  return delivered ? 1 : attempt + 1;
}

/**
 * Runs a client's changes stream until the signal aborts.
 *
 * @remarks
 *   Each batch invalidates the queries whose data its changes may make stale. After the stream ends
 *   or fails, it reconnects after 1 s, then twice as long each time up to 30 s, and once it
 *   delivers a batch the next wait is 1 s again.
 * @param client - The data client.
 * @param settings - The client's transport, and its changes subscription where it states one.
 * @param signal - Signal that stops the stream.
 * @returns A promise that resolves once the signal aborts, or at once without a subscription.
 */
export async function streamChanges(
  client: QueryClient,
  settings: DataSettings,
  signal: AbortSignal,
): Promise<void> {
  const { changes, transport } = settings;

  if (changes === undefined) return;

  let attempt = 0;

  while (!signal.aborted) {
    // eslint-disable-next-line no-await-in-loop -- one connection at a time, each after the one before it ended
    attempt = await connected(client, { changes, transport }, signal, attempt);
  }
}

/**
 * Builds transports whose changes stream runs a script, one connection per subscription.
 */

import { type Mock, vi } from "vitest";

import { type ChangeBatch } from "#changes.ts";
import { DataError } from "#errors.ts";
import { type Transport } from "#transport.ts";

/**
 * Types one connection of a script: what the stream sends, and when it ends.
 */
export type Connection = (next: (batch: ChangeBatch) => void, signal: AbortSignal) => Promise<void>;

/**
 * Types the subscribe function a scripted transport runs.
 */
type Subscribe = (
  operation: unknown,
  variables: unknown,
  next: (data: never) => void,
  signal: AbortSignal,
) => Promise<void>;

/**
 * Describes a transport whose subscriptions a case counts.
 */
export interface Scripted extends Transport {
  /**
   * The subscribe function, whose calls count the connections.
   */
  readonly subscribe: Mock<Subscribe>;
}

/**
 * A connection that sends nothing and ends when the signal aborts, as a quiet stream does.
 *
 * @param _next - Receives nothing.
 * @param signal - Signal that ends the connection.
 * @returns A promise that resolves once the signal aborts.
 */
export function quiet(_next: (batch: ChangeBatch) => void, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    signal.addEventListener("abort", () => {
      resolve();
    });
  });
}

/**
 * A connection that ends at once, as a stream the gateway closes does.
 *
 * @returns A resolved promise.
 */
export function ended(): Promise<void> {
  return Promise.resolve();
}

/**
 * A connection that fails at once, as a stream that cannot open does.
 *
 * @returns A rejected promise.
 */
export function failed(): Promise<void> {
  return Promise.reject(
    new DataError({ kind: "network", message: "offline", operation: "people~1~c4a9e2" }),
  );
}

/**
 * Builds a connection that sends a batch once the caller's current task is done, then ends.
 *
 * @param batch - The batch.
 * @returns The connection.
 */
export function delivering(batch: ChangeBatch): Connection {
  return async (next) => {
    await Promise.resolve();

    next(batch);
  };
}

/**
 * Creates a transport whose subscriptions run the script's connections in turn, then quiet ones.
 *
 * @param connections - The connections, in order.
 * @returns The transport.
 */
export function scripted(...connections: readonly Connection[]): Scripted {
  const waiting = [...connections];
  const subscribe = vi.fn<Subscribe>((_operation, _variables, next, signal) => {
    const connection = waiting.shift() ?? quiet;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the changes stream's events are change batches, which its subscription's type states
    return connection(next as (batch: ChangeBatch) => void, signal);
  });

  return { run: () => Promise.reject(new Error("The script runs no queries.")), subscribe };
}

/**
 * Describes the transport every operation of a data client runs through.
 */

import { type Operation } from "#operation.ts";

/**
 * Lists what one run of an operation may state beside its variables.
 */
export interface RunOptions {
  /**
   * Key that makes a retried mutation apply once. The foundation sets it for every mutation.
   */
  readonly idempotencyKey?: string | undefined;

  /**
   * Signal that cancels the request.
   */
  readonly signal?: AbortSignal | undefined;
}

/**
 * Sends operations to the service that runs them.
 */
export interface Transport {
  /**
   * Runs a query or a mutation, and resolves with its data.
   *
   * @throws {@link DataError} When the request fails or the service refuses it.
   */
  readonly run: <Data, Variables extends object>(
    operation: Operation<Data, Variables, "mutation" | "query">,
    variables: Variables,
    options?: RunOptions,
  ) => Promise<Data>;

  /**
   * Calls `next` with the data of each event of a subscription until the signal aborts, and
   * resolves when the stream ends.
   *
   * @throws {@link DataError} When the stream cannot open or ends with an error.
   */
  readonly subscribe: <Data, Variables extends object>(
    operation: Operation<Data, Variables, "subscription">,
    variables: Variables,
    next: (data: Data) => void,
    signal: AbortSignal,
  ) => Promise<void>;
}

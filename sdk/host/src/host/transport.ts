/**
 * Builds the transport the host's data client runs on: the product's, or one over the
 * declarations' samples, guarded to the operations the installed plugins declare, and announcing
 * each change to records it learns of.
 */

import {
  type Change,
  type ChangeBatch,
  type NoVariables,
  type Operation,
  type Transport,
} from "@stealthscale/provider-data";
import { sampledTransport } from "@stealthscale/provider-data/testing";
import { type ResolvedProduct } from "@stealthscale/sdk-core";
import { changesOf } from "@stealthscale/sdk-plugin";

/**
 * Lists the declarations a guarded transport reads.
 */
type Declared = Pick<ResolvedProduct, "mutations" | "queries">;

/**
 * Lists what a guarded transport is created from.
 */
export interface GuardOptions {
  /**
   * Receives the changes of each declared mutation that succeeded, and of each batch the changes
   * stream delivers.
   */
  readonly changed: (changes: readonly Change[]) => void;

  /**
   * The product's changes subscription: the one subscription the transport runs.
   */
  readonly changes?: Operation<ChangeBatch, NoVariables, "subscription"> | undefined;

  /**
   * The declared queries and mutations.
   */
  readonly product: Declared;

  /**
   * The product's transport. One over the declarations' samples where left out.
   */
  readonly transport?: Transport | undefined;
}

/**
 * Returns a transport that serves each declared query and mutation with its sample's data.
 */
export function sampledFrom(product: Declared): Transport {
  return sampledTransport(
    Object.fromEntries(
      [...product.queries, ...product.mutations].map(({ operation, sample }) => [
        operation.id,
        { data: sample.data },
      ]),
    ),
  );
}

/**
 * Returns the error of an operation no installed plugin declares.
 */
function undeclared(id: string): Error {
  return new Error(`No installed plugin declares the operation ${id}.`);
}

/**
 * Returns true for the data of one event of the changes stream.
 */
function isBatch(data: unknown): data is ChangeBatch {
  return (
    typeof data === "object" && data !== null && "changes" in data && Array.isArray(data.changes)
  );
}

/**
 * Returns the transport the host's data client runs on.
 *
 * @remarks
 *   The transport refuses an operation no installed plugin declares, and every subscription but
 *   the product's changes stream. A declared mutation that resolves announces the changes its
 *   declarations name for its variables. Each batch of the stream is announced after the client
 *   received it.
 */
export function guardedTransport({
  changed,
  changes,
  product,
  transport = sampledFrom(product),
}: GuardOptions): Transport {
  const declared = new Set(
    [...product.queries, ...product.mutations].map(({ operation }) => operation.id),
  );

  return {
    run: async (operation, variables, options) => {
      if (!declared.has(operation.id)) throw undeclared(operation.id);

      const data = await transport.run(operation, variables, options);
      const made = product.mutations
        .filter((mutation) => mutation.operation.id === operation.id)
        .flatMap((mutation) => changesOf(mutation.changes, variables));

      if (made.length > 0) changed(made);

      return data;
    },
    subscribe: (operation, variables, next, signal) => {
      if (operation.id !== changes?.id) return Promise.reject(undeclared(operation.id));

      return transport.subscribe(
        operation,
        variables,
        (data) => {
          next(data);

          if (isBatch(data)) changed(data.changes);
        },
        signal,
      );
    },
  };
}

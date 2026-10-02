/**
 * Serves a standalone product's operations as the development panel sets each one: from its
 * sample, from its sample after a delay, or with a refusal of one kind.
 */

import { DataError, type DataErrorKind, type Transport } from "@stealthscale/provider-data";
import { type ResolvedProduct } from "@stealthscale/sdk-core";

import { sampledFrom } from "#host/transport.ts";

/**
 * Lists how the panel serves one operation: its sample, its sample after a delay, or a refusal of
 * one kind.
 */
export type OperationMode = "delayed" | "sample" | DataErrorKind;

/**
 * Lists every mode, in the order the panel offers them.
 */
export const MODES: readonly OperationMode[] = [
  "sample",
  "delayed",
  "conflict",
  "forbidden",
  "invalid",
  "network",
  "not-found",
  "server",
  "unauthenticated",
];

/**
 * The milliseconds a delayed operation waits before it serves its sample.
 */
export const DELAY = 2000;

/**
 * Describes the mode the panel set for each operation, with the listeners each change calls.
 */
export interface OperationModes {
  /**
   * Returns the mode of each operation the panel set one for, by operation id.
   */
  readonly get: () => Readonly<Record<string, OperationMode>>;

  /**
   * Sets the mode of one operation, and calls every listener.
   */
  readonly set: (id: string, mode: OperationMode) => void;

  /**
   * Calls the listener after each change. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}

/**
 * Returns the operation modes of one page, every operation at its sample until the panel sets
 * another mode.
 */
export function operationModes(): OperationModes {
  let modes: Readonly<Record<string, OperationMode>> = {};
  const listeners = new Set<() => void>();

  return {
    get: () => modes,
    set: (id, mode) => {
      modes = { ...modes, [id]: mode };

      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Returns a transport that serves each declared operation in the mode the panel set for it when it
 * runs.
 *
 * @remarks
 *   A delayed operation serves its sample after `DELAY`. A refused one rejects with a `DataError`
 *   of the mode's kind, so the page renders the error state the kind leads to. A subscription
 *   streams nothing, as the sampled transport's does.
 * @param product - The declared queries and mutations, whose samples the transport serves.
 * @param modes - The mode of each operation.
 */
export function standaloneTransport(
  product: Pick<ResolvedProduct, "mutations" | "queries">,
  modes: OperationModes,
): Transport {
  const sampled = sampledFrom(product);

  return {
    run: async (operation, variables, options) => {
      const mode = modes.get()[operation.id] ?? "sample";

      if (mode === "delayed") {
        await new Promise((resolve) => {
          setTimeout(resolve, DELAY);
        });
      } else if (mode !== "sample") {
        throw new DataError({
          kind: mode,
          message: `The development panel refuses ${operation.id} as ${mode}.`,
          operation: operation.id,
        });
      }

      return sampled.run(operation, variables, options);
    },
    subscribe: (operation, variables, next, signal) =>
      sampled.subscribe(operation, variables, next, signal),
  };
}

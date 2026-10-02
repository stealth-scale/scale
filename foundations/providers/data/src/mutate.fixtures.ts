/**
 * Builds the clients the specification of `mutateOperation` runs the rename through.
 */

import { type QueryClient } from "@tanstack/react-query";
import { type MockInstance, vi } from "vitest";

import { createDataClient } from "#client.ts";
import { DataError } from "#errors.ts";
import { AUGUSTA } from "#mutation.fixtures.ts";
import { RENAME } from "#operation.fixtures.ts";
import { createTestDataClient, sampledTransport } from "#testing.ts";
import { type Transport } from "#transport.ts";

/**
 * Describes a client the rename runs through, and a spy on its transport.
 */
export interface Mutating {
  /**
   * The client.
   */
  readonly client: QueryClient;

  /**
   * A spy on the transport's `run`.
   */
  readonly run: MockInstance<Transport["run"]>;
}

/**
 * Creates a test client whose transport returns the renamed person.
 *
 * @returns The client and the transport's spy.
 */
export function mutating(): Mutating {
  const transport = sampledTransport({ [RENAME.id]: { data: AUGUSTA } });
  const run = vi.spyOn(transport, "run");

  return { client: createTestDataClient(transport), run };
}

/**
 * Creates a client with the foundation's retries, whose transport fails once as `network` and then
 * returns the renamed person.
 *
 * @returns The client and the transport's spy.
 */
export function retrying(): Mutating {
  const transport = sampledTransport({ [RENAME.id]: { data: AUGUSTA } });
  const offline = new DataError({ kind: "network", message: "offline", operation: RENAME.id });
  const run = vi.spyOn(transport, "run").mockRejectedValueOnce(offline);

  return {
    client: createDataClient({ defaultOptions: { mutations: { retryDelay: 0 } }, transport }),
    run,
  };
}

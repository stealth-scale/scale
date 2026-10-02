/**
 * Renders the rename's mutation hook over transports the mutation's specification watches.
 */

import { type QueryClient } from "@tanstack/react-query";
import { type MockInstance, vi } from "vitest";

import { hookOf } from "#client.fixtures.tsx";
import { createDataClient } from "#client.ts";
import { DataError } from "#errors.ts";
import {
  type OperationMutationOptions,
  type OperationMutationResult,
  useOperationMutation,
} from "#mutation.ts";
import {
  LISTED,
  ONE,
  PEOPLE,
  PERSON,
  type Person,
  PERSON_KIND,
  RENAME,
} from "#operation.fixtures.ts";
import { operationQuery } from "#queries.ts";
import { type RecordPatch } from "#resources.ts";
import { createTestDataClient, sampledTransport } from "#testing.ts";
import { type Transport } from "#transport.ts";

/**
 * Describes the rename's hook, rendered over a transport the case watches.
 */
export interface Renamed {
  /**
   * The client the hook runs the mutation with.
   */
  readonly client: QueryClient;

  /**
   * The hook's latest result.
   */
  readonly result: { readonly current: OperationMutationResult<Person, Person> };

  /**
   * A spy on the transport's `run`.
   */
  readonly run: MockInstance<Transport["run"]>;
}

/**
 * Ada, renamed.
 */
export const AUGUSTA: Person = { id: "7", name: "Augusta" };

/**
 * The options of the query that reads Ada.
 */
export const ONE_PERSON = operationQuery(PERSON, { id: "7" }, { resources: [ONE] });

/**
 * The options of the query that lists people.
 */
export const EVERYONE = operationQuery(PEOPLE, {}, { resources: [LISTED] });

/**
 * A refusal of the rename.
 */
export const PRIVATE = new DataError({
  kind: "forbidden",
  message: "private",
  operation: RENAME.id,
});

/**
 * Builds the patch that renames a person in every query that shows the person.
 *
 * @param variables - The rename's variables.
 * @returns The patch.
 */
export function renaming(variables: Person): readonly RecordPatch[] {
  return [
    {
      apply: (record) => ({ ...record, name: variables.name }),
      id: variables.id,
      type: PERSON_KIND,
    },
  ];
}

/**
 * Creates a client whose transport returns the renamed person, and renders the rename's hook.
 *
 * @param options - The hook's options.
 * @returns The client, the transport's spy and the rendered hook.
 */
export function renamed(options: OperationMutationOptions<Person, Person> = {}): Renamed {
  const transport = sampledTransport({ [RENAME.id]: { data: AUGUSTA } });
  const run = vi.spyOn(transport, "run");
  const client = createTestDataClient(transport);
  const { result } = hookOf(() => useOperationMutation(RENAME, options), client);

  return { client, result, run };
}

/**
 * Renders the rename's hook over a client with the foundation's retries, whose transport fails
 * once as `network` and then returns the renamed person.
 *
 * @returns The client, the transport's spy and the rendered hook.
 */
export function retried(): Renamed {
  const transport = sampledTransport({ [RENAME.id]: { data: AUGUSTA } });
  const offline = new DataError({ kind: "network", message: "offline", operation: RENAME.id });
  const run = vi.spyOn(transport, "run").mockRejectedValueOnce(offline);
  const client = createDataClient({ defaultOptions: { mutations: { retryDelay: 0 } }, transport });
  const { result } = hookOf(() => useOperationMutation(RENAME), client);

  return { client, result, run };
}

/**
 * Runs an operation's mutation with a fresh idempotency key per call, an optimistic patch, and
 * invalidation by resource once it settles.
 */

import {
  type DistributiveOmit,
  type MutateOptions,
  type QueryClient,
  type QueryKey,
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import { type Change, invalidateChanges } from "#changes.ts";
import { settingsOf } from "#client.ts";
import { type DataError } from "#errors.ts";
import { type Operation } from "#operation.ts";
import { isOperationKey, OPERATION, resourcesOf } from "#queries.ts";
import {
  containsRecord,
  patchRecords,
  type RecordPatch,
  type ResourceRef,
  type ResourceSelector,
} from "#resources.ts";

/**
 * Lists what a mutation states beside its operation.
 */
export interface OperationMutationOptions<Data, Variables> {
  /**
   * The records the mutation changes, invalidated once it settles.
   */
  readonly changes?:
    | ((variables: Variables, data: Data | undefined) => readonly Change[])
    | undefined;

  /**
   * The patches to apply at once to every query whose data contains a patched record.
   */
  readonly optimistic?: ((variables: Variables) => readonly RecordPatch[]) | undefined;

  /**
   * Scope whose mutations run one at a time, in the order they started, such as a record's id.
   */
  readonly scope?: string | undefined;
}

/**
 * Types the variables the library runs a mutation with: the caller's variables and the key that
 * makes a retry apply once.
 */
export interface KeyedVariables<Variables> {
  /**
   * Key the transport sends as `Idempotency-Key`, the same on every retry.
   */
  readonly idempotencyKey: string;

  /**
   * The caller's variables.
   */
  readonly variables: Variables;
}

/**
 * Types the library's result of a mutation that runs with keyed variables.
 */
type KeyedResult<D, V> = UseMutationResult<D, DataError, KeyedVariables<V>>;

/**
 * Types the options one call of `mutate` takes.
 */
export type OperationMutateOptions<D, V> = MutateOptions<D, DataError, KeyedVariables<V>>;

/**
 * Lists the members of the library's result that `useOperationMutation` replaces.
 */
type Replaced = "mutate" | "mutateAsync";

/**
 * Describes the functions that run a mutation with the caller's variables.
 */
interface Mutating<D, V> {
  /**
   * Runs the mutation with a fresh idempotency key, and reports through the result's state.
   */
  readonly mutate: (variables: V, options?: OperationMutateOptions<D, V>) => void;

  /**
   * Runs the mutation with a fresh idempotency key, and resolves with its data.
   */
  readonly mutateAsync: (variables: V, options?: OperationMutateOptions<D, V>) => Promise<D>;
}

/**
 * Types what `useOperationMutation` returns. `mutate` and `mutateAsync` take the caller's
 * variables.
 */
export type OperationMutationResult<D, V> = DistributiveOmit<KeyedResult<D, V>, Replaced> &
  Mutating<D, V>;

/**
 * Describes what an optimistic patch changed, so a refusal writes it back.
 */
interface Snapshot {
  /**
   * The data of each patched query before the patch, by the query's key.
   */
  readonly copies: ReadonlyArray<readonly [QueryKey, unknown]>;

  /**
   * The records the patches changed, which the settled mutation invalidates.
   */
  readonly records: readonly ResourceRef[];
}

/**
 * Returns the function that runs one keyed call of an operation's mutation through the client's
 * transport.
 *
 * @remarks
 *   The function sends the call's idempotency key, which the library passes again with the same
 *   variables object on every retry. `useOperationMutation` and `mutateOperation` both run their
 *   calls through it.
 * @param client - The data client, whose transport runs the operation.
 * @param operation - The mutation operation.
 * @returns The library's `mutationFn` for the operation.
 */
export function runnerOf<Data, Variables extends object>(
  client: QueryClient,
  operation: Operation<Data, Variables, "mutation">,
): (keyed: KeyedVariables<Variables>) => Promise<Data> {
  return (keyed) =>
    settingsOf(client).transport.run(operation, keyed.variables, {
      idempotencyKey: keyed.idempotencyKey,
    });
}

/**
 * Returns data with every patch applied through a query's selectors.
 *
 * @param data - The query's data.
 * @param selectors - The query's resource selectors.
 * @param patches - The patches, applied in order.
 * @returns The patched data.
 */
function patchedAll(
  data: unknown,
  selectors: readonly ResourceSelector[],
  patches: readonly RecordPatch[],
): unknown {
  let after = data;

  for (const patch of patches) after = patchRecords(after, selectors, patch);

  return after;
}

/**
 * Applies patches to every query whose data contains a patched record, and keeps the data before.
 *
 * @remarks
 *   The fetches of those queries are cancelled first, so a response that was on its way cannot
 *   write over the patch.
 * @param client - The data client.
 * @param patches - Each changed record, with its change.
 * @returns The data before the patches, and the records they changed.
 */
async function applied(client: QueryClient, patches: readonly RecordPatch[]): Promise<Snapshot> {
  const queries = client.getQueryCache().findAll({
    predicate: (query) =>
      isOperationKey(query.queryKey) &&
      patches.some((patch) => containsRecord(query.state.data, resourcesOf(query), patch)),
  });

  await client.cancelQueries({ predicate: (query) => queries.includes(query) });

  const copies = queries.map((query) => [query.queryKey, query.state.data] as const);

  for (const query of queries) {
    client.setQueryData(query.queryKey, (data: unknown) =>
      patchedAll(data, resourcesOf(query), patches),
    );
  }

  return { copies, records: patches.map(({ id, type }) => ({ id, type })) };
}

/**
 * Writes back the data an optimistic patch replaced.
 *
 * @param client - The data client.
 * @param snapshot - The data before the patch, or undefined where the mutation states no patch.
 */
function restored(client: QueryClient, snapshot: Snapshot | undefined): void {
  for (const [key, data] of snapshot?.copies ?? []) client.setQueryData(key, data);
}

/**
 * Returns the changes a settled mutation invalidates: its patched records, then its stated changes.
 *
 * @param snapshot - The records the patch changed, or undefined where the mutation states no
 *   patch.
 * @param stated - The changes the mutation states for its variables and data.
 * @returns Every change, the patched records first.
 */
function settledChanges(
  snapshot: Snapshot | undefined,
  stated: readonly Change[] | undefined,
): Change[] {
  const records = snapshot?.records ?? [];

  return [
    ...records.map(({ id, type }): Change => ({ action: "updated", id, type })),
    ...(stated ?? []),
  ];
}

/**
 * Runs a mutation, with a fresh idempotency key for each call and the same key on its retry.
 *
 * @remarks
 *   The key is generated with `crypto.randomUUID()` when `mutate` is called and travels beside the
 *   variables, because the library runs every retry, and resumes a paused mutation, with the same
 *   variables object. The mutation is keyed `["operation", id]`, which `useMutationState` filters
 *   by. Once it settles either way, the patched records and the stated changes are invalidated.
 * @param operation - The mutation operation the hook runs.
 * @param options - The changes, the optimistic patches and the scope, where stated.
 * @returns The library's result, with `mutate` and `mutateAsync` over the caller's variables.
 */
export function useOperationMutation<Data, Variables extends object>(
  operation: Operation<Data, Variables, "mutation">,
  options: OperationMutationOptions<Data, Variables> = {},
): OperationMutationResult<Data, Variables> {
  const { changes, optimistic, scope } = options;
  const client = useQueryClient();
  const { mutate, mutateAsync, ...rest } = useMutation<
    Data,
    DataError,
    KeyedVariables<Variables>,
    Snapshot | undefined
  >({
    mutationFn: runnerOf(client, operation),
    mutationKey: [OPERATION, operation.id],
    onError: (_error, _keyed, snapshot) => {
      restored(client, snapshot);
    },
    onMutate: (keyed) =>
      optimistic === undefined ? undefined : applied(client, optimistic(keyed.variables)),
    onSettled: (data, _error, keyed, snapshot) =>
      invalidateChanges(client, settledChanges(snapshot, changes?.(keyed.variables, data))),
    ...(scope === undefined ? {} : { scope: { id: scope } }),
  });

  return {
    ...rest,
    mutate: (variables, mutateOptions) => {
      mutate({ idempotencyKey: crypto.randomUUID(), variables }, mutateOptions);
    },
    mutateAsync: (variables, mutateOptions) =>
      mutateAsync({ idempotencyKey: crypto.randomUUID(), variables }, mutateOptions),
  };
}

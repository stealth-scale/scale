/**
 * Reads a declared query's data and runs a declared mutation in a component, with the
 * declarations of the resolved product applied.
 *
 * @remarks
 *   A component names a query or a mutation by reference, and the resolved product supplies its
 *   operation id, its record selectors, its fresh time and its changes. A page's loader builds the
 *   same query, so the page reads its data from the cache the preload filled.
 */

import {
  defineMutation,
  defineQuery,
  type OperationMutationResult,
  operationQuery,
  type RecordPatch,
  useOperationMutation,
  useSuspenseQuery,
} from "@stealthscale/provider-data";
import {
  type MutationData,
  type MutationReference,
  type MutationVariables,
  type QueryData,
  type QueryReference,
  type QueryVariables,
  type ResolvedMutation,
  type ResolvedProduct,
  type ResolvedQuery,
} from "@stealthscale/sdk-core";

import { changesOf } from "#data/changes.ts";
import { useHost } from "#host/use-host.ts";

/**
 * Lists what a component states when it runs a declared mutation.
 */
export interface ChangeOptions<M extends MutationReference> {
  /**
   * The patches to apply at once to every query whose data contains a patched record.
   */
  readonly optimistic?: ((variables: MutationVariables<M>) => readonly RecordPatch[]) | undefined;

  /**
   * Scope whose mutations run one at a time, in the order they started, such as a record's id.
   */
  readonly scope?: string | undefined;
}

/**
 * Returns the query an installed plugin declares under an id.
 *
 * @throws {@link Error} Where no installed plugin declares it.
 */
function declaredQuery(product: ResolvedProduct, id: string): ResolvedQuery {
  const found = product.queries.find((one) => one.id === id);

  if (found === undefined) {
    throw new Error(`useData() found no installed plugin that declares the query ${id}.`);
  }

  return found;
}

/**
 * Returns the mutation an installed plugin declares under an id.
 *
 * @throws {@link Error} Where no installed plugin declares it.
 */
function declaredMutation(product: ResolvedProduct, id: string): ResolvedMutation {
  const found = product.mutations.find((one) => one.id === id);

  if (found === undefined) {
    throw new Error(`useChange() found no installed plugin that declares the mutation ${id}.`);
  }

  return found;
}

/**
 * Returns a declared query's data, suspends until it arrives, and renders again when it changes.
 *
 * @remarks
 *   A component that reads an optional plugin's query checks the plugin with `useWhen` first,
 *   because the hook throws for a query no installed plugin declares.
 * @param query - The query, by reference.
 * @param variables - The variables the query runs with.
 * @throws {@link Error} Where no installed plugin declares the query.
 */
export function useData<Q extends QueryReference>(
  query: Q,
  variables: QueryVariables<Q>,
): QueryData<Q> {
  const declared = declaredQuery(useHost("useData").product, query.id);
  const { data } = useSuspenseQuery(
    operationQuery(defineQuery<QueryData<Q>, QueryVariables<Q>>(declared.operation.id), variables, {
      resources: declared.records,
      staleTime: declared.staleTime,
    }),
  );

  return data;
}

/**
 * Returns the functions that run a declared mutation, and its state.
 *
 * @remarks
 *   Once a run settles, the data client invalidates the records its declared changes name and the
 *   records its optimistic patches changed.
 * @param mutation - The mutation, by reference.
 * @param options - The optimistic patches and the scope, where stated.
 * @throws {@link Error} Where no installed plugin declares the mutation.
 */
export function useChange<M extends MutationReference>(
  mutation: M,
  options: ChangeOptions<M> = {},
): OperationMutationResult<MutationData<M>, MutationVariables<M>> {
  const declared = declaredMutation(useHost("useChange").product, mutation.id);

  return useOperationMutation(
    defineMutation<MutationData<M>, MutationVariables<M>>(declared.operation.id),
    {
      changes: (variables) => changesOf(declared.changes, variables),
      optimistic: options.optimistic,
      scope: options.scope,
    },
  );
}

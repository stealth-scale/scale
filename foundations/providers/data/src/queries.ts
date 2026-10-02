/**
 * Builds the library's query options for an operation, and reads back what those options state.
 */

import {
  type Query,
  type QueryKey,
  type QueryKeyWithDataTag,
  queryOptions,
  type UnusedSkipTokenOptions,
} from "@tanstack/react-query";

import { type DataError } from "#errors.ts";
import { type Operation } from "#operation.ts";
import { isRecord } from "#record.ts";
import { type ResourceSelector } from "#resources.ts";

/**
 * First member of every operation's cache key and mutation key, which keeps operations apart from
 * any other query or mutation.
 */
export const OPERATION = "operation";

/**
 * Member of a query's `meta` that contains its resource selectors.
 */
const RESOURCES = "resources";

/**
 * Types an operation's cache key: `["operation", id, variables]`.
 */
export type OperationKey = readonly ["operation", string, object];

/**
 * Lists what a query states beside its operation and variables.
 */
export interface OperationQueryOptions<Data, Selected> {
  /**
   * The records the data contains, which invalidation by resource reads.
   */
  readonly resources?: readonly ResourceSelector[] | undefined;

  /**
   * Derives what a component reads from the data, such as a filtered and ordered list.
   */
  readonly select?: ((data: Data) => Selected) | undefined;

  /**
   * Milliseconds the data is fresh, or `"static"` for data that never changes.
   */
  readonly staleTime?: "static" | number | undefined;
}

/**
 * Types the options `operationQuery` builds, which are the options the library's `queryOptions`
 * returns for the operation's key.
 */
export type OperationQuery<D, S> = QueryKeyWithDataTag<OperationKey, D, DataError> &
  UnusedSkipTokenOptions<D, DataError, S, OperationKey>;

/**
 * Returns an operation's cache key.
 *
 * @param operation - The operation, of which the key names the id.
 * @param variables - Its variables, which the library hashes with their members sorted.
 * @returns The key: `["operation", id, variables]`.
 */
export function operationKey(
  operation: Operation<unknown, object>,
  variables: object,
): OperationKey {
  return [OPERATION, operation.id, variables];
}

/**
 * Returns true for the cache key of an operation.
 *
 * @param key - A query's key, whatever query it belongs to.
 * @returns True where the key is `["operation", id, variables]` with an object as its variables.
 */
export function isOperationKey(
  key: QueryKey,
): key is readonly ["operation", string, Readonly<Record<string, unknown>>] {
  return key.length === 3 && key[0] === OPERATION && typeof key[1] === "string" && isRecord(key[2]);
}

/**
 * Builds the library's query options for one operation and its variables.
 *
 * @remarks
 *   The options state no `queryFn`, because the client's default runs the operation the key names.
 *   The resource selectors go in `meta`, which the library dehydrates and restores with the data,
 *   so invalidation by resource applies to a hydrated query too.
 * @param operation - The query operation the options run.
 * @param variables - Its variables.
 * @param options - The records the data contains, a `select` and a fresh time.
 * @returns Options for the library's hooks and for `client.query`.
 */
export function operationQuery<Data, Variables extends object, Selected = Data>(
  operation: Operation<Data, Variables, "query">,
  variables: Variables,
  options: OperationQueryOptions<Data, Selected> = {},
): OperationQuery<Data, Selected> {
  return queryOptions<Data, DataError, Selected, OperationKey>({
    meta: { [RESOURCES]: options.resources ?? [] },
    queryKey: operationKey(operation, variables),
    ...(options.select === undefined ? {} : { select: options.select }),
    ...(options.staleTime === undefined ? {} : { staleTime: options.staleTime }),
  });
}

/**
 * Returns the resource selectors an operation's query states.
 *
 * @param query - A query whose key is an operation's.
 * @returns The selectors, or none for a query built without `operationQuery`.
 */
export function resourcesOf(query: Pick<Query, "meta">): readonly ResourceSelector[] {
  const stated: unknown = query.meta?.[RESOURCES];

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- operationQuery writes the member typed, and hydration restores what a server's operationQuery wrote
  return Array.isArray(stated) ? (stated as readonly ResourceSelector[]) : [];
}

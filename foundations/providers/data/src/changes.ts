/**
 * Describes changes to records, and invalidates the queries whose data a change may make stale.
 */

import { type Query, type QueryClient } from "@tanstack/react-query";

import { isOperationKey, resourcesOf } from "#queries.ts";
import { containsRecord, type ResourceRef } from "#resources.ts";

/**
 * Describes a change to one record.
 */
export interface Change extends ResourceRef {
  /**
   * Whether the record was created, deleted or updated.
   */
  readonly action: "created" | "deleted" | "updated";
}

/**
 * Lists the changes one event of the changes stream reports.
 */
export interface ChangeBatch {
  /**
   * Each change, in the order the services made them.
   */
  readonly changes: readonly Change[];
}

/**
 * Returns true where a change may make an operation's query stale.
 *
 * @param query - A query whose key is an operation's.
 * @param change - The record that changed, and how.
 * @returns True for a list of the kind a record joins, or for data that contains the changed
 *   record.
 */
function affects(query: Query, change: Change): boolean {
  const selectors = resourcesOf(query);

  if (change.action === "created") {
    return selectors.some((selector) => selector.type === change.type && selector.list === true);
  }

  return containsRecord(query.state.data, selectors, change);
}

/**
 * Invalidates every query whose data a change may make stale, and refetches the active ones.
 *
 * @remarks
 *   An updated or deleted record invalidates every query whose selectors find it. A created record
 *   invalidates every list of its kind, because its place in a list is the service's to decide. An
 *   inactive query refetches when a component reads it again.
 * @param client - The data client.
 * @param changes - The changes, which contain ids alone.
 * @returns A promise that settles once the active queries refetched.
 */
export function invalidateChanges(client: QueryClient, changes: readonly Change[]): Promise<void> {
  return client.invalidateQueries({
    predicate: (query) =>
      isOperationKey(query.queryKey) && changes.some((change) => affects(query, change)),
  });
}

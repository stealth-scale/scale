/**
 * Puts queries into a client's cache for the specifications that read or change them.
 */

import { type Query, type QueryClient, type QueryKey } from "@tanstack/react-query";

/**
 * Describes the options a specification builds a query from.
 */
interface Building {
  /**
   * Data the query starts with, as a caller's `initialData` states it.
   */
  readonly initialData?: unknown;

  /**
   * The query's `meta`, which the query keeps.
   */
  readonly meta?: Record<string, unknown>;

  /**
   * The query's key.
   */
  readonly queryKey: QueryKey;
}

/**
 * Builds a query from its options without fetching it.
 *
 * @param client - The client whose cache receives the query.
 * @param options - The query's key, its `meta` and its initial data.
 * @returns The query.
 */
export function built(client: QueryClient, options: Building): Query {
  return client.getQueryCache().build(client, { ...options });
}

/**
 * Builds a query from its options and writes data into it, as a fetch would leave it.
 *
 * @param client - The client whose cache receives the query.
 * @param options - The query's key and its `meta`.
 * @param data - The data.
 * @returns The query.
 */
export function cached(client: QueryClient, options: Building, data: unknown): Query {
  const query = built(client, options);

  query.setData(data);

  return query;
}

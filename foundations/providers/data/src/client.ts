/**
 * Creates the query client of one page, or of one request on a server, with the foundation's
 * defaults over the library's.
 */

import {
  type DefaultOptions,
  MutationCache,
  type Query,
  QueryCache,
  type QueryCacheNotifyEvent,
  QueryClient,
  type QueryFunction,
} from "@tanstack/react-query";

import { type ChangeBatch } from "#changes.ts";
import { DataError, type DataErrorKind } from "#errors.ts";
import { type NoVariables, type Operation } from "#operation.ts";
import { isOperationKey, resourcesOf } from "#queries.ts";
import { type ResourceSelector } from "#resources.ts";
import { type Transport } from "#transport.ts";

/**
 * Describes data that arrived from the gateway for one query.
 */
export interface OperationData {
  /**
   * The data the gateway returned.
   */
  readonly data: unknown;

  /**
   * Id of the query's operation.
   */
  readonly operation: string;

  /**
   * The records the data contains, as the query stated them.
   */
  readonly resources: readonly ResourceSelector[];

  /**
   * The variables the query ran with.
   */
  readonly variables: Readonly<Record<string, unknown>>;
}

/**
 * Describes the options a data client is created with.
 */
export interface DataClientOptions {
  /**
   * The subscription that streams changes to records. No stream where left out.
   */
  readonly changes?: Operation<ChangeBatch, NoVariables, "subscription"> | undefined;

  /**
   * Options over the foundation's defaults, in the library's form.
   */
  readonly defaultOptions?: DefaultOptions | undefined;

  /**
   * Called when a query's data arrives from the gateway, after a fetch or when the page hydrates
   * the server's data.
   */
  readonly onData?: ((arrival: OperationData) => void) | undefined;

  /**
   * Called when the gateway refuses the renewed token. The application sends the person to sign in.
   */
  readonly onUnauthenticated?: (() => void) | undefined;

  /**
   * The transport every operation runs through.
   */
  readonly transport: Transport;
}

/**
 * Describes what a client runs its operations with, which the mutation hook and the provider read.
 */
export interface DataSettings {
  /**
   * The subscription that streams changes to records, where the client states one.
   */
  readonly changes?: Operation<ChangeBatch, NoVariables, "subscription"> | undefined;

  /**
   * The transport every operation runs through.
   */
  readonly transport: Transport;
}

/**
 * The settings of each client `createDataClient` created.
 */
const SETTINGS = new WeakMap<QueryClient, DataSettings>();

/**
 * Milliseconds a query's data is fresh, so hydrated data is not fetched again at once.
 */
const STALE_TIME = 30_000;

/**
 * Returns true for a data error of one of the kinds.
 *
 * @param error - The value an operation rejected with.
 * @param kinds - The kinds to accept.
 * @returns True where the error is a `DataError` of one of the kinds.
 */
function isKind(error: unknown, kinds: readonly DataErrorKind[]): boolean {
  return error instanceof DataError && kinds.includes(error.kind);
}

/**
 * Returns true where a query tries again: twice at most, for `network` and `server` alone.
 *
 * @param failures - Failures of the fetch so far, before this one.
 * @param error - Why the last attempt failed.
 * @returns True for another attempt.
 */
function retriesQuery(failures: number, error: unknown): boolean {
  return failures < 2 && isKind(error, ["network", "server"]);
}

/**
 * Returns true where a mutation tries again: once, for `network` alone.
 *
 * @remarks
 *   The retry sends the same idempotency key, so the gateway applies the change once.
 * @param failures - Failures of the mutation so far, before this one.
 * @param error - Why the last attempt failed.
 * @returns True for another attempt.
 */
function retriesMutation(failures: number, error: unknown): boolean {
  return failures < 1 && isKind(error, ["network"]);
}

/**
 * Returns true for a query the server writes into the page: one that succeeded, or that is pending
 * with no failed attempt.
 *
 * @remarks
 *   The library copies a query's state as it is, its error included, so a query that failed or is
 *   retrying is left out of the page and the browser fetches it again.
 */
function isDehydrated(query: Query): boolean {
  const { fetchFailureCount, status } = query.state;

  return status === "success" || (status === "pending" && fetchFailureCount === 0);
}

/**
 * Returns the query function that runs the operation a query's key names.
 *
 * @param transport - The transport the operation runs through.
 * @returns The function every query without a `queryFn` of its own runs.
 * @throws {@link Error} When the key names no operation.
 */
function fetcherOf(transport: Transport): QueryFunction {
  return ({ queryKey, signal }) => {
    if (!isOperationKey(queryKey)) {
      throw new Error(
        `The query ${JSON.stringify(queryKey)} states no queryFn, and its key names no operation.`,
      );
    }

    return transport.run({ id: queryKey[1], kind: "query" }, queryKey[2], { signal });
  };
}

/**
 * Returns true where a cache event wrote data that a fetch or a server render delivered.
 *
 * @remarks
 *   A fetch dispatches `success`, and `setQueryData` marks its own `success` as `manual`, so an
 *   optimistic patch never counts. Hydration builds a missing query with its data, or writes newer
 *   data with `setState`. A cancelled fetch also writes with `setState`, restoring data the client
 *   saw before, so a `setState` counts only with data newer than the last the query wrote.
 * @param event - The cache's event.
 * @param seen - When the query's data was last written, where it was.
 * @returns True for data that arrived from the gateway.
 */
function arrived(event: QueryCacheNotifyEvent, seen: number | undefined): boolean {
  const { query } = event;

  if (event.type === "added") {
    return query.state.data !== undefined && query.options.initialData === undefined;
  }

  if (event.type !== "updated") return false;

  const { action } = event;

  if (action.type === "success") return action.manual !== true;

  return (
    action.type === "setState" &&
    action.state.data !== undefined &&
    query.state.dataUpdatedAt > (seen ?? 0)
  );
}

/**
 * Calls `onData` for each arrival of an operation's data, through the query cache's events.
 *
 * @remarks
 *   The cache's `onSuccess` runs after a fetch alone, so it would miss every query the page
 *   hydrates. The cache calls its listeners synchronously, inside its notification batch.
 * @param client - The client whose query cache the function listens to.
 * @param onData - Receives each arrival.
 */
function watch(client: QueryClient, onData: (arrival: OperationData) => void): void {
  const seen = new WeakMap<object, number>();

  client.getQueryCache().subscribe((event) => {
    // eslint-disable-next-line typescript/no-unsafe-assignment -- the library types an event's query with any, and the listener reads its data as unknown
    const query: Query<unknown, unknown, unknown> = event.query;
    const { queryKey } = query;

    if (!isOperationKey(queryKey)) return;

    const arrival = arrived(event, seen.get(query));

    if (arrival || (event.type === "updated" && event.action.type === "success")) {
      seen.set(query, query.state.dataUpdatedAt);
    }

    if (arrival) {
      onData({
        data: query.state.data,
        operation: queryKey[1],
        resources: resourcesOf(query),
        variables: queryKey[2],
      });
    }
  });
}

/**
 * Creates the query client of one page, or of one request on a server.
 *
 * @remarks
 *   Queries are fresh for 30 s and retry twice for `network` and `server` alone. Mutations retry
 *   once for `network` alone. A refusal as `unauthenticated` from any query or mutation calls
 *   `onUnauthenticated`. The stated `defaultOptions` apply over each of these.
 * @param options - The transport, and the changes stream, the callbacks and the defaults where
 *   stated.
 * @returns The client, which `DataProvider` renders.
 */
export function createDataClient(options: DataClientOptions): QueryClient {
  const stated = options.defaultOptions;
  const { onUnauthenticated } = options;

  /**
   * Calls `onUnauthenticated` for a refusal of the session, from any query or mutation.
   */
  const refused = (error: unknown): void => {
    if (isKind(error, ["unauthenticated"])) onUnauthenticated?.();
  };
  const client = new QueryClient({
    defaultOptions: {
      ...stated,
      dehydrate: { shouldDehydrateQuery: isDehydrated, ...stated?.dehydrate },
      mutations: { retry: retriesMutation, ...stated?.mutations },
      queries: {
        queryFn: fetcherOf(options.transport),
        retry: retriesQuery,
        staleTime: STALE_TIME,
        ...stated?.queries,
      },
    },
    mutationCache: new MutationCache({ onError: refused }),
    queryCache: new QueryCache({ onError: refused }),
  });

  SETTINGS.set(client, { changes: options.changes, transport: options.transport });

  if (options.onData !== undefined) watch(client, options.onData);

  return client;
}

/**
 * Returns the transport and the changes stream of a client `createDataClient` created.
 *
 * @param client - A query client, whichever function created it.
 * @returns The client's settings.
 * @throws {@link Error} When another function created the client.
 */
export function settingsOf(client: QueryClient): DataSettings {
  const settings = SETTINGS.get(client);

  if (settings === undefined) {
    throw new Error(
      "The query client was not created by createDataClient, so it has no transport to run " +
        "operations through.",
    );
  }

  return settings;
}

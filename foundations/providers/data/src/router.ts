/**
 * Connects the data client to the router: the router's context, route loaders built from a page's
 * data needs, and the server integration that streams each query's data into the page.
 */

import { noop, QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import {
  type AnyRouter,
  notFound,
  type RouteLoader,
  type RouteLoaderArgs,
} from "@stealthscale/provider-router";

import { DataError } from "#errors.ts";
import { type Operation } from "#operation.ts";
import { operationQuery } from "#queries.ts";
import { isRecord } from "#record.ts";
import { type ResourceSelector } from "#resources.ts";

/**
 * Lists what the router's context contains in an application with data.
 */
export interface DataContext {
  /**
   * The page's data client.
   */
  readonly data: QueryClient;
}

/**
 * Describes one query a page reads, and the names its variables take from the route.
 */
export interface DataNeed {
  /**
   * The query.
   */
  readonly operation: Operation<unknown, object, "query">;

  /**
   * The records its data contains.
   */
  readonly resources?: readonly ResourceSelector[] | undefined;

  /**
   * Variables the query takes from the route, each read from the parameters, then from the search.
   */
  readonly variables?: readonly string[] | undefined;
}

/**
 * Lists what the data integration connects.
 */
export interface DataIntegrationOptions {
  /**
   * The request's data client.
   */
  readonly client: QueryClient;

  /**
   * The request's router.
   */
  readonly router: AnyRouter;
}

/**
 * Returns the data client in the router's context.
 *
 * @param context - The router's context.
 * @returns The client the context contains as `data`.
 * @throws {@link Error} When the context has no client as `data`.
 */
function clientOf(context: unknown): QueryClient {
  const client = isRecord(context) ? context["data"] : undefined;

  if (client instanceof QueryClient) return client;

  throw new Error(
    "The router's context has no data client. Put the client in the context as `data`.",
  );
}

/**
 * Reads a need's variables from the route: each from the parameters, then from the search.
 *
 * @remarks
 *   A variable neither contains is left out, so a query runs without an optional member the search
 *   states no value for.
 * @param names - The variables to read from the route.
 * @param args - The loader's arguments, which contain the parameters and the search.
 * @returns The variables the route contains, by name.
 */
function variablesOf(
  names: readonly string[],
  args: RouteLoaderArgs,
): Readonly<Record<string, unknown>> {
  const search = isRecord(args.search) ? args.search : {};
  const variables: Record<string, unknown> = {};

  for (const name of names) {
    const value = args.params[name] ?? search[name];

    if (value !== undefined) variables[name] = value;
  }

  return variables;
}

/**
 * Builds a route loader that loads every need of a page in parallel.
 *
 * @remarks
 *   On a navigation the loader awaits each query with `staleTime: "static"`, so cached data renders
 *   at once and stale data refetches in the background when the page reads it. On a preload it
 *   starts each fetch and returns without waiting, and a failure is left for the navigation to
 *   report. A `not-found` refusal throws the router's `notFound()`, so the page is not found.
 * @param needs - The queries the page reads.
 * @returns The loader, for a route declaration's `loader`.
 * @throws {@link Error} When the router's context has no data client.
 */
export function loadNeeds(needs: readonly DataNeed[]): RouteLoader {
  return async (args) => {
    const client = clientOf(args.context);
    const loads = needs.map((need) =>
      client.query({
        ...operationQuery(need.operation, variablesOf(need.variables ?? [], args), {
          resources: need.resources,
        }),
        staleTime: "static",
      }),
    );

    if (args.preload) {
      for (const load of loads) load.catch(noop);

      return;
    }

    try {
      await Promise.all(loads);
    } catch (error: unknown) {
      // eslint-disable-next-line typescript/only-throw-error -- the library's refusal is a value, not an Error subclass
      if (error instanceof DataError && error.kind === "not-found") throw notFound();

      throw error;
    }
  };
}

/**
 * Connects the data client to the router, so the server's data streams into the page and a query
 * that throws the router's `redirect` navigates.
 *
 * @remarks
 *   The integration dehydrates the queries the render read, pending ones included, streams each one
 *   that settles later, and hydrates them in the browser in the same order. It wraps both caches'
 *   `onError` for redirects and calls the client's own handler for every other error, so create the
 *   client before this call. The client's `dehydrate.shouldDehydrateQuery` leaves out every query
 *   that failed. `DataProvider` renders the client, so the integration wraps the router in nothing.
 * @param options - The request's client and router.
 */
export function setupDataIntegration(options: DataIntegrationOptions): void {
  setupRouterSsrQueryIntegration({
    queryClient: options.client,
    router: options.router,
    wrapQueryClient: false,
  });
}

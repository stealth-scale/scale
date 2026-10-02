/**
 * Builds the router a render of a plugin runs under: the host's routes over a memory history.
 */

import { type FunctionComponent } from "react";

import {
  type AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  routeHref,
  routeMap,
  type RouteMap,
  routerOptions,
} from "@stealthscale/provider-router";
import { type Product } from "@stealthscale/sdk-core";
import { createHostRoutes, type Host, HostNotFound } from "@stealthscale/sdk-host";

import { type PluginRoute } from "#options.ts";

/**
 * Describes a router over the host's routes, with the map its links resolve through.
 */
export interface Routed {
  /**
   * The router.
   */
  readonly router: AnyRouter;

  /**
   * The map from each declared route's id to its route.
   */
  readonly routes: RouteMap;
}

/**
 * Returns a router over the host's routes, at `/`, whose root renders the component.
 *
 * @remarks
 *   The router takes the host's options the way a product's does, with preloading off, so a link
 *   in the rendered page loads nothing on its own.
 * @param host - The host the router's context contains.
 * @param product - The product whose routes the host compiles.
 * @param component - The root route's component.
 */
export function routerOf(host: Host, product: Product, component: FunctionComponent): Routed {
  const root = createRootRoute({ component, notFoundComponent: HostNotFound });
  const tree = root.addChildren([...createHostRoutes(product)(root)]);
  const routes = routeMap(tree);
  const router = createRouter({
    ...routerOptions({ data: host.data, host, routes }),
    defaultPreload: false,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: tree,
  });

  return { router, routes };
}

/**
 * Navigates the router to the route, filled from the parameters given or the route's sample.
 *
 * @param routed - The router and its route map.
 * @param route - The route, its parameters and its search.
 */
export async function opened(
  { router, routes }: Routed,
  { params, search = {}, to }: PluginRoute,
): Promise<void> {
  await router.navigate({ search, to: routeHref(routes, to, params ?? to.sample) });
}

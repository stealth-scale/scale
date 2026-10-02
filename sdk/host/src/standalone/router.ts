/**
 * Builds the standalone page's router: the host's routes under a root that renders the standalone
 * frame, opened at the plugin's start.
 */

import {
  type AnyRouter,
  createAppRootRoute,
  createRouter,
  routeMap,
  type RouteMap,
  routerOptions,
} from "@stealthscale/provider-router";
import { type Product } from "@stealthscale/sdk-core";

import { type Host } from "#host/options.ts";
import { HostNotFound } from "#parts/not-found.tsx";
import { type HostRouterContext } from "#routes/context.ts";
import { createHostRoutes } from "#routes/create-routes.ts";
import { StandaloneFrame } from "#standalone/frame.tsx";
import { startOf } from "#standalone/start.ts";

/**
 * Describes the standalone page's router, with the map its links resolve through.
 */
export interface StandaloneRouted {
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
 * Returns the standalone page's router over the browser's address.
 *
 * @remarks
 *   A page opened at `/` replaces its address with the plugin's start, so the back button does not
 *   return to an empty page. The start is read once the router has given every route its path.
 * @param host - The host the router's context contains.
 * @param product - The standalone product, whose routes the host compiles.
 */
export function standaloneRouter(host: Host, product: Product): StandaloneRouted {
  const root = createAppRootRoute<HostRouterContext>()({
    component: StandaloneFrame,
    notFoundComponent: HostNotFound,
  });
  const tree = root.addChildren([...createHostRoutes(product)(root)]);
  const routes = routeMap(tree);
  const router = createRouter({
    ...routerOptions({ data: host.data, host, routes }),
    routeTree: tree,
  });
  const start = startOf(product, routes);

  if (start !== undefined && router.history.location.pathname === "/") {
    router.history.replace(start);
  }

  return { router, routes };
}

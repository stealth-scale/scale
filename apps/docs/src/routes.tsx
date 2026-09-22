/**
 * Builds the catalogue's route tree and the router mounted over it.
 */

import {
  type AnyRoute,
  basepathOf,
  compileRoutes,
  createAppRootRoute,
  createRouter,
  Outlet,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { COMPILED, FRAME } from "#catalogue.ts";
import { Frame } from "#frame.tsx";

/**
 * Constructs a route tree holding the site root and every compiled catalogue route.
 *
 * @remarks
 *   Each call constructs a fresh tree, so a specification builds one without sharing route state
 *   with the tree the page is mounted from. The catalogue is served at the root, so a page's
 *   address is its identifier and this application adds no segment of its own.
 * @returns The root route, with every child route attached.
 */
export function buildTree(): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });

  return root.addChildren(compileRoutes(COMPILED, { layouts: { [FRAME]: Frame }, parent: root }));
}

/**
 * Constructs the router for the catalogue, mounted under the path the application is served at.
 *
 * @remarks
 *   `basepathOf` derives the mount point from the base the bundler was given, so a deployment
 *   under a prefix such as `/design/` resolves its deep links against that prefix.
 * @returns A router over a freshly built route tree.
 */
export function routed(): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree();

  return createRouter({
    ...routerOptions({ routes: routeMap(tree) }),
    basepath: basepathOf(import.meta.env.BASE_URL),
    routeTree: tree,
  });
}

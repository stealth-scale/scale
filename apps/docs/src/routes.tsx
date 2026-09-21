/**
 * Builds the catalogue's route tree and the router mounted over it.
 */

import {
  type AnyRoute,
  basepathOf,
  compileRoutes,
  createAppRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { COMPILED, FRAME, MOUNTED } from "#catalogue.ts";
import { Frame } from "#frame.tsx";

/**
 * Constructs a route tree holding the site root and every compiled catalogue route.
 *
 * @remarks
 *   Each call constructs a fresh tree, so a specification builds one without sharing route state
 *   with the tree the page is mounted from. The route at `/` redirects to the catalogue, the only
 *   section this application serves.
 * @returns The root route, with every child route attached.
 */
export function buildTree(): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const home = createRoute({
    beforeLoad: () => {
      // TanStack Router signals a redirect with a value that is not an Error subclass.
      // eslint-disable-next-line typescript/only-throw-error -- see above
      throw redirect({ to: `/${MOUNTED}` });
    },
    getParentRoute: () => root,
    path: "/",
  });

  return root.addChildren([
    home,
    ...compileRoutes(COMPILED, { layouts: { [FRAME]: Frame }, parent: root }),
  ]);
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

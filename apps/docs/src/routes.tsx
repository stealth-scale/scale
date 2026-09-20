/**
 * Builds the tree over the catalogue, and the router over the tree.
 */

import {
  type AnyRoute,
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
 * Builds the tree.
 *
 * @remarks
 *   A function rather than a module constant, because calling it twice returns two trees that
 *   share no route, which is what lets a specification build one without navigating the page
 *   beside it. The site root sends a reader to the catalogue, because this application draws
 *   nothing else yet.
 * @returns The tree a router is built from.
 */
export function buildTree(): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const home = createRoute({
    beforeLoad: () => {
      // The library's own redirect, which is a response rather than an Error subclass.
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
 * Builds the router.
 *
 * @returns The router.
 */
export function routed(): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree();

  return createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
}

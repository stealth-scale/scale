/**
 * Builds the catalogue's route tree and the router mounted over it, and rebuilds the tree when a
 * hot update changes the pages.
 */

import {
  type AnyRoute,
  basepathOf,
  compileRoutes,
  createAppRootRoute,
  createRouter,
  Outlet,
  type RouteDeclaration,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { type CatalogueContext, COMPILED, FRAME } from "#catalogue.ts";
import { Frame } from "#frame.tsx";

/**
 * Describes the router the catalogue is mounted under.
 */
export type CatalogueRouter = ReturnType<typeof createRouter<AnyRoute>>;

/**
 * Maps each router to the compiled routes its current tree was built from.
 *
 * @remarks
 *   A hot update of the page index runs this module again, which creates a new map. The router
 *   the application holds is then absent from it, so `rerouted` rebuilds that router's tree once.
 */
const BUILT = new WeakMap<CatalogueRouter, readonly RouteDeclaration[]>();

/**
 * Returns the router context for a tree: its route map and the compiled routes it was built from.
 *
 * @param compiled - The routes the tree was compiled from.
 * @param tree - The root route.
 * @returns The context the rail and every link read.
 */
function contextOf(compiled: readonly RouteDeclaration[], tree: AnyRoute): CatalogueContext {
  return { declarations: compiled, routes: routeMap(tree) };
}

/**
 * Constructs a route tree holding the site root and every compiled catalogue route.
 *
 * @remarks
 *   Each call constructs a fresh tree, so a specification builds one without sharing route state
 *   with the tree the page is mounted from. The catalogue is served at the root, so a page's
 *   address is its identifier and this application adds no segment of its own.
 * @param compiled - The routes to compile. Defaults to the pages this build indexed.
 * @returns The root route, with every child route attached.
 */
export function buildTree(compiled: readonly RouteDeclaration[] = COMPILED): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });

  return root.addChildren(compileRoutes(compiled, { layouts: { [FRAME]: Frame }, parent: root }));
}

/**
 * Constructs the router for the catalogue, mounted under the path the application is served at.
 *
 * @remarks
 *   `basepathOf` derives the mount point from the base the bundler was given, so a deployment
 *   under a prefix such as `/design/` resolves its deep links against that prefix.
 * @returns A router over a freshly built route tree.
 */
export function routed(): CatalogueRouter {
  const tree = buildTree();
  const router = createRouter({
    ...routerOptions(contextOf(COMPILED, tree)),
    basepath: basepathOf(import.meta.env.BASE_URL),
    routeTree: tree,
  });

  BUILT.set(router, COMPILED);

  return router;
}

/**
 * Rebuilds a router's route tree and route map when the compiled routes differ from the ones it
 * was built from.
 *
 * @remarks
 *   The router keeps its history, so the open page stays open. `update` replaces the tree, the
 *   route map and the declarations in the router context, and `invalidate` matches the current
 *   location again, so a page the index gained resolves without a reload. Before this, the rail
 *   link of a specimen added while the server ran threw "No route is declared with the id".
 * @param router - The router the application holds.
 * @param compiled - The routes to compare and compile. Defaults to the pages this build indexed.
 */
export function rerouted(
  router: CatalogueRouter,
  compiled: readonly RouteDeclaration[] = COMPILED,
): void {
  if (BUILT.get(router) === compiled) return;

  const tree = buildTree(compiled);

  BUILT.set(router, compiled);
  router.update({
    ...router.options,
    ...routerOptions(contextOf(compiled, tree)),
    routeTree: tree,
  });
  void router.invalidate();
}

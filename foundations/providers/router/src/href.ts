/**
 * Resolves a declared route id to the path a link navigates to.
 */

import { getRouteSegments, hasMissingPathParams, interpolatePath } from "@tanstack/router-core";

import { type RouteMap } from "#map.ts";
import { type RoutesContext } from "#options.ts";
import { type AnyParams, idOf, type RouteTarget } from "#reference.ts";
import { useRouteContext } from "#tanstack.ts";

/**
 * Resolves a declared id to a path, with the parameters the path names filled in.
 *
 * @remarks
 *   Throwing is deliberate in all three cases. Interpolation otherwise writes `undefined` where a
 *   parameter was not given, and a route no router has processed has no path at all. A link that
 *   navigates somewhere wrong is worse than one that fails where somebody wrote it. The router
 *   parses a path that names a parameter into segments, and a path that names none is its own
 *   href.
 * @param map - The map every route is named in.
 * @param to - A reference to the route, or the bare id one carries.
 * @param params - The parameters the path names, typed by the reference where one was given.
 * @returns The path, ready to navigate to.
 * @throws {@link Error} Where the map contains no such id, where no router has processed the tree
 *   the route was placed in, or where a parameter the path names is missing.
 */
export function routeHref<Params extends AnyParams>(
  map: RouteMap,
  to: RouteTarget<Params>,
  params?: Params,
): string {
  const id = idOf(to);
  const route = map.get(id);

  if (route === undefined) {
    throw new Error(`No route is declared with the id ${id}.`);
  }

  if (route.fullPath === undefined) {
    throw new Error(
      `The route ${id} has no path yet, because no router has processed the tree it was placed in.`,
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-assignment -- the library types a route's own full path as `any`
  const path: string = route.fullPath;
  const segments = getRouteSegments(route);

  if (segments === undefined) return path;

  const given = params ?? {};

  if (hasMissingPathParams(segments, given)) {
    throw new Error(`The route ${id} names a parameter that was not given.`);
  }

  return interpolatePath(path, segments, given);
}

/**
 * Reads the map every route is named in, from the router's own context.
 *
 * @remarks
 *   The router's own context passes the map to a component, so an application mounts no provider
 *   of this package's own to make a link by id work. Where the route is chosen after the render,
 *   pass the map to `routeHref` inside the event handler, because a hook cannot run there.
 * @returns Every id the router knows, against the route that serves it.
 * @throws {@link Error} Where the router was built without one.
 */
export function useRouteMap(): RouteMap {
  const context: RoutesContext = useRouteContext({ strict: false });

  if (context.routes === undefined) {
    throw new Error(
      "The router context holds no route map, so no id can be resolved. Pass one to routerOptions.",
    );
  }

  return context.routes;
}

/**
 * Resolves a reference to a path, through the map the router context contains.
 *
 * @remarks
 *   A hook, so the route has to be known while the component renders. Use `useRouteMap` where the
 *   route is chosen later, such as in the handler of a row a person clicked.
 * @param to - A reference to the route, or the bare id one carries.
 * @param params - The parameters the path names, typed by the reference where one was given.
 * @returns The path, ready to navigate to.
 * @throws {@link Error} Where no map is in the router context, where the map contains no such id,
 *   or where a parameter the path names is missing.
 */
export function useRouteHref<Params extends AnyParams>(
  to: RouteTarget<Params>,
  params?: Params,
): string {
  return routeHref(useRouteMap(), to, params);
}

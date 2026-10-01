/**
 * Links to a route a manifest declared, which the application's own types do not know.
 */

import { type ComponentProps, type ReactNode } from "react";

import { useRouteHref } from "#href.ts";
import { type AnyParams, type RouteTarget } from "#reference.ts";
import { Link } from "#tanstack.ts";

/**
 * Describes a link to a declared route.
 *
 * @remarks
 *   Everything the library's own `Link` takes passes through, so a declared link is styled,
 *   labelled and given an active state the way any other link is. Only `to`, `params` and `search`
 *   are restated, because a declared id is not a path the compiler knows. The search is typed by
 *   the reference alone, so a search that the route's validator does not return fails to compile.
 */
export type RouteLinkProps<Params extends AnyParams = AnyParams, Search = unknown> = {
  /**
   * The parameters the route's path names, typed by the reference where one was given.
   */
  readonly params?: Params | undefined;

  /**
   * The search to open the route with, typed by the reference where one was given.
   */
  readonly search?: NoInfer<Search> | undefined;

  /**
   * A reference to the route, or the bare id of one.
   */
  readonly to: RouteTarget<Params, Search>;
} & Omit<ComponentProps<typeof Link>, "params" | "search" | "to">;

/**
 * Links to a route by the id a manifest declared it under.
 *
 * @remarks
 *   A declared route is outside the tree an application registered, so `Link` refuses its path at
 *   compile time. This resolves the id at run time and passes the library a plain string, which is
 *   the one place in this package where a path is not checked by the compiler. The search passes to
 *   the library's `Link` beside the path.
 * @param props - The declared id, its parameters, its search, and whatever else the library's
 *   `Link` takes.
 * @returns An anchor to the resolved path.
 */
export function RouteLink<Params extends AnyParams, Search>({
  params,
  search,
  to,
  ...rest
}: RouteLinkProps<Params, Search>): ReactNode {
  return (
    <Link {...rest} {...(search === undefined ? {} : { search })} to={useRouteHref(to, params)} />
  );
}

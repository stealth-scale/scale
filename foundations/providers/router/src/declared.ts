/**
 * Reads the declaration a matched route was compiled from.
 */

import { type DeclaredRoute } from "#declaration.ts";
import { type AnyParams, idOf, type RouteRef } from "#reference.ts";
import { useMatches } from "#tanstack.ts";

/**
 * Describes the part of a match this package reads.
 */
export interface MatchedRoute {
  /**
   * The static data the route was created with, which the library returns untouched.
   */
  readonly staticData: object;
}

/**
 * Describes a match the hooks read: its static data, its parameters and its search.
 */
interface MatchedPage extends MatchedRoute {
  /**
   * The path parameters the matched route's own path named.
   */
  readonly params: AnyParams;

  /**
   * The search, as the validators of the matched route and the routes above it returned it.
   */
  readonly search: object;
}

/**
 * Describes the deepest declared match, and the declaration it was compiled from.
 */
interface Deepest<Match> {
  /**
   * The declaration the match was compiled from.
   */
  readonly declared: DeclaredRoute;

  /**
   * The match.
   */
  readonly match: Match;
}

/**
 * Describes the id and the parameters of the declared page a person is looking at.
 */
interface Drawn {
  /**
   * The id the page was declared under.
   */
  readonly id: string;

  /**
   * The parameters the page's path named.
   */
  readonly params: AnyParams;
}

/**
 * Reads the id and the menu entry a matched route stores, or nothing where it stores neither.
 *
 * @remarks
 *   A route stores its id in `staticData`, the library's place for data a route is created with.
 *   The compiler writes it for a route built from a declaration, and `namedRoute` writes it for one
 *   written in code, so a menu, a breadcrumb or a telemetry hook reads the id from the match either
 *   way. The function checks the shape, because `staticData` is untyped and a route may store
 *   anything under the same name. It returns the checked object itself, so every read of one route
 *   returns one reference.
 * @param match - A match, as `useMatches` returns one.
 * @returns The id and the menu entry, or nothing.
 */
export function declaredOf(match: MatchedRoute): DeclaredRoute | undefined {
  const { staticData } = match;
  const data: unknown = "declared" in staticData ? staticData.declared : undefined;

  if (typeof data !== "object" || data === null) return undefined;
  if (!("id" in data) || typeof data.id !== "string") return undefined;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the check establishes `id`, and `navigation` is whatever the host declared
  return data as DeclaredRoute;
}

/**
 * Reads the id of the deepest named route the page is on.
 *
 * @remarks
 *   The hook reads the deepest match, because a named route nested under another is the page a
 *   person is looking at. A page rendered from unnamed routes alone returns nothing. The selector
 *   returns the object the route stores, not a copy. A route's static data is fixed once the tree
 *   is built, so the reference changes only when a different route matches, and a navigation that
 *   keeps the page renders nothing again.
 * @returns The id and the menu entry, or nothing where no matched route states an id.
 */
export function useDeclaredRoute(): DeclaredRoute | undefined {
  return useMatches({ select: (matches) => deepestIn(matches)?.declared });
}

/**
 * Reads the parameters of the page being rendered, typed by the reference the caller passes.
 *
 * @remarks
 *   A compiled route is outside the tree an application registered, so `useParams` types the
 *   parameters against a tree the route is not in. The hook reads them from the match instead, and
 *   the reference types them. It checks at run time that the page is the route the reference names
 *   before it makes the claim. The selector returns the id and the parameters alone, which are
 *   strings. Structural sharing compares them, so a navigation that changed neither renders nothing
 *   again.
 * @param to - A reference to the route the calling component renders.
 * @returns The parameters the route's path named.
 * @throws {@link Error} Where the page being rendered is not the route the reference names.
 */
export function useRouteParams<Params extends AnyParams>(to: RouteRef<Params>): Params {
  const drawn = useMatches({ select: (matches) => paramsIn(matches), structuralSharing: true });

  if (drawn === undefined || drawn.id !== idOf(to)) throw refused(to, "parameters");

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the reference names the parameters, and the check establishes that the page is that route
  return drawn.params as Params;
}

/**
 * Reads the search of the page being rendered, typed by the reference the caller passes.
 *
 * @remarks
 *   A compiled route is outside the tree an application registered, so `useSearch` types the search
 *   against a tree the route is not in. The hook reads it from the match instead, and the reference
 *   types it. It checks at run time that the page is the route the reference names before it makes
 *   the claim. The value is the match's `search`: what the route's validator returned, merged into
 *   the search of the routes above it. The router keeps that object while the search stays equal,
 *   so a navigation that left the search equal renders nothing again.
 * @param to - A reference to the route the calling component renders.
 * @returns The search the route's validator returned.
 * @throws {@link Error} Where the page being rendered is not the route the reference names.
 */
export function useRouteSearch<Search>(to: RouteRef<AnyParams, Search>): Search {
  const declared = useDeclaredRoute();
  const search = useMatches({ select: (matches) => searchIn(matches) });

  if (declared?.id !== idOf(to)) throw refused(to, "search");

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the reference names the search, and the check establishes that the page is that route
  return search as Search;
}

/**
 * Builds the error a hook throws when the page being rendered is not the route a reference names.
 *
 * @param to - The reference the caller passed.
 * @param what - The value the hook was asked for, which the message names.
 * @returns The error.
 */
function refused(to: RouteRef, what: string): Error {
  return new Error(
    `The page being rendered is not ${idOf(to)}, so it cannot return that route's ${what}.`,
  );
}

/**
 * Returns the deepest matched route that states an id, with its declaration.
 *
 * @param matches - Every matched route, outermost first.
 * @returns The deepest declared match, or nothing where no match states an id.
 */
function deepestIn<Match extends MatchedRoute>(
  matches: readonly Match[],
): Deepest<Match> | undefined {
  let deepest: Deepest<Match> | undefined;

  for (const match of matches) {
    const declared = declaredOf(match);

    if (declared !== undefined) deepest = { declared, match };
  }

  return deepest;
}

/**
 * Reads the id and the parameters of the deepest declared match.
 *
 * @param matches - Every matched route, outermost first.
 * @returns The id and the parameters, or nothing where no match states an id.
 */
function paramsIn(matches: readonly MatchedPage[]): Drawn | undefined {
  const deepest = deepestIn(matches);

  return deepest === undefined
    ? deepest
    : { id: deepest.declared.id, params: deepest.match.params };
}

/**
 * Reads the search of the deepest declared match.
 *
 * @param matches - Every matched route, outermost first.
 * @returns The search, or nothing where no match states an id.
 */
function searchIn(matches: readonly MatchedPage[]): object | undefined {
  return deepestIn(matches)?.match.search;
}

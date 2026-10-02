/**
 * Declares a plugin's pages: their paths, parents, searches, data, menu entries and conditions.
 *
 * @remarks
 *   A route reference is structurally a `RouteRef` of `provider-router`: it has `id` and
 *   `~types.params` and `~types.search`, so the router's links and hooks take it with its types.
 */

import { type StandardSchemaV1 } from "@standard-schema/spec";

import { type When } from "#condition.ts";
import { type RouteData } from "#data.ts";
import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";

/**
 * Maps each parameter a path names to the string it matched.
 */
export type PathParams = Readonly<Record<string, string>>;

/**
 * Types the parameters of a path that names none.
 */
export type NoParams = Readonly<Record<never, string>>;

/**
 * Turns a union into the intersection of its members.
 */
type UnionToIntersection<U> = (U extends unknown ? (member: U) => void : never) extends (
  member: infer I,
) => void
  ? I
  : never;

/**
 * Types a path pattern with a `$name` segment for every parameter of `Params`.
 */
export type PathWith<Params extends PathParams> = [keyof Params] extends [never]
  ? string
  : string &
      UnionToIntersection<
        keyof Params extends infer Name
          ? Name extends string
            ? `${string}$${Name}${string}`
            : never
          : never
      >;

/**
 * Validates a page's search string. Any library that implements Standard Schema provides one.
 */
export type SearchSchema<Search = unknown> = StandardSchemaV1<unknown, Search>;

/**
 * Points at a menu a contract declares by name.
 */
export type MenuReference<Id extends string = string> = Reference<"menu", Id>;

/**
 * Describes where a route is listed.
 */
export interface NavigationItem {
  /**
   * Key of the entry's text in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Menu the entry is listed in. The host's `main` menu where it names none.
   */
  readonly menu?: MenuReference | undefined;

  /**
   * Rank of the entry, ascending. Entries without a rank follow, sorted by their text.
   */
  readonly order?: number | undefined;
}

/**
 * Records a route's parameters and search for the type checker.
 */
interface Typed<Params, Search> {
  /**
   * The parameters the route's path names, which a link fills.
   */
  readonly params: Params;

  /**
   * The search the route's validator returns, which a page reads and a link writes.
   */
  readonly search: Search;
}

/**
 * Records the parameters of a route's path, for the type checker alone.
 */
export interface Parameterised<Params extends PathParams> {
  /**
   * The parameters, for the type checker alone.
   */
  readonly "~params"?: Params;
}

/**
 * Lists the members every route states, whatever its path names.
 */
interface RouteMembers<Search> extends MarkerOptions {
  /**
   * Route the page nests under. The page renders where the parent renders `Outlet`.
   */
  readonly parent?: RouteReference | undefined;

  /**
   * Validator of the search string the page reads.
   */
  readonly search?: SearchSchema<Search> | undefined;

  /**
   * Condition under which the route is routed. Routed always where it states none.
   */
  readonly when?: undefined | When;
}

/**
 * Lists the queries a page reads, each variable named by a parameter of the path or a member of
 * the search.
 */
interface Loaded<Params extends PathParams, Search> {
  /**
   * The queries the page reads, which load with its code.
   */
  readonly data?:
    | ReadonlyArray<RouteData<NoInfer<(keyof Params | keyof Search) & string>>>
    | undefined;
}

/**
 * Lists the path a route states, with a `$name` segment for every parameter of `Params`.
 */
interface Pathed<Params extends PathParams> {
  /**
   * Path pattern in the router's `$name` form, relative to the parent or to the frame.
   */
  readonly path: PathWith<Params>;
}

/**
 * Lists the members whose rule depends on whether the path names parameters: a route with
 * parameters states a sample and no menu entry, and a route without them may state an entry.
 */
type Listed<Params extends PathParams> = [keyof Params] extends [never]
  ? {
      /**
       * Menu entry of the route.
       */
      readonly navigation?: NavigationItem | undefined;

      /**
       * Not stated: the path names no parameters.
       */
      readonly sample?: undefined;
    }
  : {
      /**
       * Not stated: a menu entry is a link without parameters.
       */
      readonly navigation?: undefined;

      /**
       * Parameters the plugin's tests open the page at.
       */
      readonly sample: Params;
    };

/**
 * Describes a page: its path, its parent, its search, its data, where it is listed and when it is
 * routed.
 */
export type RouteOptions<Params extends PathParams = NoParams, Search = unknown> = Listed<Params> &
  Loaded<Params, Search> &
  Pathed<Params> &
  RouteMembers<Search>;

/**
 * Describes a route as its marker states it.
 *
 * @remarks
 *   The marker states `data`, `navigation`, `path` and `sample` as plain members. `RouteOptions`
 *   applies the rules between them and the path's parameters, so the markers of every route share
 *   one widest type, `RouteMarker`.
 */
export interface RouteMarker<
  Params extends PathParams = PathParams,
  Search = unknown,
> extends RouteMembers<Search> {
  /**
   * The route's parameters and search, for the type checker alone.
   */
  readonly "~types"?: Typed<Params, Search>;

  /**
   * The queries the page reads, which load with its code.
   */
  readonly data?: readonly RouteData[] | undefined;

  /**
   * The kind of the marker.
   */
  readonly kind: "route";

  /**
   * Menu entry of the route.
   */
  readonly navigation?: NavigationItem | undefined;

  /**
   * Path pattern in the router's `$name` form, relative to the parent or to the frame.
   */
  readonly path: string;

  /**
   * Parameters the plugin's tests open the page at.
   */
  readonly sample?: Params | undefined;
}

/**
 * Points at a route a plugin declared, with its parameters and its search in the type.
 */
export interface RouteReference<
  Id extends string = string,
  Params extends PathParams = PathParams,
  Search = unknown,
> extends Reference<"route", Id> {
  /**
   * The route's parameters and search, for the type checker alone.
   */
  readonly "~types"?: Typed<Params, Search>;

  /**
   * The queries the page reads.
   */
  readonly data?: readonly RouteData[] | undefined;

  /**
   * Marks the route as deprecated, with what to use instead.
   */
  readonly deprecated?: string | undefined;

  /**
   * Menu entry of the route.
   */
  readonly navigation?: NavigationItem | undefined;

  /**
   * Route the page nests under.
   */
  readonly parent?: RouteReference | undefined;

  /**
   * Path pattern in the router's `$name` form.
   */
  readonly path?: string | undefined;

  /**
   * Parameters the plugin's tests open the page at.
   */
  readonly sample?: PathParams | undefined;

  /**
   * Validator of the search string the page reads.
   */
  readonly search?: SearchSchema<Search> | undefined;

  /**
   * Condition under which the route is routed.
   */
  readonly when?: undefined | When;
}

/**
 * Declares the parameters a route's path names, in the type alone.
 *
 * @returns An empty object whose type records `Params`, which a route's options spread.
 */
export function params<Params extends PathParams>(): Parameterised<Params> {
  return {};
}

/**
 * Marks a route.
 *
 * @remarks
 *   The return type takes no part in inference. A contract's definition types its routes as
 *   `RouteMarker`, and a route that spreads no `params` keeps `NoParams` inside it.
 * @param options - The path, the parent, the search, the data, the menu entry, the sample and the
 *   condition, with `params` spread where the path names parameters.
 * @returns The marker, with the parameters and the search in its type.
 */
export function route<Params extends PathParams = NoParams, Search = unknown>(
  options: Parameterised<Params> & RouteOptions<Params, Search>,
): NoInfer<RouteMarker<Params, Search>> {
  return { ...options, kind: "route" };
}

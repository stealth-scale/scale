/**
 * Points at a route without naming a path, a module or an address.
 */

/**
 * The parameters a route names where its reference states none.
 */
export type AnyParams = Readonly<Record<string, string>>;

/**
 * Points at a route by the id it was declared under, with its parameters and its search in the
 * type alone.
 *
 * @remarks
 *   The type is structural, so a plugin SDK's own reference type satisfies it without this package
 *   depending on that SDK. A reference contains no path, because the path is chosen by whoever
 *   composed the application, and a link written against a path would break when they placed the
 *   route elsewhere. Nothing reads `~types` at run time. A link that fills `id` for a route that
 *   names `invoice` fails to compile because of it, and a page reads its search typed.
 */
export interface RouteRef<Params extends AnyParams = AnyParams, Search = unknown> {
  /**
   * The parameters and the search, in the type alone.
   */
  readonly "~types"?: {
    /**
     * The parameters the route's path names, which a link fills.
     */
    readonly params: Params;

    /**
     * The search the route's validator returns, which a page reads and a link writes.
     */
    readonly search: Search;
  };

  /**
   * The full id the route was declared under.
   */
  readonly id: string;
}

/**
 * Points at a route, either by a reference or by the bare id of one.
 */
export type RouteTarget<Params extends AnyParams = AnyParams, Search = unknown> =
  | RouteRef<Params, Search>
  | string;

/**
 * Reads the id a target names.
 *
 * @param to - A reference, or the bare id.
 * @returns The full id the route was declared under.
 */
export function idOf(to: RouteTarget): string {
  return typeof to === "string" ? to : to.id;
}

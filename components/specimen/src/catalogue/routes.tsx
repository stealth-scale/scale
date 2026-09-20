/**
 * Turns the pages a build indexed into the route declarations an application compiles.
 */

import { Outlet, type RouteDeclaration } from "@stealthscale/provider-router";

import { Index } from "#catalogue/index-page.tsx";
import { Page } from "#catalogue/page.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { framedDeclaration, type Framing } from "#framed/route.tsx";

/**
 * The prefix every page of a catalogue is named under, so an application's own routes and these
 * never collide.
 */
export const NAMED = "specimen";

/**
 * Describes where an application puts the catalogue: the route it hangs under, the frame it is
 * drawn in, and what the application lists beside the pages the build found.
 */
export interface Placing {
  /**
   * Pages the application wrote itself, which are compiled with the rest and listed by the rail and
   * the index where they carry an entry. One naming no parent nests under the catalogue's route.
   */
  readonly beside?: readonly RouteDeclaration[] | undefined;

  /**
   * Where the framed page goes: the route a frame loads one sample at when a reader shows a scene
   * in a device. No device is offered where this is absent.
   *
   * @remarks
   *   Declared here beside the pages rather than by the application on its own, so the path the
   *   frames load and the route that serves them are stated once. The route hangs under no parent
   *   and has no layout, so the frame shows the sample and none of the chrome round the catalogue.
   */
  readonly framed?: Framing | undefined;

  /**
   * The id of the route the catalogue hangs under, which the index is named after.
   */
  readonly id: string;

  /**
   * The layouts the catalogue is drawn in, outermost first, which the application registers with
   * the compiler. Drawn bare where this is absent.
   */
  readonly layout?: readonly string[] | undefined;

  /**
   * The path the catalogue is served under, relative to the compiler's parent.
   */
  readonly path: string;
}

/**
 * Returns the id a page is routed under.
 *
 * @remarks
 *   The identifier's slashes become dots, because a route id names a route and a path addresses it.
 *   `actions/button` is served at `actions/button` under the catalogue's route, and referred to as
 *   `specimen.actions.button`.
 */
export function routeId(id: string): string {
  return `${NAMED}.${id.replaceAll("/", ".")}`;
}

/**
 * Returns the id of the index the pages of a catalogue lead back to.
 */
export function indexId(id: string): string {
  return `${id}.index`;
}

/**
 * Returns a page the application wrote, nested under the catalogue's route unless it names a
 * parent of its own.
 */
function under(one: RouteDeclaration, id: string): RouteDeclaration {
  return one.parent === undefined ? { ...one, parent: id } : one;
}

/**
 * Returns the declarations a catalogue compiles to: the route it hangs under, its index, and one
 * page per entry, each nested under that route.
 *
 * @remarks
 *   The route the catalogue hangs under draws the router's outlet and nothing else, because a route
 *   with children is what puts them all under one path and one frame. The index is that route's own
 *   index route, so the catalogue's path opens the index and a page's path opens the page.
 *   A page's component is a closure over the entry rather than a lazy import, because every page
 *   is the same component against different data. The page's own module is still loaded only when
 *   somebody opens it, by the loader the index put on the entry. A page's path carries no leading
 *   slash, so a catalogue at `/components` serves `actions/button` at `/components/actions/button`
 *   without the package knowing.
 * @param pages - The pages the index found, which is what `virtual:specimen-index` exports.
 * @param placing - Where the application puts the catalogue. `Placing` documents every member.
 * @returns The route, its index, then the pages in the order the index gave them, then whatever the
 *   application listed beside them.
 */
export function declarations(
  pages: readonly Indexed[],
  placing: Placing,
): readonly RouteDeclaration[] {
  const { beside = [], framed, id, layout, path } = placing;
  const index = indexId(id);
  const listed: readonly RouteDeclaration[] = [
    ...pages.map((page) => ({
      component: () => <Page back={index} entry={page} framed={framed?.path} />,
      id: routeId(page.id),
      navigation: {
        about: page.about,
        group: page.group,
        label: page.title,
        namespace: page.namespace,
      },
      parent: id,
      path: page.id,
    })),
    ...beside.map((one) => under(one, id)),
  ];

  return [
    { component: Outlet, id, ...(layout === undefined ? {} : { layout }), path },
    { component: () => <Index declarations={listed} />, id: index, parent: id, path: "/" },
    ...listed,
    ...(framed === undefined ? [] : [framedDeclaration(pages, framed)]),
  ];
}

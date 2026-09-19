/**
 * Builds a tree over a set of pages, so a specification renders the catalogue as a reader meets it.
 *
 * @remarks
 *   The package publishes declarations, a rail and an index, and no tree. The frame and the parent
 *   a catalogue hangs beneath are the application's, so a specification supplies both, which is
 *   also what proves a consumer can mount the catalogue wherever they like and compile their own
 *   pages beside it.
 */

import { type ReactElement } from "react";

import { Sidebar } from "@stealthscale/component-screen";
import {
  type AnyRoute,
  compileRoutes,
  createAppRootRoute,
  type LayoutProps,
  Outlet,
  type RouteDeclaration,
} from "@stealthscale/provider-router";
import { type Mounted, mountRoute } from "@stealthscale/testing-router";

import { Rail } from "#catalogue/rail.tsx";
import { declarations } from "#catalogue/routes.tsx";
import { type Indexed } from "#catalogue/types.ts";

/**
 * The name the frame the catalogue is drawn in is registered under.
 */
export const FRAME = "test.frame";

/**
 * The id of the route the catalogue hangs under.
 */
export const CATALOGUE = "test.catalogue";

/**
 * Returns one page as the index lists it.
 *
 * @param id - The identifier the page is addressed by.
 * @param group - The group a rail lists it under.
 * @param title - The words the rail writes.
 * @param about - The sentence the index opens the page's card with.
 * @returns The entry.
 */
export function entry(id: string, group: string, title: string, about = ""): Indexed {
  return {
    about,
    group,
    id,
    load: () => Promise.resolve({}),
    namespace: "",
    package: "@stealthscale/component-actions",
    path: `src/${id}.specimen.tsx`,
    source: () => Promise.resolve({ default: "" }),
    title,
  };
}

/**
 * Returns a page an application wrote itself, which is not a specimen.
 *
 * @param id - The identifier the route is named under.
 * @param group - The group a rail lists it under, or empty for none.
 * @param label - The words the rail writes.
 * @returns The declaration.
 */
export function written(id: string, group: string, label: string): RouteDeclaration {
  return {
    component: () => null,
    id,
    navigation: group === "" ? { label } : { group, label },
    path: id.replaceAll(".", "/"),
  };
}

/**
 * The id of the route a part under test is drawn on.
 */
export const HERE = "test.here";

/**
 * The id of a route a part under test may lead to, which is not the one it is drawn on.
 */
export const THERE = "test.there";

/**
 * Renders an element on a route of its own, beside a second route it may lead to, so a part that
 * resolves an id through the route map has the map to resolve it through.
 *
 * @param element - The part under test, drawn at `/here`.
 * @returns The render, and the router the part was drawn from.
 */
export function onRoute(element: ReactElement): Promise<Mounted> {
  const compiled: readonly RouteDeclaration[] = [
    { component: () => element, id: HERE, path: "/here" },
    { component: () => null, id: THERE, path: "/there" },
  ];
  const root = createAppRootRoute()({ component: Outlet });

  return mountRoute(root.addChildren([...compileRoutes(compiled, { parent: root })]), "/here");
}

/**
 * Builds a tree drawing the catalogue given, inside a frame that draws the rail beside each page.
 *
 * @param listed - The specimen pages to list.
 * @param beside - Whatever the application declared beside them.
 * @param mounted - The path the catalogue hangs beneath.
 * @param query - The words the rail is narrowed by, or nothing for every page.
 * @returns The tree, as `createRouter` takes it.
 */
export function treeOver(
  listed: readonly Indexed[],
  beside: readonly RouteDeclaration[] = [],
  mounted = "/docs",
  query?: string,
): AnyRoute {
  const compiled = declarations(listed, { beside, id: CATALOGUE, layout: [FRAME], path: mounted });

  /**
   * Draws the rail in a sidebar beside whichever page the router matched.
   */
  function Frame({ children }: LayoutProps): ReactElement {
    return (
      <div>
        <Sidebar.Root>
          <Sidebar.Content>
            <Rail declarations={compiled} query={query} />
          </Sidebar.Content>
        </Sidebar.Root>
        {children}
      </div>
    );
  }

  const root = createAppRootRoute()({ component: Outlet });

  return root.addChildren([
    ...compileRoutes(compiled, { layouts: { [FRAME]: Frame }, parent: root }),
  ]);
}

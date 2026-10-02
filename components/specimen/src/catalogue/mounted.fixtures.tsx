/**
 * Builds a tree over a set of pages, so a specification renders the catalogue the way a reader
 * meets it.
 *
 * @remarks
 *   The package publishes declarations, a rail and an index, and no tree. The frame and the parent
 *   route of a catalogue are the application's, so a specification supplies both. The fixture
 *   also proves that a consumer can mount the catalogue under any path and compile their own pages
 *   beside it.
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
 * Name the catalogue's frame is registered under.
 */
export const FRAME = "test.frame";

/**
 * Id of the route the catalogue is mounted under.
 */
export const CATALOGUE = "test.catalogue";

/**
 * Accessible name of the search in the frame's sidebar.
 */
export const FILTER = "Filter pages";

/**
 * Returns one page as the index lists it.
 *
 * @param id - The identifier the page is addressed by.
 * @param group - The group the rail lists the page under.
 * @param title - The page's title, which the rail's link shows.
 * @param about - The sentence the index card opens with.
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
    title,
  };
}

/**
 * Returns a page an application wrote itself, which is not a specimen.
 *
 * @param id - The identifier the route is named under.
 * @param group - The group the rail lists the page under, or empty for none.
 * @param label - The words the rail's link shows.
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
 * Id of the route a part under test renders on.
 */
export const HERE = "test.here";

/**
 * Id of a second route a part under test may link to.
 */
export const THERE = "test.there";

/**
 * Renders an element on a route of its own, beside a second route it may link to, so a part that
 * resolves an id through the route map has a map to resolve it through.
 *
 * @param element - The part under test, rendered at `/here`.
 * @param beside - Further routes the part resolves ids through, such as the levels of a trail.
 * @returns The render, and the router it was rendered from.
 */
export function onRoute(
  element: ReactElement,
  beside: readonly RouteDeclaration[] = [],
): Promise<Mounted> {
  const compiled: readonly RouteDeclaration[] = [
    { component: () => element, id: HERE, path: "/here" },
    { component: () => null, id: THERE, path: "/there" },
    ...beside,
  ];
  const root = createAppRootRoute()({ component: Outlet });

  return mountRoute(root.addChildren([...compileRoutes(compiled, { parent: root })]), "/here");
}

/**
 * Builds a tree that renders the catalogue inside a frame with the rail and its search beside
 * each page.
 *
 * @param listed - The specimen pages to list.
 * @param beside - The pages the application declared beside them.
 * @param mounted - The path the catalogue is mounted under.
 * @returns The tree, as `createRouter` takes it.
 */
export function treeOver(
  listed: readonly Indexed[],
  beside: readonly RouteDeclaration[] = [],
  mounted = "/docs",
): AnyRoute {
  const compiled = declarations(listed, { beside, id: CATALOGUE, layout: [FRAME], path: mounted });

  /**
   * Renders the sidebar with the search and the rail beside the page the router matched.
   */
  function Frame({ children }: LayoutProps): ReactElement {
    return (
      <div>
        <Sidebar.Root>
          <Sidebar.Header>
            <Sidebar.Search aria-label={FILTER} />
          </Sidebar.Header>
          <Sidebar.Content>
            <Rail declarations={compiled} />
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

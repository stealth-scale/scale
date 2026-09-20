/**
 * Renders the page a path matches, so a specification reads a screen rather than a route tree.
 */

import { createElement } from "react";

import { act, render, type RenderResult } from "@testing-library/react";

import {
  type AnyRoute,
  type AnyRouter,
  createMemoryHistory,
  createRouter,
  routeMap,
  routerOptions,
  RouterProvider,
} from "@stealthscale/provider-router";

/**
 * Describes what one mount produced.
 */
export interface Mounted {
  /**
   * The render Testing Library returned, which a query is scoped to.
   */
  readonly result: RenderResult;

  /**
   * The router the page was drawn from, which a case navigates with.
   */
  readonly router: AnyRouter;
}

/**
 * Builds a router over a tree, at a path, with the map every link resolves through.
 *
 * @remarks
 *   A router of its own each time. Two cases sharing one would navigate each other, and the library
 *   keeps a process-wide cache of a processed tree that is keyed by the tree's identity.
 * @param tree - The assembled tree, as `createRouter` takes it.
 * @param at - The path to open. The site root where a caller states none.
 * @returns The router, loaded by the caller.
 */
export function routerOver(tree: AnyRoute, at = "/"): AnyRouter {
  return createRouter({
    ...routerOptions({ routes: routeMap(tree) }),
    defaultPreload: false,
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: tree,
  });
}

/**
 * Renders the page a path matches, waiting for everything that path loads.
 *
 * @param tree - The assembled tree, as `createRouter` takes it.
 * @param at - The path to open. The site root where a caller states none.
 * @returns The render, and the router the page was drawn from.
 */
export function mountRoute(tree: AnyRoute, at = "/"): Promise<Mounted> {
  return mountRouter(routerOver(tree, at));
}

/**
 * Renders the page a router is on, waiting for everything that page loads.
 *
 * @remarks
 *   Use this where the application already builds its own router, such as one that takes a session.
 *   `mountRoute` covers the case where a specification has a tree and nothing else.
 *   The render is settled before it is handed back, the way `drawn` settles one. A page holding a
 *   component built on a state machine writes its first state on a microtask after the render
 *   returns, and React reports that write as an update outside `act`. A page is free to hold one,
 *   so every mount waits rather than every specification of a page that does.
 * @param router - The router to render.
 * @param at - A path to navigate to first, or nothing to render where the router already is.
 * @returns The render, and the router the page was drawn from.
 */
export async function mountRouter(router: AnyRouter, at?: string): Promise<Mounted> {
  if (at !== undefined) await router.navigate({ to: at });

  await router.load();

  const result = await act(async () => {
    const drawn = render(createElement(RouterProvider, { router }));

    await Promise.resolve();

    return drawn;
  });

  return { result, router };
}

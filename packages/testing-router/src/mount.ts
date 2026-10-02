/**
 * Renders the page a route tree matches at a given path, for a specification.
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
 * The render one mount produced, together with the router that produced it.
 */
export interface Mounted {
  /**
   * The Testing Library render result. Queries are scoped to it.
   */
  readonly result: RenderResult;

  /**
   * The router that rendered the page. A case navigates through it.
   */
  readonly router: AnyRouter;
}

/**
 * Builds a router over a route tree, opened at a path, holding the map every link resolves through.
 *
 * @remarks
 *   Every call builds a new router, because two cases sharing one would navigate each other. The
 *   router library caches a processed tree process-wide under that tree's identity.
 * @param tree - The assembled route tree, as `createRouter` takes it.
 * @param at - Path to open. Defaults to the site root.
 * @returns The router, with its matches not yet loaded.
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
 * Renders the page a path matches, after the router has loaded that path's matches.
 *
 * @param tree - The assembled route tree, as `createRouter` takes it.
 * @param at - Path to open. Defaults to the site root.
 * @returns The render, and the router that produced the page.
 */
export function mountRoute(tree: AnyRoute, at = "/"): Promise<Mounted> {
  return mountRouter(routerOver(tree, at));
}

/**
 * Renders the page a router is on, after the router has loaded that page's matches.
 *
 * @remarks
 *   The render is settled before this returns. A component built on a state machine writes its
 *   first state on a microtask after the render, and React reports that write as an update outside
 *   `act`.
 * @param router - The router to render.
 * @param at - Path to navigate to first. Defaults to the router's current location.
 * @returns The render, and the router that produced the page.
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

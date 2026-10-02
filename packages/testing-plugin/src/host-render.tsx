/**
 * Renders a router's root under a host and a memory router, once the router loaded.
 */

import { type FunctionComponent } from "react";

import { act, render } from "@testing-library/react";

import { RouterProvider } from "@stealthscale/provider-router";
import { HostProvider } from "@stealthscale/sdk-host";

import { type Hosted } from "#hosted.ts";
import { type PluginRendered, type PluginRoute } from "#options.ts";
import { opened, routerOf } from "#router.ts";

/**
 * Renders the root route's component under the host, with the router at the route.
 *
 * @remarks
 *   The router loads the route and the host is ready before the render, which settles inside
 *   `act`. `unmount` disposes the host.
 * @param hosted - The host, its product, its sources and its setting store.
 * @param root - The root route's component.
 * @param route - The route the router opens at. Where left out, the router opens at `/`.
 * @returns The render, once it settled.
 */
export async function renderOver(
  hosted: Hosted,
  root: FunctionComponent,
  route?: PluginRoute,
): Promise<PluginRendered> {
  const { host, product, sources, store } = hosted;
  const routed = routerOf(host, product, root);
  const { router } = routed;

  if (route !== undefined) await opened(routed, route);

  await host.ready();
  await router.load();

  const view = await act(async () => {
    const rendered = render(
      <HostProvider host={host} router={router}>
        <RouterProvider router={router} />
      </HostProvider>,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    return rendered;
  });

  return {
    ...view,
    access: sources.access,
    host,
    router,
    session: sources.session,
    store,
    unmount: () => {
      view.unmount();
      host.dispose();
    },
  };
}

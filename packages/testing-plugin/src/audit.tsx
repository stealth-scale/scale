/**
 * Renders a plugin or a product under a host for one derived case, runs axe over the render, and
 * lists every fault: a route that did not load, a render that threw, and each rule axe found
 * broken.
 */

import { type FunctionComponent, type ReactNode } from "react";

import { RouterProvider } from "@stealthscale/provider-router";
import { HostProvider } from "@stealthscale/sdk-host";
import { accessibilityViolations } from "@stealthscale/testing-react";

import { PluginFrame } from "#frame.tsx";
import { type Hosted, hostedOf } from "#hosted.ts";
import { type PluginRenderOptions, type PluginRoute } from "#options.ts";
import { rootOf } from "#root.tsx";
import { opened, routerOf } from "#router.ts";

/**
 * Describes one audited render.
 */
export interface Audit {
  /**
   * The plugin, the plugins beside it, and the state the host starts from.
   */
  readonly options: PluginRenderOptions;

  /**
   * The route the router opens at. Where left out, the router opens at `/`.
   */
  readonly route?: PluginRoute | undefined;

  /**
   * The element rendered after the frame in the plugin's scope. None where left out.
   */
  readonly ui?: ReactNode;
}

/**
 * Returns the message of a thrown value.
 */
export function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Renders a plugin under a host and a loaded router, in the frame of every region, and lists every
 * fault the render shows.
 *
 * @param audit - The plugin, the route and the element.
 * @returns Each fault as a sentence, or an empty array for a render without one.
 */
export async function audited({ options, route, ui = null }: Audit): Promise<readonly string[]> {
  const root = rootOf(PluginFrame, options.contract.pluginId, ui);
  const faults = await auditedOver(hostedOf(options), root, route);

  return faults;
}

/**
 * Renders a router's root under a host and a loaded router, and lists every fault the render
 * shows.
 *
 * @remarks
 *   The router loads the route before the render. Axe runs through `accessibilityViolations`,
 *   which renders the loaded router as its component inside `HostProvider` and reads the render
 *   one animation frame after it commits. The faults are the matches whose load ended other than
 *   in success, such as a match the host's condition stopped, the renders the host reported as
 *   failed, and each broken rule. The host is disposed whatever the result.
 * @param hosted - The host and its product.
 * @param root - The root route's component.
 * @param route - The route the router opens at. Where left out, the router opens at `/`.
 * @returns Each fault as a sentence, or an empty array for a render without one.
 */
export async function auditedOver(
  hosted: Pick<Hosted, "host" | "product">,
  root: FunctionComponent,
  route?: PluginRoute,
): Promise<readonly string[]> {
  const { host, product } = hosted;
  const routed = routerOf(host, product, root);
  const { router } = routed;

  try {
    if (route !== undefined) await opened(routed, route);

    await host.ready();
    await router.load();

    const loads = router.state.matches.flatMap((match) => {
      if (match.status === "error")
        return [`${match.routeId} failed to load: ${messageOf(match.error)}`];

      return match.status === "success" ? [] : [`${match.routeId} ended its load ${match.status}`];
    });
    const violations = await accessibilityViolations(RouterProvider, {
      frame: true,
      props: { router },
      wrapper: (children) => (
        <HostProvider host={host} router={router}>
          {children}
        </HostProvider>
      ),
    });
    const failures = host.stores.reports
      .get()
      .flatMap((entry) =>
        entry.kind === "render-failed"
          ? [`${entry.target} failed to render: ${messageOf(entry.error)}`]
          : [],
      );

    return [...loads, ...failures, ...violations];
  } finally {
    host.dispose();
  }
}

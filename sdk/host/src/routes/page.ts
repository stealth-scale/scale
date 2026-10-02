/**
 * Loads a plugin's page and renders it as its route's component: in the plugin's scope, with the
 * extensions placed around the route, and with the route's count of failed renders returned to zero
 * after it commits.
 */

import { createElement, type FunctionComponent, type ReactNode, useEffect } from "react";

import { useRouteContext } from "@stealthscale/provider-router";
import { type Product, type ResolvedRoute } from "@stealthscale/sdk-core";
import { PluginProvider, type RenderTarget, RouteDecorations } from "@stealthscale/sdk-plugin";

import { importPlugins } from "#host/ready.ts";
import { type HostRouterContext } from "#routes/context.ts";
import { componentOf, mappingOf } from "#routes/mapping.ts";

/**
 * Returns the route component of a page: a plugin's page, the settings frame or a settings page.
 *
 * @remarks
 *   The component reads the host from the router's context. A render of the page that throws
 *   commits nothing, so the route's count of failed renders returns to zero only after a render
 *   that commits.
 * @param pluginId - Id of the plugin that declares the route, or the settings page, whose scope
 *   the page renders in.
 * @param routeId - The route's qualified id, under which its failed renders and the extensions
 *   around it are recorded.
 * @param page - The component the route renders: a plugin's page, the settings frame or a settings
 *   page.
 */
export function hostPageOf(
  pluginId: string,
  routeId: string,
  page: FunctionComponent,
): FunctionComponent {
  const target: RenderTarget = `route:${routeId}`;

  /**
   * Renders the page in its plugin's scope, with the extensions placed around its route.
   */
  return function HostPage(): ReactNode {
    const { host }: HostRouterContext = useRouteContext({ strict: false });
    const { quarantine } = host.stores;

    useEffect(() => {
      quarantine.rendered(target);
    });

    return createElement(
      PluginProvider,
      { pluginId },
      createElement(RouteDecorations, { routeId }, createElement(page)),
    );
  };
}

/**
 * Imports a plugin's page and, in parallel, every module of the plugins whose extensions load with
 * it, and returns the module of the page's route component.
 *
 * @remarks
 *   A module of the other plugins that fails to import leaves the page to render, and its extension
 *   reports the failure when it renders.
 * @param product - The product, with each installed plugin's manifest.
 * @param route - The route as the build resolved it, with the plugins that load with its page.
 * @returns The module whose default export is the route component.
 * @throws {@link Error} Where no installed manifest maps the route to code, or where the page's
 *   module exports no function or more than one.
 */
export async function loadPage(
  product: Pick<Product, "manifests">,
  route: ResolvedRoute,
): Promise<Readonly<Record<string, FunctionComponent>>> {
  const { component } = mappingOf(product, route.id);

  if (component === undefined) throw new Error(`No manifest maps the route ${route.id} to code.`);

  const [module] = await Promise.all([
    component(),
    importPlugins(product.manifests, new Set(route.loads)),
  ]);

  return { default: hostPageOf(route.plugin, route.id, componentOf(module, route.id)) };
}

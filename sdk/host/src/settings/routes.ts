/**
 * Declares the routes the host renders itself: the settings frame, its index and the settings
 * pages.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";
import { HOST, hostContract, type Product, type ResolvedRoute } from "@stealthscale/sdk-core";

import { importPlugins } from "#host/ready.ts";
import { type HostCondition } from "#routes/context.ts";
import { hostPageOf } from "#routes/page.ts";
import { SettingsFrame } from "#settings/frame.tsx";
import { SettingsIndex } from "#settings/index-page.tsx";
import { settingsPageOf } from "#settings/page.tsx";
import { pageRouteOf } from "#settings/placement.ts";

/**
 * Id of the route at the settings route's own address, which opens the first settings page.
 */
export const SETTINGS_INDEX = `${hostContract.routes.settings.id}/index`;

/**
 * Returns the declaration of the settings route's index: a child at `/` without a condition, which
 * the settings route's own condition guards.
 */
export function settingsIndexOf(): RouteDeclaration<HostCondition> {
  return {
    component: SettingsIndex,
    id: SETTINGS_INDEX,
    parent: hostContract.routes.settings.id,
    path: "/",
  };
}

/**
 * Returns the component of a route the host renders itself, or undefined for a plugin's route.
 *
 * @remarks
 *   The settings frame and each settings page render as a plugin's page does: in the scope of the
 *   route's plugin, with the extensions placed around the route, and with the route's count of
 *   failed renders returned to zero after a render that commits. A settings page loads with the
 *   modules of the plugins in its `loads`.
 * @param product - The product, with each installed plugin's manifest.
 * @param route - The route as the build resolved it.
 */
export function hostComponentOf(
  product: Product,
  route: ResolvedRoute,
): RouteDeclaration["component"] | undefined {
  if (route.id === hostContract.routes.settings.id) {
    return hostPageOf(HOST, route.id, SettingsFrame);
  }

  const page = product.settings.pages.find(({ id }) => pageRouteOf(id) === route.id);

  return page === undefined
    ? undefined
    : {
        load: async () => {
          await importPlugins(product.manifests, new Set(route.loads));

          return { default: hostPageOf(route.plugin, route.id, settingsPageOf(page)) };
        },
      };
}

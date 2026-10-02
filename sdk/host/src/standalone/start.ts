/**
 * Reads what the standalone page starts from: the address it opens at, and the flags the panel
 * offers.
 */

import { routeHref, type RouteMap } from "@stealthscale/provider-router";
import { type Product } from "@stealthscale/sdk-core";

import { type DeclaredFlag } from "#standalone/context.ts";

/**
 * Returns the address the standalone page opens at: the plugin's first menu entry, else its first
 * route that a sample or an empty path fills. Undefined where the plugin has neither.
 *
 * @param product - The standalone product, whose id is the plugin's.
 * @param routes - The router's map.
 */
export function startOf(product: Product, routes: RouteMap): string | undefined {
  const own = product.routes.filter(({ plugin }) => plugin === product.productId);
  const filled = own.filter(({ path, sample }) => sample !== undefined || !path.includes("$"));
  const [start] = [...filled.filter(({ navigation }) => navigation !== undefined), ...filled];

  return start === undefined ? undefined : routeHref(routes, { id: start.id }, start.sample);
}

/**
 * Returns every flag the installed plugins' contracts declare, in install order, with the variants
 * of each experiment.
 */
export function flagsOf(product: Product): readonly DeclaredFlag[] {
  return Object.values(product.manifests).flatMap(({ contract }) =>
    Object.values(contract.featureFlags).map(({ id, variants }) => ({
      id,
      variants: variants?.map(String),
    })),
  );
}

/**
 * Lists the plugin routes of a product, and the state a render of each starts from.
 */

import {
  pluginOf,
  type Product,
  type ProductDefinition,
  type RouteReference,
} from "@stealthscale/sdk-core";

import { type HostState } from "#hosted.ts";
import { satisfiedBy } from "#satisfied.ts";

/**
 * Returns every route the installed plugins' contracts declare, in install order.
 */
export function routesOf(definition: ProductDefinition): readonly RouteReference[] {
  return definition.plugins.flatMap(({ manifest }) => Object.values(manifest.contract.routes));
}

/**
 * Returns the state a render of a plugin route starts from: its plugin on, under the first context
 * that makes its condition true.
 *
 * @remarks
 *   The route's condition is the one the build resolved, which joins the product's, and the
 *   installation's condition joins it.
 * @param definition - The product's definition, whose installations state their conditions.
 * @param product - The resolved product.
 * @param route - A route of an installed plugin, whose id names the plugin.
 */
export function stateOf(
  definition: ProductDefinition,
  product: Product,
  route: RouteReference,
): HostState {
  const plugin = pluginOf(route.id);
  const installed = definition.plugins.filter(
    ({ manifest }) => manifest.contract.pluginId === plugin,
  );
  const resolved = product.routes.filter(({ id }) => id === route.id);
  const conditions = [...installed, ...resolved].flatMap(({ when }) =>
    when === undefined ? [] : [when],
  );
  const satisfied = satisfiedBy(product, { allOf: conditions });

  return { ...satisfied, switches: { ...satisfied.switches, [plugin]: true } };
}

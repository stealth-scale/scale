/**
 * Contributes the product plugin to a composed configuration's plugins array.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config";

import { loaded } from "#loaded.ts";
import { type ProductOptions } from "#types.ts";

/**
 * Appends `product()` to the plugins of an application composed from plugins.
 *
 * @remarks
 *   The contribution imports the plugin package inside `itemOf`, so a task runner that reads the
 *   configuration for its metadata alone loads no plugin. Each composition constructs its own
 *   plugin instance.
 * @param options - The definition's path. The plugin reads `src/product.ts` where it is left out.
 */
export function composed(options: ProductOptions = {}): Contribution {
  return contribute({
    at: "plugins",
    because:
      "the application's plugins are checked against each other and resolved while it builds, " +
      "and its pages read the result from virtual:product",
    itemOf: async () => (await loaded()).product(options),
    name: "product.composed",
  });
}

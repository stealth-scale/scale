/**
 * Adds the catalogue plugin to the plugins a tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#loaded.ts";
import { type Options } from "#types.ts";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Appends `i18n()` to the plugins of a package or an application with catalogues.
 *
 * @remarks
 *   The plugin package is loaded when the plugin is constructed and not when the layer is stated,
 *   so reading the configuration for its metadata loads no plugin. Each composition constructs a
 *   plugin instance of its own.
 * @param stated - The plugin options a repository departs on. Omitting it searches under the
 *   defaults the plugin documents.
 */
export function catalogued(stated: Options = {}): Contribution {
  return contribute({
    at: AT,
    because:
      "a component looks a word up by key, and no key exists until every package's catalogue " +
      "has been found, merged and typed",
    itemOf: async () => (await loaded()).i18n(stated),
    name: "i18n.catalogued",
  });
}

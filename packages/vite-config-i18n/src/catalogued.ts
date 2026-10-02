/**
 * Contributes the catalogue plugin to a composed configuration's plugins array.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#loaded.ts";
import { type Options } from "#types.ts";

/**
 * The configuration key the contribution appends to.
 */
const AT = "plugins";

/**
 * Appends `i18n()` to the plugins of a package or an application with catalogues.
 *
 * @remarks
 *   The contribution imports the plugin package inside `itemOf`, so a task runner that reads the
 *   configuration for its metadata alone loads no plugin. Each composition constructs its own
 *   plugin instance.
 * @param stated - The plugin options. The plugin applies its documented default for each option
 *   omitted.
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

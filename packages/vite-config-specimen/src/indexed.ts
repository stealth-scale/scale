/**
 * Adds the specimen plugin to the plugins a tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#loaded.ts";
import { type Options } from "#types.ts";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Appends `specimens()` to the plugins of an application that shows a catalogue.
 *
 * @remarks
 *   The plugin package is loaded when the plugin is constructed and not when the layer is stated,
 *   so reading the configuration for its metadata loads neither the plugin nor the compiler
 *   behind it. Each composition constructs a plugin instance of its own.
 * @param stated - Where the specimens are. `Options` documents every member.
 */
export function indexed(stated: Options): Contribution {
  return contribute({
    at: AT,
    because:
      "a catalogue lists every page before it loads one, which needs each specimen's metadata " +
      "parsed out of the source rather than read off a module that has run",
    itemOf: async () => (await loaded()).specimens(stated),
    name: "specimen.indexed",
  });
}

/**
 * Adds the stylesheet compiler to whatever plugins an application's tier already built.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#loaded.ts";
import { type Options } from "#types.ts";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * Adds `theme.stylesheet()` to the plugins of an application.
 *
 * @remarks
 *   The plugin package is loaded when the plugin is constructed and not when the layer is stated,
 *   so reading the configuration for its metadata loads neither the plugin nor the compiler
 *   behind it. Each composition constructs a plugin instance of its own.
 * @param stated - The parts of the plugin's options a repository departs on. Omitting it compiles
 *   under the defaults the plugin documents.
 */
export function stylesheet(stated: Options = {}): Contribution {
  return contribute({
    at: AT,
    because:
      "an application is the one package that knows both the components on its page and the " +
      "themes they are drawn in, so it is the one package that compiles the stylesheet",
    itemOf: async () => (await loaded()).theme.stylesheet(stated),
    name: "theme.stylesheet",
  });
}

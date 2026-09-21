/**
 * Contributes the stylesheet compiler to an application's plugins.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#loaded.ts";
import { type Options } from "#types.ts";

/**
 * The configuration path the plugin is contributed at.
 */
const AT = "plugins";

/**
 * Returns the contribution that adds `theme.stylesheet()` to an application's plugins.
 *
 * @remarks
 *   The plugin package is imported when the plugin is constructed rather than when the layer is
 *   declared, so resolving the configuration for metadata alone loads neither the plugin nor the
 *   compiler behind it. Each composition constructs a plugin instance of its own.
 * @param stated - The plugin options a repository departs from. Omitting it compiles under the
 *   defaults the plugin documents.
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

/**
 * Loads the theme plugin when a plugin is constructed rather than when the configuration is read.
 *
 * @remarks
 *   Vite bundles a configuration file before running it, and the bundler resolves every import it
 *   can read, including a dynamic one with a literal specifier. A plugin package that is not built
 *   yet fails that resolution, so the configuration cannot be read at all, not even to plan the
 *   task graph that would build the package. A specifier held in a variable is one the bundler
 *   cannot read, so the import falls to Node, which resolves it from this module when the plugin is
 *   constructed.
 */

import { located } from "@stealthscale/vite-config-core";

/**
 * The plugin package name, held in a variable so the bundler cannot resolve the import.
 */
const PLUGIN = "@stealthscale/vite-plugin-theme";

/**
 * Loads the theme plugin package.
 *
 * @throws {@link Error} When the plugin package has not been built yet.
 */
export function loaded(): Promise<typeof import("@stealthscale/vite-plugin-theme")> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a dynamic import of a specifier in a variable resolves to any, and the header gives the reason for the variable
  return import(located(PLUGIN, import.meta.url)) as Promise<
    typeof import("@stealthscale/vite-plugin-theme")
  >;
}

/**
 * Loads the theme plugin when a plugin is constructed, and not when the configuration is read.
 *
 * @remarks
 *   Vite bundles a configuration file before it runs it, and the bundler resolves every import it
 *   can read, a dynamic one with a literal specifier included. A plugin package that is not built
 *   yet then fails the resolution, and the configuration cannot be read at all, not even for the
 *   task graph that would build the package. A specifier held in a value is one the bundler cannot
 *   read, so the import is left to Node, which resolves it from this module when the plugin is
 *   constructed, wherever the module runs from.
 */

import { located } from "@stealthscale/vite-config-core";

/**
 * The plugin package, named as a value.
 */
const PLUGIN = "@stealthscale/vite-plugin-theme";

/**
 * Loads the theme plugin package.
 *
 * @throws {@link Error} When the plugin package is not built yet.
 */
export function loaded(): Promise<typeof import("@stealthscale/vite-plugin-theme")> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a specifier held in a value is typed by nobody, and the header says why it is held that way
  return import(located(PLUGIN, import.meta.url)) as Promise<
    typeof import("@stealthscale/vite-plugin-theme")
  >;
}

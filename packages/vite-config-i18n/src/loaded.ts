/**
 * Loads the catalogue plugin package through a dynamic import the bundler cannot resolve.
 *
 * @remarks
 *   Vite bundles a configuration file before running it, and the bundler resolves every static
 *   import and every dynamic import with a literal specifier. An unbuilt plugin package fails that
 *   resolution, so the configuration cannot be read at all, not even for the task graph that would
 *   build the package. A specifier in a variable defers the import to Node, which resolves it from
 *   this module at call time.
 */

import { located } from "@stealthscale/vite-config-core";

/**
 * The plugin package specifier, in a variable so the bundler cannot resolve the import.
 */
const PLUGIN = "@stealthscale/vite-plugin-i18n";

/**
 * Loads the catalogue plugin package.
 *
 * @throws {@link Error} When the plugin package is not built yet.
 */
export function loaded(): Promise<typeof import("@stealthscale/vite-plugin-i18n")> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a dynamic import of a specifier in a variable resolves to any, and the header gives the reason for the variable
  return import(located(PLUGIN, import.meta.url)) as Promise<
    typeof import("@stealthscale/vite-plugin-i18n")
  >;
}

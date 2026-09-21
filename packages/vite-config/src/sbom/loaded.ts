/**
 * Loads the inventory plugin when the plugin is constructed, rather than when the config is read.
 *
 * @remarks
 *   Vite bundles a config file before running it, and the bundler resolves every import it can
 *   see, a dynamic import with a literal specifier included. A plugin package that has not been
 *   built yet fails that resolution, and then the config cannot be read at all, not even by the
 *   task graph that would have built the package. A specifier held in a variable is one the bundler
 *   cannot follow, which leaves the import to Node at construction time.
 */

import { located } from "@stealthscale/vite-config-core";

/**
 * The inventory plugin package, held in a variable so the bundler cannot resolve it.
 */
const PLUGIN = "@stealthscale/vite-plugin-sbom";

/**
 * Imports the inventory plugin package, resolved from this module.
 *
 * @throws {@link Error} When the plugin package has not been built yet.
 */
export function loaded(): Promise<typeof import("@stealthscale/vite-plugin-sbom")> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a specifier stored in a variable has no type, and the module header states why it is stored that way
  return import(located(PLUGIN, import.meta.url)) as Promise<
    typeof import("@stealthscale/vite-plugin-sbom")
  >;
}

/**
 * Defers loading the specimen plugin until a plugin is constructed, rather than when the
 * configuration is read.
 *
 * @remarks
 *   Vite bundles a configuration file before running it, and the bundler resolves every import it
 *   can see, a dynamic import with a literal specifier included. If the plugin package has not
 *   been built yet, that resolution fails and the configuration cannot be read at all, not even to
 *   build the task graph that would build the package. Holding the specifier in a variable puts it
 *   out of the bundler's reach, so Node resolves it at call time, relative to this module wherever
 *   it ends up running from.
 */

import { located } from "@stealthscale/vite-config-core";

/**
 * The plugin package specifier, held in a variable so the bundler cannot resolve it statically.
 */
const PLUGIN = "@stealthscale/vite-plugin-specimen";

/**
 * Imports the specimen plugin package.
 *
 * @throws {@link Error} When the plugin package has not been built yet.
 */
export function loaded(): Promise<typeof import("@stealthscale/vite-plugin-specimen")> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a dynamic import of a specifier in a variable resolves to any, and the header gives the reason for the variable
  return import(located(PLUGIN, import.meta.url)) as Promise<
    typeof import("@stealthscale/vite-plugin-specimen")
  >;
}

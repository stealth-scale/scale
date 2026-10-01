/**
 * Reads a plugin's configuration: what the product stated about it at build.
 */

import { type ConfigOf, type ConfigSchema } from "@stealthscale/sdk-core";

import { useHost } from "#host/use-host.ts";
import { usePlugin } from "#scope/context.ts";

/**
 * Returns the calling plugin's configuration: the product's values over the schema's defaults.
 *
 * @param schema - The plugin's own configuration schema, which types the values.
 * @throws {@link Error} Where the schema is not the calling plugin's.
 */
export function useConfig<S extends ConfigSchema>(schema: S): ConfigOf<S> {
  const { pluginId } = usePlugin();
  const { product } = useHost("useConfig");

  if (product.manifests[pluginId]?.contract.config !== schema) {
    throw new Error(`useConfig() takes the schema of its own plugin, ${pluginId}.`);
  }

  const resolved = product.plugins.find(({ id }) => id === pluginId);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the build checked the configuration against this schema and filled its defaults
  return resolved?.config as ConfigOf<S>;
}

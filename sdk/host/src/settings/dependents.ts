/**
 * Finds the plugins that turn off with a plugin a person switches off.
 */

import { type ResolvedPlugin } from "@stealthscale/sdk-core";

/**
 * Returns the plugins that are on and require a plugin without `optional`, directly or through
 * another plugin that does, in install order.
 *
 * @remarks
 *   A plugin is not on while a plugin it requires without `optional` is not on, so switching the
 *   plugin off turns these off with it. The set of plugins turned off grows until no plugin joins
 *   it, so the walk ends on a ring of requirements too.
 * @param plugins - The installed plugins, with the plugins each requires.
 * @param pluginId - Id of the plugin being switched off.
 * @param on - Returns true where a plugin is on.
 */
export function dependentsOf(
  plugins: readonly ResolvedPlugin[],
  pluginId: string,
  on: (pluginId: string) => boolean,
): readonly ResolvedPlugin[] {
  const off = new Set([pluginId]);
  let grown = true;

  while (grown) {
    grown = false;

    for (const plugin of plugins) {
      const stopped = plugin.requires.some(
        (required) => required.optional !== true && off.has(required.pluginId),
      );

      if (stopped && !off.has(plugin.id) && on(plugin.id)) {
        off.add(plugin.id);
        grown = true;
      }
    }
  }

  return plugins.filter((plugin) => plugin.id !== pluginId && off.has(plugin.id));
}

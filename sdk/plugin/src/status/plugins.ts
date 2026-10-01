/**
 * Reads each installed plugin's state at run time, for a plugin that shows the host's state, such
 * as the inspector.
 */

import { pluginOf, type PluginOffReason } from "@stealthscale/sdk-core";

import { type Quarantined } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Describes one installed plugin at run time.
 */
export interface PluginStatus {
  /**
   * Id of the plugin.
   */
  readonly id: string;

  /**
   * True where the plugin is on.
   */
  readonly on: boolean;

  /**
   * Every target of the plugin that is quarantined, with its last error.
   */
  readonly quarantined: readonly Quarantined[];

  /**
   * The reason the plugin is not on. Undefined while it is on.
   */
  readonly reason: PluginOffReason | undefined;

  /**
   * True where a person may switch the plugin: the product did not lock it.
   */
  readonly switchable: boolean;

  /**
   * The plugin's version, from its contract.
   */
  readonly version: string | undefined;
}

/**
 * Returns one status per installed plugin, in install order, and renders again when a plugin turns
 * on or off or a target of it is quarantined or released.
 */
export function usePluginStatuses(): readonly PluginStatus[] {
  const { product, stores } = useHost("usePluginStatuses");
  const availability = useSelector([stores.availability], () => stores.availability.get());
  const quarantine = useSelector([stores.quarantine], () => stores.quarantine.get());

  return product.plugins.map((plugin) => ({
    id: plugin.id,
    on: availability[plugin.id]?.on === true,
    quarantined: [...quarantine.values()].filter(
      ({ target }) => pluginOf(target.slice(target.indexOf(":") + 1)) === plugin.id,
    ),
    reason: availability[plugin.id]?.reason,
    switchable: !plugin.locked,
    version: plugin.version,
  }));
}

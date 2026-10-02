/**
 * Declares what every derived case of a plugin is derived from.
 */

import { type AnyContract, type PluginManifest } from "@stealthscale/sdk-core";

/**
 * Describes the plugin the derived cases check, and the plugins installed beside it.
 */
export interface Subject {
  /**
   * Contracts of the plugins installed beside the plugin, each from its contract alone.
   */
  readonly beside: readonly AnyContract[];

  /**
   * The plugin's contract.
   */
  readonly contract: AnyContract;

  /**
   * The plugin's manifest.
   */
  readonly manifest: PluginManifest;
}

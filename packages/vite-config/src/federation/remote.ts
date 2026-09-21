/**
 * Builds a package into a remote that other applications load over the network.
 *
 * @remarks
 *   A host fetches a remote rather than installing it, which is why the entry keeps a fixed
 *   filename and why both sides have to declare the dependencies they share.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { plugged } from "#federation/plugged.ts";
import { ENTRY, type Exposed, type Shared } from "#federation/settings.ts";

/**
 * The settings a package is built into a remote with.
 */
export interface Remoted {
  /**
   * The modules the remote exposes, keyed by the specifier a host imports them under.
   */
  exposes: Exposed;

  /**
   * The name every host knows this remote by. Fixed once a host names it.
   */
  name: string;

  /**
   * The dependencies this remote takes from its host rather than bundling.
   */
  shared?: Shared;
}

/**
 * Builds the contribution that turns a package into a loadable remote.
 *
 * @remarks
 *   The plugin package is imported only when the contribution's item is built, which happens while
 *   the config is composed. A repository that never adds this layer never reaches that import, so
 *   the optional peer can stay uninstalled.
 * @returns One contribution named federation.remote, carrying the remote's name.
 */
export function remote(stated: Remoted): Contribution {
  return contribute({
    at: "plugins",
    because: "another application loads these modules at run time rather than installing them",
    itemOf: () =>
      plugged({
        dts: false,
        exposes: { ...stated.exposes },
        filename: ENTRY,
        name: stated.name,
        shared: { ...stated.shared },
      }),
    name: `federation.remote(${stated.name})`,
  });
}

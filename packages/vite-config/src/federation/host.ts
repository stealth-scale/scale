/**
 * Configures an application to import modules served by another deployment.
 *
 * @remarks
 *   A host names each remote and gives no address. The deployment registers the address at run
 *   time, so one build runs against any deployment of the remotes it names.
 */

import { contribute, type Layer, preset } from "@stealthscale/vite-config-core";

import { plugged } from "#federation/plugged.ts";
import { type Remotes, type Shared, UNSET } from "#federation/settings.ts";

/**
 * The remotes an application imports from, and the terms it imports them on.
 */
export interface Hosted {
  /**
   * The name this application is known by to the federation runtime.
   */
  name: string;

  /**
   * Each remote this application imports from, by name alone.
   */
  remotes?: Remotes | undefined;

  /**
   * The dependencies a remote is expected to reuse from this host rather than bundle itself.
   */
  shared?: Shared;

  /**
   * A local module to stand in for each remote specifier, keyed as the import writes it.
   */
  stubs?: Readonly<Record<string, string>> | undefined;
}

/**
 * Builds the layers that resolve a remote import and alias each stand-in.
 *
 * @remarks
 *   Every remote is pointed at an address that resolves nowhere until a deployment registers the
 *   real one. The aliases apply to the test runner alone, which has no deployment to fetch a remote
 *   from.
 * @returns One layer, or two when stubs names at least one stand-in.
 */
export function host(stated: Hosted): readonly Layer[] {
  const held = contribute({
    at: "plugins",
    because: "these modules are fetched from another deployment rather than built into this one",
    itemOf: () =>
      plugged({
        dts: false,
        hostInitInjectLocation: "entry",
        name: stated.name,
        remotes: Object.fromEntries(
          (stated.remotes ?? []).map((named) => [
            named,
            { entry: `${UNSET}/${named}/remoteEntry.js`, name: named, type: "module" },
          ]),
        ),
        shared: { ...stated.shared },
      }),
    name: `federation.host(${stated.name})`,
  });

  if (stated.stubs === undefined) return [held];

  return [
    held,
    preset({
      config: { test: { alias: { ...stated.stubs } } },
      name: `federation.host(${stated.name}).stubs`,
    }),
  ];
}

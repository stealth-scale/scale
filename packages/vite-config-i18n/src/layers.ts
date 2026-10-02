/**
 * Collects the catalogue contributions into the layer list a configuration extends by.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { catalogued } from "#catalogued.ts";
import { type Options } from "#types.ts";
import { worded } from "#worded.ts";

/**
 * Returns the layers a package or an application with catalogues extends its tier with.
 *
 * @remarks
 *   A library and an application both ship catalogues. Each picks its own tier, so these
 *   contributions compose as a layer list that either tier extends by.
 * @param stated - The plugin options passed through to the catalogue plugin.
 */
export function layers(stated: Options = {}): readonly Layer[] {
  return [catalogued(stated), worded()];
}

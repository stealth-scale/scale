/**
 * Collects both contributions into the list a configuration extends by.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { catalogued } from "#catalogued.ts";
import { type Options } from "#types.ts";
import { worded } from "#worded.ts";

/**
 * Returns the layers a package or an application with catalogues extends its tier with.
 *
 * @remarks
 *   A list rather than a tier, because a library and an application both ship catalogues and each
 *   picks its own tier.
 * @param stated - The plugin options a repository departs on.
 */
export function layers(stated: Options = {}): readonly Layer[] {
  return [catalogued(stated), worded()];
}

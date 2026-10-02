/**
 * Assembles the layers a package with stylesheets extends its tier with.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { check, type Checked } from "#plugin/check.ts";

/**
 * Lists the layers a package with stylesheets extends its tier with.
 *
 * @remarks
 *   The result is one contribution, so its position among the other add-ons
 *   does not change the merged configuration. The contribution appends to
 *   Vite's `plugins` array and reads no key another layer sets.
 * @param stated - The globs and rules the check reads, forwarded unchanged.
 */
export function layers(stated: Checked = {}): readonly Layer[] {
  return [check(stated)];
}

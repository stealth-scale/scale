/**
 * Collects the layers a package that holds specimens extends its tier with.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { SPECIMENS } from "#specimens.ts";
import { uncounted } from "#uncounted.ts";

/**
 * Returns the layers a package holding specimens extends its tier with: the omission of every
 * specimen from the coverage the package is held to.
 *
 * @remarks
 *   A list rather than a tier, because a component package picks whichever tier its framework
 *   calls for and adds these. The lint departures are not among these layers: the linter runs
 *   from the workspace root, so a root config states them through `workspace()`.
 * @param files - Which files are specimens. Defaults to any `*.specimen.tsx` in the package.
 */
export function layers(files: readonly string[] = SPECIMENS): readonly Layer[] {
  return [...uncounted(files)];
}

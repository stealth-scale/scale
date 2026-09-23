/**
 * Coverage layers for a package that contains specimens.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { unmeasured } from "#examples.ts";
import { SPECIMENS } from "#specimens.ts";
import { uncounted } from "#uncounted.ts";

/**
 * Returns the coverage exclusions for the specimen and example files of a package.
 *
 * @remarks
 *   The function returns a layer list, not a tier, so a component package can add it to whichever
 *   tier its framework requires. Lint exemptions are declared at the workspace root through
 *   `workspace()`, because the linter reads only the root config.
 * @param files - Specimen globs. Defaults to every `*.specimen.tsx` file in the package.
 */
export function layers(files: readonly string[] = SPECIMENS): readonly Layer[] {
  return [...uncounted(files), ...unmeasured()];
}

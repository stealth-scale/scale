/**
 * Lint and coverage layers the workspace root declares for specimen and example files.
 *
 * @remarks
 *   The layers belong in the root config, not in the catalogue application. The linter reads only
 *   the root config, so a relaxation declared elsewhere is merged but never applied.
 */

import { lint } from "@stealthscale/vite-config";
import { type Layer, named } from "@stealthscale/vite-config-core";

import { undescribed, unmeasured } from "#examples.ts";
import { SPECIMENS } from "#specimens.ts";
import { uncounted } from "#uncounted.ts";

/**
 * Returns the layers the workspace root declares for specimen and example files.
 *
 * @remarks
 *   The coverage exclusions duplicate the per-package ones, because the root run counts the files
 *   of every package. Specimen files are exempt from `no-default-export`, the doc comment rules,
 *   `react/only-export-components` and `react/no-multi-comp`. Example files are exempt from the doc
 *   comment rules. Each layer records its reason in `because`.
 * @param files - Specimen globs. Defaults to every `*.specimen.tsx` file in the workspace.
 */
export function workspace(files: readonly string[] = SPECIMENS): readonly Layer[] {
  return [
    ...uncounted(files),

    named("specimen.exported", lint.defaultExported(files)),
    named("specimen.undocumented", lint.undocumented(files)),

    named(
      "specimen.described",
      lint.relax({
        because:
          "a specimen's default export is a page description rather than a component, and the " +
          "rule is a fast refresh convention that reads it as an anonymous one",
        files: [...files],
        rules: { "react/only-export-components": "off" },
      }),
    ),

    named(
      "specimen.composed",
      lint.relax({
        because:
          "a scene is built from the small components that arrange it, each drawn once beside the " +
          "caption explaining it, and splitting them into files of their own puts every piece " +
          "further from the picture it is part of",
        files: [...files],
        rules: { "react/no-multi-comp": "off" },
      }),
    ),

    ...unmeasured(),
    undescribed(),
  ];
}

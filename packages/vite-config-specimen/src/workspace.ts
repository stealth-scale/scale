/**
 * Relaxes the rules a specimen file is held to, and stops counting one, from the workspace root.
 *
 * @remarks
 *   Stated at the root rather than in the application that shows the catalogue, because the linter
 *   runs from the root and reads the root's configuration and no other. A relaxation stated
 *   elsewhere would compose, merge, and never be read, leaving a rule its author believes is off.
 */

import { lint } from "@stealthscale/vite-config";
import { type Layer, named } from "@stealthscale/vite-config-core";

import { SPECIMENS } from "#specimens.ts";
import { uncounted } from "#uncounted.ts";

/**
 * Returns the layers a workspace root states for the specimens below it.
 *
 * @remarks
 *   Every layer covers the same file. A specimen is read through its default export and is built
 *   from the small components that arrange one picture, which three rules written for ordinary
 *   modules each reject for a different reason. The omission is stated here as well as in the
 *   package holding the specimen, because the root run counts every package's files and reads the
 *   root's configuration for what to leave out.
 * @param files - Which files are specimens. Defaults to any `*.specimen.tsx` in the workspace.
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
  ];
}

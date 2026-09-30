/**
 * Exempts example files from coverage, from the doc comment rules and from the dependency cap.
 *
 * @remarks
 *   Example files are the code consumers copy, and the catalogue shows them verbatim, so doc
 *   comments would end up in the copied code. The example spec of each package renders its examples
 *   without interacting with them, so event handlers would count as uncovered functions. An example
 *   of a whole screen imports every package the screen is built from.
 */

import { lint, test } from "@stealthscale/vite-config";
import { type Contribution, type Layer, named } from "@stealthscale/vite-config-core";

import { renamed } from "#specimens.ts";

/**
 * Glob matching example files.
 */
export const EXAMPLES: readonly string[] = ["**/*.example.tsx"];

/**
 * Returns the coverage exclusion for example files.
 *
 * @param files - Example globs. Defaults to {@link EXAMPLES}.
 */
export function unmeasured(files: readonly string[] = EXAMPLES): readonly Contribution[] {
  return test
    .omit({
      because:
        "an example is the code a consumer copies, and its specification renders it without " +
        "pressing a control",
      files,
    })
    .map((contribution) => renamed(contribution, "test.omit", "specimen.example.uncounted"));
}

/**
 * Returns the lint layer that disables the doc comment rules for example files.
 *
 * @param files - Example globs. Defaults to {@link EXAMPLES}.
 */
export function undescribed(files: readonly string[] = EXAMPLES): Layer {
  return named("specimen.example.undocumented", lint.undocumented(files));
}

/**
 * Returns the lint layer that disables the dependency cap for example files.
 *
 * @remarks
 *   An example of an application shell renders a whole screen, and each region of the screen comes
 *   from its own package. Its dependency count is the number of packages the screen is built from,
 *   and one module per package would move the composition out of the file the catalogue shows.
 *   Only `import/max-dependencies` comes off.
 * @param files - Example globs. Defaults to {@link EXAMPLES}.
 */
export function uncapped(files: readonly string[] = EXAMPLES): Layer {
  return named(
    "specimen.example.composed",
    lint.relax({
      because:
        "an example renders a whole screen from the packages it is built from, and the catalogue " +
        "shows the one file",
      files: [...files],
      rules: { "import/max-dependencies": "off" },
    }),
  );
}

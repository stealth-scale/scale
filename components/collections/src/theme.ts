/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as listbox } from "#listbox/recipe.ts";
import { recipe as statusMatrix } from "#status-matrix/recipe.ts";
import { recipe as table } from "#table/recipe.ts";
import { recipe as transfer } from "#transfer/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-collections",
  theme: { extend: { slotRecipes: { listbox, statusMatrix, table, transfer } } },
});

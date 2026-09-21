/**
 * Preset that registers this package's slot recipes, for an application's compiler to install.
 *
 * @remarks
 *   The four recipes are listed by hand. A spec in this package fails when a recipe file is missing
 *   from the list, which catches the one mistake a generator would prevent.
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

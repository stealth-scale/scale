/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as button } from "#button/recipe.ts";
import { recipe as clipboard } from "#clipboard/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-actions",
  theme: { extend: { recipes: { button }, slotRecipes: { clipboard } } },
});

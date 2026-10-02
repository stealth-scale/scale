/**
 * Declares the preset an application's compiler installs to pick up this package's recipes.
 *
 * @remarks
 *   The list is maintained by hand. Nothing generates it, because the package's own specification
 *   fails when a recipe file in `src/` is missing from the preset.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as command } from "#command/recipe.ts";
import { recipe as dialog } from "#dialog/recipe.ts";
import { recipe as drawer } from "#drawer/recipe.ts";
import { recipe as tour } from "#tour/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-modals",
  theme: { extend: { slotRecipes: { command, dialog, drawer, tour } } },
});

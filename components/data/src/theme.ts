/**
 * Registers every recipe in the package in the preset an application's style compiler installs.
 *
 * @remarks
 *   The list is written by hand. `theme.spec.ts` fails when a recipe file is missing from it, so no
 *   generator writes it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as badge } from "#badge/recipe.ts";
import { recipe as colorSwatch } from "#color-swatch/recipe.ts";
import { recipe as stat } from "#stat/recipe.ts";
import { recipe as status } from "#status/recipe.ts";
import { recipe as tag } from "#tag/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-data",
  theme: { extend: { recipes: { badge, colorSwatch }, slotRecipes: { stat, status, tag } } },
});

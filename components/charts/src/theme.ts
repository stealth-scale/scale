/**
 * Registers every recipe in the package in the preset an application's style compiler installs.
 *
 * @remarks
 *   The list is written by hand. `theme.spec.ts` fails when a recipe file is missing from it, so no
 *   generator writes it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as chart } from "#chart/recipe.ts";
import { recipe as heat } from "#heat/recipe.ts";
import { recipe as spark } from "#spark/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-charts",
  theme: {
    extend: {
      recipes: { spark },
      slotRecipes: { chart, heat },
    },
  },
});

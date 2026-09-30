/**
 * Registers every recipe in the package in the preset an application's style compiler installs.
 *
 * @remarks
 *   The list is written by hand. `theme.spec.ts` fails when a recipe file is missing from it, so no
 *   generator writes it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as dataTable } from "#data-table/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-tables",
  theme: {
    extend: {
      slotRecipes: { dataTable },
    },
  },
});

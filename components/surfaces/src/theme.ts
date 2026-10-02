/**
 * Publishes the preset an application's style compiler installs to pick up this package's recipes.
 *
 * @remarks
 *   The list of recipes is maintained by hand. The package's own specification fails when a recipe
 *   file is missing from it, which is why nothing generates the list.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as card } from "#card/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-surfaces",
  theme: { extend: { slotRecipes: { card } } },
});

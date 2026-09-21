/**
 * Declares the preset an application's compiler installs to pick up this package's recipes.
 *
 * @remarks
 *   The list is maintained by hand. Nothing generates it, because the package's own specification
 *   fails when a recipe file in `src/` is missing from the preset.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as rovingFocus } from "#roving-focus/recipe.ts";
import { recipe as skipNav } from "#skip-nav/recipe.ts";
import { recipe as visuallyHidden } from "#visually-hidden/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-a11y",
  theme: { extend: { recipes: { visuallyHidden }, slotRecipes: { rovingFocus, skipNav } } },
});

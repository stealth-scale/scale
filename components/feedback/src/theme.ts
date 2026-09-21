/**
 * Registers every recipe in this package as a preset an application's compiler installs.
 *
 * @remarks
 *   The registration list is maintained by hand rather than generated, because this package's own
 *   spec fails when a recipe file is missing from it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as alert } from "#alert/recipe.ts";
import { recipe as emptyState } from "#empty-state/recipe.ts";
import { recipe as skeletonText } from "#skeleton-text/recipe.ts";
import { recipe as skeleton } from "#skeleton/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-feedback",
  theme: {
    extend: { recipes: { skeleton, skeletonText }, slotRecipes: { alert, emptyState } },
  },
});

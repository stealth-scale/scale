/**
 * Registers every recipe in the package in the preset an application's style compiler installs.
 *
 * @remarks
 *   The list is written by hand. `theme.spec.ts` fails when a recipe file is missing from it, so
 *   no generator writes it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as alert } from "#alert/recipe.ts";
import { recipe as emptyState } from "#empty-state/recipe.ts";
import { recipe as loader } from "#loader/recipe.ts";
import { recipe as skeletonText } from "#skeleton-text/recipe.ts";
import { recipe as skeleton } from "#skeleton/recipe.ts";
import { recipe as spinner } from "#spinner/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-feedback",
  theme: {
    extend: {
      recipes: { skeleton, skeletonText, spinner },
      slotRecipes: { alert, emptyState, loader },
    },
  },
});

/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as breadcrumb } from "#breadcrumb/recipe.ts";
import { recipe as link } from "#link/recipe.ts";
import { recipe as navList } from "#nav-list/recipe.ts";
import { recipe as toc } from "#toc/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-navigation",
  theme: { extend: { recipes: { link }, slotRecipes: { breadcrumb, navList, toc } } },
});

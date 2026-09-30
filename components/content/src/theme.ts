/**
 * Declares the preset an application's compiler installs to pick up this package's recipes.
 *
 * @remarks
 *   The list is maintained by hand. Nothing generates it, because the package's own specification
 *   fails when a recipe file in `src/` is missing from the preset.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as codeBlock } from "#code-block/recipe.ts";
import { recipe as jsonTreeView } from "#json-tree-view/recipe.ts";
import { recipe as markdown } from "#markdown/recipe.ts";
import { recipe as marquee } from "#marquee/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-content",
  theme: { extend: { slotRecipes: { codeBlock, jsonTreeView, markdown, marquee } } },
});

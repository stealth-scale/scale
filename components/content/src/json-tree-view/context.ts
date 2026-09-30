/**
 * Binds the JSON tree view's recipe to the tree view's root and tree.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#json-tree-view/recipe.ts";

/**
 * Binds the recipe once. The root provides the size and the tree reads it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

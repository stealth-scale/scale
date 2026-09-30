/**
 * Binds the heat recipe to a heat grid's parts.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#heat/recipe.ts";

/**
 * Binds the recipe once. The frame provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Binds the sample recipe to the elements that draw it.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#sample/recipe.ts";

/**
 * The binders for the part that takes the variants and the parts that read them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

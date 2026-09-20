/**
 * Binds the matrix recipe to its parts.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#matrix/recipe.ts";

/**
 * The two binders: the root provides the count across, and every other part reads it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

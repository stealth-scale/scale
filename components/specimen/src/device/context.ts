/**
 * Binds the device recipe to the elements that draw its parts.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#device/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

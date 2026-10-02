/**
 * Binds the swap's recipe to its parts.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#swap/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and each indicator reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

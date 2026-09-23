/**
 * Binds the quote recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#quote/recipe.ts";

/**
 * Creates the quote recipe's `withContext` binding.
 */
export const { withContext } = createRecipeContext(recipe);

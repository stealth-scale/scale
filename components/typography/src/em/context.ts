/**
 * Binds the em recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#em/recipe.ts";

/**
 * Creates the em recipe's `withContext` binding.
 */
export const { withContext } = createRecipeContext(recipe);

/**
 * Binds the screen recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#screen/recipe.ts";

/**
 * Creates the screen recipe's `withContext` binding and its `PropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

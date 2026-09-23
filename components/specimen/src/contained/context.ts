/**
 * Binds the contained recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#contained/recipe.ts";

/**
 * Creates the contained recipe's `withContext` binding and its `PropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

/**
 * Binds the floated recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#floated/recipe.ts";

/**
 * Creates the floated recipe's `withContext` binding and its `PropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

/**
 * Binds the group recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#group/recipe.ts";

/**
 * Creates the group recipe's `withContext` binding and its `PropsProvider`.
 *
 * @remarks
 *   `PropsProvider` sets variants on every element bound below it. The package exports it as
 *   `GroupPropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

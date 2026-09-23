/**
 * Binds the visually-hidden recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#visually-hidden/recipe.ts";

/**
 * Creates the visually-hidden recipe's `withContext` binding and its `PropsProvider`.
 *
 * @remarks
 *   `PropsProvider` sets variants on every element bound below it. The package exports it as
 *   `VisuallyHiddenPropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

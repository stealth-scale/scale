/**
 * Binds the spacer recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#spacer/recipe.ts";

/**
 * Creates the spacer recipe's `withContext` binding and its `PropsProvider`.
 *
 * @remarks
 *   The recipe has no variants, so `PropsProvider` passes only data attributes. The package
 *   exports it as `SpacerPropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

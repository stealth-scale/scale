/**
 * Binds the divider recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#divider/recipe.ts";

/**
 * Creates the divider recipe's `withContext` binding, its `PropsProvider` and `usePropsContext`.
 *
 * @remarks
 *   `PropsProvider` sets variants on every element bound below it. The package exports it as
 *   `DividerPropsProvider`. `Divider` reads `usePropsContext` for the provided orientation.
 */
export const { PropsProvider, usePropsContext, withContext } = createRecipeContext(recipe);

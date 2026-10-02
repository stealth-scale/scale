/**
 * Binds the skeleton text recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because an application's compiler imports the
 *   recipe at build time and the binding needs the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skeleton-text/recipe.ts";

/**
 * Factory for the column and the provider that sets its props for descendants.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

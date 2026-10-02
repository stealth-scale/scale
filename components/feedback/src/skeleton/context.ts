/**
 * Binds the skeleton recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because an application's compiler imports the
 *   recipe at build time and the binding needs the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skeleton/recipe.ts";

/**
 * Factory for the skeleton and the skeleton text bars, and the provider that sets their variants
 * for descendants.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

/**
 * Binds the link recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because an application's compiler imports the
 *   recipe at build time and the binding needs the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#link/recipe.ts";

/**
 * Factory for the link element and the provider that sets its variants for descendants.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

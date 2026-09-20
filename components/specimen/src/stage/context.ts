/**
 * Binds the stage recipe to the element that draws it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#stage/recipe.ts";

/**
 * The binder, and the provider that sets defaults for every stage below it.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

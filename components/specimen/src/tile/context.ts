/**
 * Binds the tile recipe to the element that draws it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#tile/recipe.ts";

/**
 * The binder, and the provider that sets defaults for every tile below it.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

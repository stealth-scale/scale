/**
 * Binds the room recipe to the element that draws it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#room/recipe.ts";

/**
 * The binder, and the provider that sets defaults for every room below it.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

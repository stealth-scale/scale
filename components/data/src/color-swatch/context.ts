/**
 * Binds the colour swatch recipe to the element that renders it.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because an application's style compiler imports the
 *   recipe at build time, and a binding there would pull the React runtime into that import.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#color-swatch/recipe.ts";

/**
 * Supplies the element factory the swatch is built from.
 */
export const { withContext } = createRecipeContext(recipe);

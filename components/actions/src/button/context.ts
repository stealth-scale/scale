/**
 * Binds the button recipe to the elements that render it.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because an application's style compiler imports the
 *   recipe at build time, and a binding there would pull the React runtime into that import.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#button/recipe.ts";

/**
 * Supplies the element factory `Button` and `IconButton` are built from, and the provider an
 * ancestor sets their variants through.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

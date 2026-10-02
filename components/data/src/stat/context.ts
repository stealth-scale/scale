/**
 * Binds the stat recipe to the elements that render it.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because an application's style compiler imports the
 *   recipe at build time, and a binding there would pull the React runtime into that import.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#stat/recipe.ts";

/**
 * Supplies the element factories the stat parts are built from.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

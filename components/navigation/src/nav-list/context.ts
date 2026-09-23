/**
 * Binds the navigation list recipe to the elements that render its parts.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because an application's style compiler imports the
 *   recipe at build time, and a binding there would pull the React runtime into that import.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#nav-list/recipe.ts";

/**
 * Supplies the root's factory, which receives the variants, and the part factory every other part
 * reads them through.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Binds the clipboard slot recipe to a React context its parts share.
 *
 * @remarks
 *   This sits outside `recipe.ts` because a consuming application's style compiler imports the
 *   recipe at build time and would pull the React runtime in with it, and outside `machine.ts`
 *   because appearance and behaviour have no reason to change together.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#clipboard/recipe.ts";

/**
 * Supplies the factory the root publishes the recipe's variants with, and the factory each other
 * part reads them through.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

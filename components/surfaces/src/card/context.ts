/**
 * Binds the card slot recipe to a React context its parts share.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because a consuming application's style compiler
 *   imports the recipe at build time. Binding a context there would pull the React runtime into
 *   every compiler configuration that reads it.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#card/recipe.ts";

/**
 * Supplies the factory the root publishes the recipe's variants with, and the factory each band
 * reads them through.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

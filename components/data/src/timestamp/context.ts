/**
 * Binds the timestamp recipe to React.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#timestamp/recipe.ts";

/**
 * Supplies the element factories the timestamp's parts are built from.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

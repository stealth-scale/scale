/**
 * Binds the command recipe to its parts.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime. It is apart from `state.ts`, because the recipe styles the parts
 *   and the state filters the actions.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#command/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

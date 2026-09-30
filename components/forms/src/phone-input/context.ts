/**
 * Binds the phone input's recipe to the React context its picker's parts share.
 *
 * @remarks
 *   The binding is a separate module from `recipe.ts`, because an application's style compiler
 *   imports the recipe at build time without the React runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#phone-input/recipe.ts";

/**
 * Factories that bind the picker, which resolves the variants, and every other part, which reads
 * them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

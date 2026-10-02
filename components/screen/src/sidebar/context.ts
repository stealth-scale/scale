/**
 * Binds the sidebar's recipe to the elements of its parts.
 *
 * @remarks
 *   The binding is in its own module, because an application's compiler reads the recipe at build
 *   time and the binding imports the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#sidebar/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

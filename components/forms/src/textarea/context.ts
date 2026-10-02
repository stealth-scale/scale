/**
 * Binds the textarea recipe to React.
 *
 * @remarks
 *   The binding is a separate module because an application's compiler reads `recipe.ts` at build
 *   time and the binding needs the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#textarea/recipe.ts";

/**
 * Binds the recipe once. The root receives the variants and the control reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Binds the form recipe to React.
 *
 * @remarks
 *   The binding is a separate module because an application's compiler reads `recipe.ts` at build
 *   time and the binding needs the runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#form/recipe.ts";

/**
 * Binds the recipe once. The form element receives the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

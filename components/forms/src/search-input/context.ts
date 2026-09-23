/**
 * Binds the clear control's recipe to React.
 *
 * @remarks
 *   The binding is a separate module because an application's compiler reads `recipe.ts` at build
 *   time and the binding needs the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#search-input/recipe.ts";

/**
 * Binds the recipe once for the clear control.
 */
export const { withContext } = createRecipeContext(recipe);

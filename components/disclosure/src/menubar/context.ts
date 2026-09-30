/**
 * Binds the menubar recipe to React.
 *
 * @remarks
 *   The binding is a separate module because an application's compiler reads `recipe.ts` at build
 *   time and the binding needs the runtime. The bar's state is in `bar.ts`.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#menubar/recipe.ts";

/**
 * Binds the recipe once. The root receives the size and every other part reads it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

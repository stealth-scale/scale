/**
 * Binds the toggle recipe to React.
 *
 * @remarks
 *   The binding is a separate module because an application's compiler reads `recipe.ts` at build
 *   time and the binding needs the runtime. The behaviour is in `machine.ts`.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#password-input/recipe.ts";

/**
 * Binds the recipe once. The root provides the size, and the toggle reads it.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

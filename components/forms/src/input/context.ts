/**
 * Binds the input recipe to React.
 *
 * @remarks
 *   The binding is a separate module because an application's compiler reads `recipe.ts` at build
 *   time and the binding needs the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#input/recipe.ts";

/**
 * Binds the recipe once for the input and for the provider that sets its variants in a subtree.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

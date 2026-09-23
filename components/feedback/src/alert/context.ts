/**
 * Binds the alert slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because an application's compiler imports the
 *   recipe at build time and the binding needs the React runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#alert/recipe.ts";

/**
 * Factories for the parts. The root resolves the variants once and the other parts read them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Binds the empty state slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because an application's compiler imports the
 *   recipe at build time and the binding needs the React runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#empty-state/recipe.ts";

/**
 * Factories for the parts. The root resolves the size once and the other parts read it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

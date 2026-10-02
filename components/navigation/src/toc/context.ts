/**
 * Binds the table of contents slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because an application's compiler imports the
 *   recipe at build time and the binding needs the React runtime. It is separate from the machine,
 *   because the recipe sets the styles and the machine sets the state.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#toc/recipe.ts";

/**
 * Factories for the parts. The root resolves the variants once and the other parts read them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

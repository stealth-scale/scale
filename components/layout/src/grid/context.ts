/**
 * Binds the grid slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#grid/recipe.ts";

/**
 * Creates the grid recipe's `withProvider` and `withContext` bindings.
 *
 * @remarks
 *   The root and the item are both bound with `withProvider`, because each takes axes of its own.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

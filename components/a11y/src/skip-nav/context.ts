/**
 * Binds the skip-nav slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime. The link and the target each use
 *   `withProvider`, because neither is rendered inside the other.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skip-nav/recipe.ts";

/**
 * Creates the skip-nav recipe's `withProvider` binding.
 */
export const { withProvider } = createSlotRecipeContext(recipe);

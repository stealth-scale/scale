/**
 * Binds the roving-focus slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime. The root resolves the variants, and each
 *   item reads its slot class from the root's context.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#roving-focus/recipe.ts";

/**
 * Creates the roving-focus recipe's `withProvider` binding for the root and `withContext` for the
 * items.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

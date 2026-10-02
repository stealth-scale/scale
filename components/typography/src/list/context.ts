/**
 * Binds the list slot recipe to React.
 *
 * @remarks
 *   The binding is a separate module from the recipe, because the theme compiler imports the recipe
 *   at build time and must not load the React runtime.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#list/recipe.ts";

/**
 * Creates the list recipe's `withProvider` and `withContext` bindings.
 *
 * @remarks
 *   `withProvider` binds the root, which takes the variants and provides the slot classes.
 *   `withContext` binds each other part, which reads its slot classes from the root.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

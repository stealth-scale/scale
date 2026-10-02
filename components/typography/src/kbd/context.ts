/**
 * Binds the kbd and kbd-group recipes to React.
 *
 * @remarks
 *   The bindings are a separate module from the recipes, because the theme compiler imports a
 *   recipe at build time and must not load the React runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe as group } from "#kbd/kbd-group.recipe.ts";
import { recipe } from "#kbd/recipe.ts";

/**
 * Creates the kbd recipe's `withContext` binding and its `PropsProvider`.
 *
 * @remarks
 *   `Kbd.Group` sets its size, look and palette on every keycap inside it through `PropsProvider`.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

/**
 * Creates the kbd-group recipe's `withContext` binding.
 */
export const { withContext: withGroupContext } = createRecipeContext(group);

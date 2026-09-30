/**
 * Binds the spark recipe to the element that renders it.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#spark/recipe.ts";

/**
 * Supplies the element factory the spark's box is built from.
 */
export const { withContext } = createRecipeContext(recipe);

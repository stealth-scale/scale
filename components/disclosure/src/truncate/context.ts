/**
 * Binds the truncate recipe to React.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#truncate/recipe.ts";

/**
 * Factory for the `span` the clipped text renders.
 */
export const { withContext } = createRecipeContext(recipe);

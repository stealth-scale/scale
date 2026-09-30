/**
 * Binds the format recipe to React.
 *
 * @remarks
 *   The binding is apart from the recipe, because a compiler reads the recipe at build time and the
 *   binding imports the runtime.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#format/recipe.ts";

/**
 * Factory for the `data` element both formats render.
 */
export const { withContext } = createRecipeContext(recipe);

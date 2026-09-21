/**
 * Binds the placeholder paragraph's recipe to the element that renders it.
 *
 * @remarks
 *   The binding sits apart from the recipe because a consuming application's compiler imports the
 *   recipe at build time and has no use for the runtime this module pulls in.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skeleton-text/recipe.ts";

/**
 * Binds the recipe once, for the column the bars are stacked in.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

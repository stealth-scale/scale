/**
 * Binds the skeleton recipe to the element that renders it.
 *
 * @remarks
 *   The binding sits apart from the recipe because a consuming application's compiler imports the
 *   recipe at build time. Keeping the runtime here leaves React out of the module graph that every
 *   compiler configuration has to load.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skeleton/recipe.ts";

/**
 * Binds the recipe once, for the skeleton itself, for the lines skeleton text renders, and for the
 * provider an ancestor sets their variants through.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

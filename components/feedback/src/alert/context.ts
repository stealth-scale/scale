/**
 * Binds the alert recipe to the styled elements that render each of its slots.
 *
 * @remarks
 *   The binding sits apart from the recipe because a consuming application's compiler imports the
 *   recipe at build time. Keeping the runtime here leaves React out of the module graph that every
 *   compiler configuration has to load.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#alert/recipe.ts";

/**
 * Binds the recipe once, so that the root publishes the resolved variants and the remaining slots
 * consume them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

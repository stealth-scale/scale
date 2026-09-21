/**
 * Binds the empty state recipe to the styled elements that render each of its slots.
 *
 * @remarks
 *   The binding sits apart from the recipe because a consuming application's compiler imports the
 *   recipe at build time and has no use for the runtime this module pulls in.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#empty-state/recipe.ts";

/**
 * Binds the recipe once, so that the root publishes the resolved size and the remaining slots
 * consume it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

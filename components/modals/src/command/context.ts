/**
 * Connects the slot recipe to React.
 *
 * @remarks
 *   Kept apart from `recipe.ts` so an application's compiler can read the recipe at build time
 *   without pulling React in with it, and apart from `state.ts` because styling and filtering are
 *   independent concerns that happen to share a component tree.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#command/recipe.ts";

/**
 * A single binding of the recipe: `withProvider` wraps the root, `withContext` wraps every other
 * slot beneath it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

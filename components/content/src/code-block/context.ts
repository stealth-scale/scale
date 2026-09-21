/**
 * Connects the slot recipe to React.
 *
 * @remarks
 *   This is a separate module from `recipe.ts` so that an application's compiler can read the
 *   recipe at build time without pulling React in with it.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#code-block/recipe.ts";

/**
 * A single binding of the recipe: `withProvider` wraps the root, `withContext` wraps every other
 * slot beneath it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

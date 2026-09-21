/**
 * Connects the slot recipe to React.
 *
 * @remarks
 *   This is a separate module from `recipe.ts` so that an application's compiler can read the
 *   recipe at build time without pulling React in with it. The root resolves the variants and
 *   publishes them, and each item takes its slot class from there rather than from its own props.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#roving-focus/recipe.ts";

/**
 * A single binding of the recipe: `withProvider` wraps the root, `withContext` wraps each slot
 * beneath it.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Connects the slot recipe to React.
 *
 * @remarks
 *   This is a separate module from `recipe.ts` so that an application's compiler can read the
 *   recipe at build time without pulling React in with it. Only `withProvider` is taken, because
 *   the two slots are never nested: the link sits at the top of the document and the target sits
 *   wherever the content begins, so neither can resolve variants for the other.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#skip-nav/recipe.ts";

/**
 * A single binding of the recipe, used to wrap the link and the target independently.
 */
export const { withProvider } = createSlotRecipeContext(recipe);

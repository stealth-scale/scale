/**
 * Binds the table of contents' recipe to the elements that draw its parts.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. Apart from the machine, because the recipe decides how a part
 *   is drawn and the machine decides what it does.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#toc/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

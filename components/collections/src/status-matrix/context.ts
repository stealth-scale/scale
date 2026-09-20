/**
 * Binds the matrix's recipe to the elements that draw its parts.
 *
 * @remarks
 *   Apart from the recipe, because an application's compiler reads the recipe at build time and
 *   the binding needs the runtime. A recipe file that also bound one would put the runtime behind
 *   every compiler configuration that reads it.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#status-matrix/recipe.ts";

/**
 * Binds the recipe once. The root provides the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

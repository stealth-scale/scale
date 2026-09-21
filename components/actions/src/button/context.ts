/**
 * Binds the button recipe to a React context the styled elements share.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because a consuming application's style compiler
 *   imports the recipe at build time. Binding a context there would pull the React runtime into
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#button/recipe.ts";

/**
 * Supplies the element factory the button and the icon button are built from, and the provider an
 * ancestor uses to set variants on both.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

/**
 * Binds the badge recipe to a React context the styled element reads.
 *
 * @remarks
 *   The binding is kept out of `recipe.ts` because a consuming application's style compiler
 *   imports the recipe at build time. Binding a context there would pull the React runtime into
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#badge/recipe.ts";

/**
 * Supplies the element factory the badge is built from, and the provider an ancestor uses to set
 * its variants.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

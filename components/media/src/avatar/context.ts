/**
 * Binds the avatar slot recipe and the badge recipe to the elements that render them.
 *
 * @remarks
 *   The bindings are kept out of the recipe modules because an application's style compiler
 *   imports the recipes at build time, and a binding there would pull the React runtime into that
 *   import.
 */

import { createRecipeContext, createSlotRecipeContext } from "@stealthscale/theme";

import { recipe as badge } from "#avatar/avatar-badge.recipe.ts";
import { recipe } from "#avatar/recipe.ts";

/**
 * Factories that bind an element to a slot: `withProvider` for the root and the group, which take
 * the variants, and `withContext` for the image and the fallback, which read them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Binds the badge's element, which takes the badge recipe's variants as props.
 */
export const { withContext: withBadgeContext } = createRecipeContext(badge);

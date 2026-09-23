/**
 * Binds the clipboard slot recipe to the React context its parts share.
 *
 * @remarks
 *   The binding lives outside `recipe.ts`, because the style compiler of an application imports
 *   the recipe at build time and must not load React. It lives outside `machine.ts`, because the
 *   styles and the behaviour change independently.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#clipboard/recipe.ts";

/**
 * Factories that bind an element to a slot: `withProvider` for the root, which provides the
 * variants, and `withContext` for every other part, which reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

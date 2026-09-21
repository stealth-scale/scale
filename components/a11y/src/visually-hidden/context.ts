/**
 * Connects the recipe to React.
 *
 * @remarks
 *   This is deliberately a separate module from `recipe.ts`. An application's compiler imports the
 *   recipe at build time, and a recipe module that also created the context would drag React into
 *   every compiler configuration that reads it.
 */

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#visually-hidden/recipe.ts";

/**
 * A single binding of the recipe, shared by the component and by any ancestor that supplies its
 * variants through the provider.
 */
export const { PropsProvider, withContext } = createRecipeContext(recipe);

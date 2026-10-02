/**
 * Binds the checkbox recipe and the checkbox group's recipe to React.
 *
 * @remarks
 *   The bindings are a separate module because an application's compiler reads the recipes at build
 *   time and a binding needs the runtime. The behaviour is in `machine.ts` and `grouping.ts`.
 */

import { createRecipeContext, createSlotRecipeContext } from "@stealthscale/theme";

import { recipe as group } from "#checkbox/checkbox-group.recipe.ts";
import { recipe } from "#checkbox/recipe.ts";

/**
 * Binds the recipe once. The root receives the variants and every other part reads them.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

/**
 * Binds the group's element, which takes the group recipe's variants as props.
 */
export const { withContext: withGroupContext } = createRecipeContext(group);

/**
 * Runtime wiring between the blockquote's slot recipe and its React parts.
 *
 * @remarks
 *   This is a separate module from the recipe because a consuming application's compiler reads the
 *   recipe at build time, when no React runtime exists. Keeping the two apart means the recipe can
 *   be imported by the compiler without dragging the component code along.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#blockquote/recipe.ts";

/**
 * Element wrappers for the recipe's slots. `withProvider` builds the root, which accepts the
 * variant props and publishes the resolved slot classes on a context; `withContext` builds each
 * remaining part, which reads its own class off that context.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);

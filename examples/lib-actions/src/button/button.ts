/**
 * Renders a button bound to its recipe.
 *
 * @remarks
 *   The binding sets `data-recipe` on the element and applies the class of each variant the caller
 *   passes. The component sets no color, size or margin of its own. The recipe owns them, so a
 *   theme restyles every button by extending the recipe.
 */

import { type ComponentProps } from "react";

import { createRecipeContext } from "@stealthscale/theme";

import { recipe } from "#button/button.recipe.ts";

/**
 * Binds the recipe to the elements that render it.
 */
const { withContext } = createRecipeContext(recipe);

/**
 * Renders a `button` with a look, a size and a palette.
 */
export const Button = withContext("button");

/**
 * Describes the props of `Button`: the recipe's variants and the props of a `button` element.
 */
export type ButtonProps = ComponentProps<typeof Button>;

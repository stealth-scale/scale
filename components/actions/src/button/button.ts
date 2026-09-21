/**
 * Renders a button through the button recipe.
 *
 * @remarks
 *   A native `button` element already gets focus, Space and Enter activation, and an accessible
 *   name from its content, so none of that is reimplemented here. The component contributes no
 *   colour, size or shape of its own; the recipe owns all of it, so extending the recipe restyles
 *   every button in a theme. Pass `as` to swap the element, for instance an anchor that looks like
 *   a button.
 */

import { type ComponentProps } from "react";

import { withContext } from "#button/context.ts";

/**
 * Renders a `button` element styled by the recipe, with `type` fixed to `button` so that placing
 * one inside a form does not submit it.
 */
export const Button = withContext("button", { defaultProps: { type: "button" } });

/**
 * Combines the recipe's variants with every prop a `button` element accepts.
 */
export type ButtonProps = ComponentProps<typeof Button>;

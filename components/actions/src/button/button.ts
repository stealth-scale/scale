/**
 * Renders a `button` element styled by the button recipe.
 *
 * @remarks
 *   The native element provides focus, activation with Space and Enter, and an accessible name from
 *   its content. The recipe supplies every style, so a theme that extends the recipe restyles every
 *   button. Pass `as` to render another element, such as an anchor.
 */

import { type ComponentProps } from "react";

import { withContext } from "#button/context.ts";

/**
 * Renders a `button` element with `type` defaulting to `button`, so a button inside a form does not
 * submit it.
 */
export const Button = withContext("button", { defaultProps: { type: "button" } });

/**
 * Combines the recipe's variants with the props of a `button` element.
 */
export type ButtonProps = ComponentProps<typeof Button>;

/**
 * Renders the band holding a card's controls.
 *
 * @remarks
 *   The element is a `div` with no role. The controls lie in a wrapping row, so a narrow card
 *   stacks them instead of overflowing. The `justify` axis places them: a card with one destructive
 *   action and one safe one pushes them to opposite ends about as often as it groups them at the
 *   end.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the footer slot, laying out the controls a reader acts on.
 */
export const Footer = withContext("div", "footer");

/**
 * Accepts every prop the styled div takes.
 */
export type FooterProps = ComponentProps<typeof Footer>;

/**
 * Renders the band that contains a card's controls.
 *
 * @remarks
 *   The element is a `div` with no role. It lays its controls in a wrapping row, so a narrow card
 *   wraps them onto a second line. The root's `justify` axis aligns them, at the end by default.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the footer slot.
 */
export const Footer = withContext("div", "footer");

/**
 * Describes the props of `Footer`: the props of a `div`.
 */
export type FooterProps = ComponentProps<typeof Footer>;

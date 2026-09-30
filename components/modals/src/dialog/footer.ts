/**
 * Renders the band at the bottom of the panel, with the dialog's actions.
 *
 * @remarks
 *   The footer lines its children up at the inline end and wraps them onto a second row when they
 *   do not fit. Place the least destructive action first, so it comes first in the tab order.
 */

import { type ComponentProps } from "react";

import { withContext } from "#dialog/context.ts";

/**
 * Renders the `div` with the dialog's footer class.
 */
export const Footer = withContext("div", "footer");

/**
 * Describes the props of the footer: the props of a `div`.
 */
export type FooterProps = ComponentProps<typeof Footer>;

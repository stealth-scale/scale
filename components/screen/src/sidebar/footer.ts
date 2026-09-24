/**
 * Renders the row at the end of the sidebar.
 *
 * @remarks
 *   The footer contains what a person expects in a fixed place: the account, a help link, the
 *   control that collapses the sidebar. It remains in place while the content scrolls. On a rail it
 *   shows its icon and hides its words visually.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the footer `div` at the sidebar's size.
 */
export const Footer = withContext("div", "footer");

/**
 * Describes the props of `Footer`.
 */
export type FooterProps = ComponentProps<typeof Footer>;

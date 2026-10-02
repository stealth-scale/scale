/**
 * Renders the row at the start of the sidebar.
 *
 * @remarks
 *   The header contains a workspace switcher, a logo or a home link. It remains in place while the
 *   content scrolls. On a rail it shows its icon and hides its words visually.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the header `div` at the sidebar's size.
 */
export const Header = withContext("div", "header");

/**
 * Describes the props of `Header`.
 */
export type HeaderProps = ComponentProps<typeof Header>;

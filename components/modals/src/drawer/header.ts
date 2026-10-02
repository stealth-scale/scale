/**
 * Renders the band at the top of the panel, with the title over the description.
 *
 * @remarks
 *   The element is a `div` with no role, because the title supplies the heading. While the panel
 *   contains a close trigger, the header pads its inline end past the close trigger, so a long
 *   title wraps before it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#drawer/context.ts";

/**
 * Renders the `div` with the drawer's header class.
 */
export const Header = withContext("div", "header");

/**
 * Describes the props of the header: the props of a `div`.
 */
export type HeaderProps = ComponentProps<typeof Header>;

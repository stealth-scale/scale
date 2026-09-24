/**
 * Renders the group of header rows.
 *
 * @remarks
 *   The element is a `thead`. With `stickyHeader` its rows stick to the top of the scroller on
 *   the panel fill.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `thead` with the table's header class.
 */
export const Header = withContext("thead", "header");

/**
 * Describes the props of the header: the props of a `thead`.
 */
export type HeaderProps = ComponentProps<typeof Header>;

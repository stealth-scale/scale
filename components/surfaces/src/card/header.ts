/**
 * Renders the band a card opens with.
 *
 * @remarks
 *   The element is a `div` with no role: the title inside it supplies the heading, and a role here
 *   would announce a grouping that does not exist. The band is a three-column grid holding the
 *   indicator, the title block and the aside. The title and the description take one row each of
 *   the middle column, so a mark on either side spans both of them without a wrapper the anatomy
 *   does not name.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the header slot, holding the title between the marks on either side of it.
 */
export const Header = withContext("div", "header");

/**
 * Accepts every prop the styled div takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;

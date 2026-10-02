/**
 * Renders the band a card opens with.
 *
 * @remarks
 *   The element is a `div` with no role, because the title supplies the heading. It is a grid of
 *   three columns: the indicator, the title over the description, and the aside. Place those parts
 *   directly inside it. A header without an indicator or an aside needs no other markup.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the header slot.
 */
export const Header = withContext("div", "header");

/**
 * Describes the props of `Header`: the props of a `div`.
 */
export type HeaderProps = ComponentProps<typeof Header>;

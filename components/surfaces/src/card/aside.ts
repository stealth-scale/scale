/**
 * Renders the region against the end of a card's header.
 *
 * @remarks
 *   The element is a `div` holding whatever a card carries beside its title: a menu, a close
 *   button, a switch, a badge. It occupies the last column of the header grid and spans both of
 *   its rows. A control here comes before the card's content in the keyboard order, which is what
 *   a reader expects from something drawn at the top. A card whose main action belongs after its
 *   content puts that action in the footer instead.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the aside slot against the header's end.
 */
export const Aside = withContext("div", "aside");

/**
 * Accepts every prop the styled div takes.
 */
export type AsideProps = ComponentProps<typeof Aside>;

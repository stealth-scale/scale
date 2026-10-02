/**
 * Renders the end column of a card's header.
 *
 * @remarks
 *   The element is a `div` for a menu, a button, a switch or a badge beside the title. It is in the
 *   header grid's third column, spans the title and description rows, and is centred on them. A
 *   control here precedes the content in the tab order. Put the card's main action in the footer.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the aside slot at the end of the header.
 */
export const Aside = withContext("div", "aside");

/**
 * Describes the props of `Aside`: the props of a `div`.
 */
export type AsideProps = ComponentProps<typeof Aside>;

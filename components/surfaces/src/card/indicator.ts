/**
 * Renders the mark at the start of a card's header.
 *
 * @remarks
 *   The element is a `div` in the header grid's first column, spanning the title and description
 *   rows. The recipe sizes an `img` placed directly inside it as a round avatar of 32 to 56px and
 *   an `svg` to the card size's icon size. Label a meaningful mark. Give a decorative
 *   icon `aria-hidden` and a decorative image `alt=""`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the indicator slot at the start of the header.
 */
export const Indicator = withContext("div", "indicator");

/**
 * Describes the props of `Indicator`: the props of a `div`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;

/**
 * Renders the mark a card's header opens with.
 *
 * @remarks
 *   The element is a `div` holding a glyph, an avatar or a status dot. It occupies the first column
 *   of the header grid and spans both of its rows, so the mark sits against the title and the
 *   description together rather than against one of them. A mark carrying meaning is labelled by
 *   the caller; a decorative one passes `aria-hidden`, which keeps a screen reader from announcing
 *   a glyph before every card.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the indicator slot at the start of the header.
 */
export const Indicator = withContext("div", "indicator");

/**
 * Accepts every prop the styled div takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;

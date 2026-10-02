/**
 * Renders the part of a card that lays out its words and its circle.
 *
 * @remarks
 *   The element is a `span`, because the card is a `label` and a label contains only phrasing
 *   content. The recipe lays it out as a grid: the title and the description in the first column
 *   and the circle in the second, or the circle above the words on a stacked card.
 */

import { type ComponentProps } from "react";

import { withContext } from "#radio-card/context.ts";

/**
 * Renders the `span` with the radio card's item content class.
 */
export const ItemContent = withContext("span", "itemContent");

/**
 * Describes the props of the content: the props of a `span`.
 */
export type ItemContentProps = ComponentProps<typeof ItemContent>;

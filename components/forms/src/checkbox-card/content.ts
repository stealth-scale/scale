/**
 * Renders the part of a checkbox card that lays out its words and its box.
 *
 * @remarks
 *   The element is a `span`, because the card is a `label` and a label contains only phrasing
 *   content. The recipe lays it out as a grid: the title and the description in the first column
 *   and the box in the second, or the box above the words on a stacked card.
 */

import { type ComponentProps } from "react";

import { withContext } from "#checkbox-card/context.ts";

/**
 * Renders the `span` with the checkbox card's content class.
 */
export const Content = withContext("span", "content");

/**
 * Describes the props of the content: the props of a `span`.
 */
export type ContentProps = ComponentProps<typeof Content>;

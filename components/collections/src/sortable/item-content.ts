/**
 * Renders a row's content: the caller's words and marks in a row that takes the rest of the row
 * after the handle.
 *
 * @remarks
 *   The content grows, so a mark placed after it, such as a status badge, is at the row's end. It
 *   may shrink below its content's width, so a long title wraps and the list keeps its width.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sortable/context.ts";

/**
 * Renders the content's `div` with the recipe's item content class.
 */
export const ItemContent = withContext("div", "itemContent");

/**
 * Describes the props of a row's content: the props of a `div`.
 */
export type ItemContentProps = ComponentProps<typeof ItemContent>;

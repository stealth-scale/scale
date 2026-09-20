/**
 * Stacks a row's words and the line of explanation under them.
 *
 * @remarks
 *   A row is a line of things laid side by side, with the mark at its end. A row that carries a
 *   second line needs the two lines held together as one thing, or the mark would sit beside the
 *   first line and the second would push it off centre. This is that holder: the words above the
 *   line, and the pair centred against the mark however tall they grow.
 *   It carries no part of the machine and says nothing to a screen reader. The row is named by its
 *   words and says whether it is chosen, and a box between the two that announced itself would put
 *   a group where a reader expects a row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Draws the column the words and the line sit in.
 */
export const ItemLines = withContext("span", "itemLines");

/**
 * Describes what a row's stacked lines take: everything a styled span element takes.
 */
export type ItemLinesProps = ComponentProps<typeof ItemLines>;

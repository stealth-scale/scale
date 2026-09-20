/**
 * Draws the line of explanation under one row's words.
 *
 * @remarks
 *   For a list whose names do not tell a reader enough to choose: what a thing settles in, when it
 *   was last touched, who owns it. The line takes a whole line of the row, so the words and the
 *   mark stay together above it and a column of marks reads straight down however tall the rows
 *   become.
 *   The element carries no part of the machine. The row it sits in is already named by its words
 *   and already says whether it is chosen, so a second line that announced itself would say the
 *   same thing twice to a screen reader. A caller whose line carries something the name does not
 *   points the row's `aria-describedby` at it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Draws the line a step below the row's words, in the muted ink.
 */
export const ItemDescription = withContext("span", "itemDescription");

/**
 * Describes what a row's line of explanation takes: everything a styled span element takes.
 */
export type ItemDescriptionProps = ComponentProps<typeof ItemDescription>;

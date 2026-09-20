/**
 * Draws the box at the start of a row that says whether the row is in the set.
 *
 * @remarks
 *   For a list a person picks several rows from. A check at the end of a row says a row is on; a
 *   box at the start of every row says the list is one a reader may take several from, before they
 *   touch it. That is the difference a reader needs before the first press, so a list in the
 *   multiple mode draws boxes and a list in the single mode draws a check.
 *   The box carries nothing of the machine. The row above it already says whether it is chosen,
 *   through `data-selected`, and the box reads that from the row rather than asking the machine a
 *   second time. It is hidden from a screen reader for the same reason: the row announces its own
 *   state, and a box that announced it again would say it twice.
 *   It is not a checkbox. A control inside a row a person presses is a second thing to reach and a
 *   second thing to read out, and the row is already both.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Draws the box, filled from the row's own state.
 */
export const ItemCheckbox = withContext("span", "itemCheckbox", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes what a row's box takes: everything a styled span element takes.
 */
export type ItemCheckboxProps = ComponentProps<typeof ItemCheckbox>;

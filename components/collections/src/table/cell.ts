/**
 * Renders one data cell.
 *
 * @remarks
 *   The element is a `td`. A cell with `data-numeric` aligns to the end in tabular figures, so a
 *   column of figures aligns on the decimal point.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `td` with the table's cell class.
 */
export const Cell = withContext("td", "cell");

/**
 * Describes the props of a cell: the props of a `td`.
 */
export type CellProps = ComponentProps<typeof Cell>;

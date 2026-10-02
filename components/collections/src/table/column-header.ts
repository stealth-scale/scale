/**
 * Renders the header of a column.
 *
 * @remarks
 *   The element is a `th` with `scope="col"`, so a screen reader reads it with each cell below. A
 *   header over figures states `data-numeric`, which aligns it to the end. A sortable column's
 *   header states `aria-sort`. Sorting is the caller's.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `th` with the table's column header class and `scope="col"`.
 */
export const ColumnHeader = withContext("th", "columnHeader", {
  defaultProps: { scope: "col" },
});

/**
 * Describes the props of a column header: the props of a `th`.
 */
export type ColumnHeaderProps = ComponentProps<typeof ColumnHeader>;

/**
 * Creates the column helper a data table's columns are written with.
 *
 * @remarks
 *   TanStack's helper takes the table's features as a type, so a column's `meta` reads the kit's
 *   `ColumnMeta` and a caller needs no import from TanStack.
 */

import {
  type ColumnHelper,
  createColumnHelper as createHelper,
  type RowData,
} from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";

/**
 * Creates a column helper typed with the kit's features.
 *
 * @typeParam Row - Type of one record.
 * @returns TanStack's helper: `accessor`, `display`, `group` and `columns`.
 */
export function createColumnHelper<Row extends RowData>(): ColumnHelper<Features, Row> {
  return createHelper<Features, Row>();
}

/**
 * Reads and writes the columns a column manager lists: the columns a person can hide in the table's
 * order, whether each is visible, and the table's order after a person moves one.
 *
 * @remarks
 *   The manager lists every leaf column that can hide, which leaves out the kit's select, expand
 *   and pin columns. A move changes the order of the listed columns among themselves and keeps
 *   every other column at its place, because TanStack puts a column its order leaves out after
 *   every column it names.
 */

import { type Column, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Returns the columns a column manager lists, in the table's order.
 *
 * @param table - The table whose columns are read.
 * @returns Each leaf column that can hide.
 */
export function listedOf(table: DataTableApi): Array<Column<Features, RowData>> {
  return table.getAllLeafColumns().filter((column) => column.getCanHide());
}

/**
 * Returns whether a column is visible.
 *
 * @param table - The table whose visibility is read.
 * @param id - The column's id.
 * @returns `false` while the table hides the column.
 */
export function visibleOf(table: DataTableApi, id: string): boolean {
  return table.state.columnVisibility[id] !== false;
}

/**
 * Returns the table's order with the listed columns in a new order and every other column at its
 * place.
 *
 * @param all - The ids of every leaf column, in the table's order.
 * @param next - The ids of the listed columns, in their new order.
 * @returns The ids of every leaf column, in the new order.
 */
export function reordered(all: readonly string[], next: readonly string[]): string[] {
  const listed = new Set(next);
  const queue = [...next];

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- next names each listed id once, so the queue fills every listed place
  return all.map((id) => (listed.has(id) ? (queue.shift() as string) : id));
}

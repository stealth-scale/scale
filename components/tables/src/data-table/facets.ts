/**
 * Reads a column's filter through the table: its value, its faceted values with their counts, the
 * least and the greatest of its faceted figures, and a range filter's two ends.
 *
 * @remarks
 *   Each reader takes the table, a new object after every change, so a compiled part reads the
 *   state again. The faceted values and figures come from the rows the other columns' filters and
 *   the search leave, which is TanStack's faceting, so a filter offers the values a row still has.
 *   A chosen value that no row has any more remains in the list with a count of zero, so a person
 *   can clear it.
 */

import { type Column, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes a faceted value and the number of rows that have it.
 */
export type Facet = readonly [value: unknown, count: number];

/**
 * Describes a range filter's minimum and maximum, each undefined while it is open.
 */
export type Ends = readonly [low: number | undefined, high: number | undefined];

/**
 * Orders faceted values as words, and figures within them by their value.
 */
const ORDER = new Intl.Collator(undefined, { numeric: true });

/**
 * Returns a column's filter value.
 *
 * @param table - The table whose filters are read.
 * @param id - The column's id.
 * @returns The value, or undefined while the column does not filter.
 */
export function filterOf(table: DataTableApi, id: string): unknown {
  return table.state.columnFilters.find((filter) => filter.id === id)?.value;
}

/**
 * Returns the table's own column of a column, whose faceting follows the table's state.
 */
function ownOf(table: DataTableApi, column: Column<Features, RowData>): Column<Features, RowData> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a column's actions receive a column of their own table
  return table.getColumn(column.id) as Column<Features, RowData>;
}

/**
 * Returns a column's faceted values with their counts, in the order of their words, and every
 * chosen value no row has any more with a count of zero.
 *
 * @param table - The table whose rows are faceted.
 * @param column - The column whose values are counted.
 * @returns The values and their counts, without an empty value.
 */
export function facetsOf(table: DataTableApi, column: Column<Features, RowData>): Facet[] {
  const counts = new Map<unknown, number>(ownOf(table, column).getFacetedUniqueValues());
  const chosen = filterOf(table, column.id);

  for (const value of Array.isArray(chosen) ? chosen : []) {
    if (!counts.has(value)) counts.set(value, 0);
  }

  return [...counts]
    .filter(([value]) => value !== undefined && value !== null && value !== "")
    .toSorted(([a], [b]) => ORDER.compare(String(a), String(b)));
}

/**
 * Returns the least and the greatest of a column's faceted figures.
 *
 * @param table - The table whose rows are faceted.
 * @param column - The column whose figures are read.
 * @returns The two figures, or undefined for a column without figures.
 */
export function extentOf(
  table: DataTableApi,
  column: Column<Features, RowData>,
): readonly [number, number] | undefined {
  return ownOf(table, column).getFacetedMinMaxValues();
}

/**
 * Returns a range filter's two ends from its value.
 *
 * @param value - The filter's value, an array of two figures while it filters.
 * @returns The minimum and the maximum, each undefined while it is not a figure.
 */
export function endsOf(value: unknown): Ends {
  if (!Array.isArray(value)) return [undefined, undefined];

  const figures: readonly unknown[] = value;
  const [low, high] = figures;

  return [typeof low === "number" ? low : undefined, typeof high === "number" ? high : undefined];
}

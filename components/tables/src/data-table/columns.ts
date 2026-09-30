/**
 * Reads a column's state through the table: its sort direction, its pin region, whether it may
 * hide, its name and the id of the name in its header, where its panels open, whether the table
 * lays out its columns at their sizes and renders a footer row, a pinned column's and a fitted
 * column's cell attributes, a cell's spans and whether its span ends on the body's last row.
 *
 * @remarks
 *   Each reader takes the table, a new object after every change, so a compiled part reads the
 *   state again: a column remains the same object across changes, and a part that asked it alone
 *   would memoize the result on it. A pinned column sticks at the sum of the sizes before it in its
 *   region, and a resized column takes the size a person gives it, so a table with pinned or
 *   resizable columns lays out every column at its size, TanStack's `size`, in a fixed layout as
 *   wide as the sizes together. A table without either lays out its columns by their content.
 */

import { type ReactNode } from "react";

import { type Cell, type Column, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes a column of a data table, which a column's actions receive.
 */
export type TableColumn = Column<Features, RowData>;

/**
 * Describes the function that returns the controls a column's header renders beside its name, such
 * as `DataTable.ColumnMenu`, from the column.
 */
export type ColumnActions = (column: TableColumn) => ReactNode;

/**
 * Describes a sort direction in the words `aria-sort` takes.
 */
export type Direction = "ascending" | "descending";

/**
 * Describes the attributes of a pinned column's cell: the region, whether the cell is at the
 * region's edge, and its offset in a custom property the recipe reads.
 */
export interface Pinned {
  /**
   * Region the column sticks to.
   */
  readonly "data-pinned"?: "end" | "start";

  /**
   * Present on the cells of the column at the edge of its region, next to the scrolling columns.
   */
  readonly "data-pinned-edge"?: "";

  /**
   * Offset of the cell from its region's edge.
   */
  readonly style?: Readonly<Record<string, string>>;
}

/**
 * Describes the spans of a cell that spans more than one row or column.
 */
export interface Spans {
  /**
   * Number of columns the cell spans, while more than one.
   */
  readonly colSpan?: number;

  /**
   * Number of rows the cell spans, while more than one.
   */
  readonly rowSpan?: number;
}

/**
 * Returns the direction a column is sorted in.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose state is read.
 * @param id - The column's id.
 * @returns The direction, or undefined while the column is not sorted.
 */
export function sortOf<Row extends RowData>(
  table: DataTableApi<Row>,
  id: string,
): Direction | undefined {
  const sorted = table.state.sorting.find((sort) => sort.id === id);

  if (sorted === undefined) return undefined;

  return sorted.desc ? "descending" : "ascending";
}

/**
 * Returns the region a column is pinned to.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose pinned columns are read.
 * @param id - The column's id.
 * @returns The region, or `false` while the column is not pinned.
 */
export function regionOf<Row extends RowData>(
  table: DataTableApi<Row>,
  id: string,
): "end" | "start" | false {
  const { end, start } = table.state.columnPinning;

  if (start.includes(id)) return "start";

  return end.includes(id) ? "end" : false;
}

/**
 * Returns whether a person may hide a column: the column can hide, and another column that can
 * hide is visible.
 *
 * @remarks
 *   The kit's select, expand and pin columns cannot hide, so a table always shows a column of
 *   records.
 * @typeParam Row - Type of one record.
 * @param table - The table whose visible columns are read.
 * @param column - The column to hide.
 * @returns Whether the column may hide.
 */
export function hideableOf<Row extends RowData>(
  table: DataTableApi<Row>,
  column: Column<Features, Row>,
): boolean {
  const others = table
    .getVisibleLeafColumns()
    .filter((visible) => visible.id !== column.id && visible.getCanHide());

  return column.getCanHide() && others.length > 0;
}

/**
 * Returns a column's name: its `meta.label`, its header when the header is a string, or its id.
 *
 * @typeParam Row - Type of one record.
 * @param column - The column to name.
 * @returns The name.
 */
export function labelOf<Row extends RowData>(column: Column<Features, Row>): string {
  const { header, meta } = column.columnDef;

  return meta?.label ?? (typeof header === "string" ? header : column.id);
}

/**
 * Returns the id of the element that contains a column's name in its header.
 *
 * @remarks
 *   The header's id is encoded, because an element's id takes no whitespace and a caller's column
 *   ids may contain spaces.
 * @param prefix - The root's unique prefix.
 * @param id - The header's id.
 * @returns The name element's id.
 */
export function nameIdOf(prefix: string, id: string): string {
  return `${prefix}-name-${encodeURIComponent(id)}`;
}

/**
 * Returns whether the table lays out its columns at their sizes.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose options and state are read.
 * @returns `true` while resizing is on or a column is pinned.
 */
export function sizedOf<Row extends RowData>(table: DataTableApi<Row>): boolean {
  const { end, start } = table.state.columnPinning;

  return table.options.enableColumnResizing === true || start.length + end.length > 0;
}

/**
 * Returns where a column's menu or filter panel opens: under the header's start, or under its end
 * in a column of figures, whose actions precede its name at the header's end.
 *
 * @typeParam Row - Type of one record.
 * @param column - The column whose header opens the panel.
 * @returns The placement the disclosure parts take.
 */
export function placementOf<Row extends RowData>(
  column: Column<Features, Row>,
): "bottom-end" | "bottom-start" {
  return column.columnDef.meta?.numeric === true ? "bottom-end" : "bottom-start";
}

/**
 * Returns whether the table renders a footer row: a visible column states a footer.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose visible columns are read.
 * @returns `true` while a visible column states `footer`.
 */
export function footedOf<Row extends RowData>(table: DataTableApi<Row>): boolean {
  return table.getVisibleLeafColumns().some((column) => column.columnDef.footer !== undefined);
}

/**
 * Returns the attribute of a column's cells that fit their content: `data-fit` while the column
 * states `meta.fit`, and none otherwise.
 *
 * @typeParam Row - Type of one record.
 * @param column - The column whose cells are rendered.
 * @returns The attribute to spread onto each of the column's cells.
 */
export function fitOf<Row extends RowData>(
  column: Column<Features, Row>,
): Readonly<Record<string, string>> {
  return column.columnDef.meta?.fit === true ? { "data-fit": "" } : {};
}

/**
 * Returns a cell's spans: none for a cell that spans one row and one column.
 *
 * @remarks
 *   TanStack's cell spanning reports a span of `0` for a cell another cell covers. The body skips a
 *   covered cell, because `rowspan="0"` spans the rest of the row group in HTML.
 * @typeParam Row - Type of one record.
 * @param cell - The cell to read.
 * @returns The `colSpan` and `rowSpan` to spread onto the cell.
 */
export function spansOf<Row extends RowData>(cell: Cell<Features, Row>): Spans {
  const columns = cell.getColSpan();
  const rows = cell.getRowSpan();

  return { ...(columns > 1 ? { colSpan: columns } : {}), ...(rows > 1 ? { rowSpan: rows } : {}) };
}

/**
 * Returns the attribute of a cell whose rows span ends on the body's last row: `data-span-end`,
 * which the recipe reads to drop the cell's rule where the last row drops its own.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose rendered rows are read.
 * @param cell - The cell to read.
 * @returns The attribute to spread onto the cell, or none for a cell that spans one row or ends
 *   before the last row.
 */
export function spanEndOf<Row extends RowData>(
  table: DataTableApi<Row>,
  cell: Cell<Features, Row>,
): Readonly<Record<string, string>> {
  const span = cell.getRowSpan();

  if (span < 2) return {};

  const { rows } = table.getCellSpanIndex();

  return rows.indexOf(cell.row) + span === rows.length ? { "data-span-end": "" } : {};
}

/**
 * Returns the attributes of a column's cells: none for a column that is not pinned.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose pinned columns are read.
 * @param column - The column whose cells are rendered.
 * @returns The attributes to spread onto each of the column's cells.
 */
export function pinnedOf<Row extends RowData>(
  table: DataTableApi<Row>,
  column: Column<Features, Row>,
): Pinned {
  const region = column.getIsPinned();

  if (region === false) return {};

  const starts = region === "start";
  const neighbours = starts ? table.getStartVisibleLeafColumns() : table.getEndVisibleLeafColumns();
  const edge = (starts ? neighbours.at(-1) : neighbours[0]) === column;
  const offset = starts ? column.getStart("start") : column.getAfter("end");

  return {
    "data-pinned": region,
    ...(edge ? { "data-pinned-edge": "" as const } : {}),
    style: { "--pin-offset": `${String(offset)}px` },
  };
}

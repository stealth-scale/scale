/**
 * Reads a row's state through the table: whether it is selected or expanded, the state of its box
 * and of the box that selects every row, whether it renders a row under it, the detail a column
 * renders there, the region a row renders in, and the ids and keys of a row's elements.
 *
 * @remarks
 *   Each reader takes the table, a new object after every change, so a compiled part reads the
 *   state again: a row remains the same object across changes, and a part that asked it alone would
 *   memoize the result on it. TanStack states every row expanded as `true`, and some rows as a
 *   record by id.
 */

import { type ReactNode } from "react";

import { type RowData, type Row as TableRow } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes the state of a checkbox that selects rows: on, off or partly on.
 */
export type Selected = "indeterminate" | boolean;

/**
 * Describes the region of the body a row renders in: pinned to the top, pinned to the bottom, or
 * between them.
 */
export type Region = "bottom" | "center" | "top";

/**
 * Describes one row of the body in render order, with its region.
 *
 * @typeParam Row - Type of one record.
 */
export interface Placed<Row extends RowData> {
  /**
   * Whether the row is the last of its region and another region follows it.
   */
  readonly ends: boolean;

  /**
   * Region the row renders in.
   */
  readonly region: Region;

  /**
   * The row.
   */
  readonly row: TableRow<Features, Row>;
}

/**
 * Returns the body's rows in render order: the rows pinned to the top, the rows between, then the
 * rows pinned to the bottom.
 *
 * @remarks
 *   TanStack keeps a pinned row in its region whatever the sort, the filters or the page, unless
 *   the table states `keepPinnedRows: false`. Its cell spans are counted in the same order, so the
 *   body renders the regions in it.
 * @typeParam Row - Type of one record.
 * @param table - The table whose rows are read.
 * @returns Every row with its region.
 */
export function regionsOf<Row extends RowData>(
  table: DataTableApi<Row>,
): ReadonlyArray<Placed<Row>> {
  const regions: ReadonlyArray<readonly [Region, ReadonlyArray<TableRow<Features, Row>>]> = [
    ["top", table.getTopRows()],
    ["center", table.getCenterRows()],
    ["bottom", table.getBottomRows()],
  ];
  const filled = regions.filter(([, rows]) => rows.length > 0);

  return filled.flatMap(([region, rows], at) =>
    rows.map((row, index) => ({
      ends: index === rows.length - 1 && at < filled.length - 1,
      region,
      row,
    })),
  );
}

/**
 * Returns whether a row is selected.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose state is read.
 * @param id - The row's id.
 * @returns `true` while the row is selected.
 */
export function selectedOf<Row extends RowData>(table: DataTableApi<Row>, id: string): boolean {
  return table.state.rowSelection[id] === true;
}

/**
 * Returns the state of a row's box: on while the row or every row under it is selected, partly on
 * while some rows under it are, and off otherwise.
 *
 * @remarks
 *   TanStack selects the rows under a row with the row, and a person may select each of them
 *   instead, which leaves the row's own id out of the selection.
 * @typeParam Row - Type of one record.
 * @param table - The table whose state is read.
 * @param id - The row's id.
 * @returns The box's state.
 */
export function checkedOf<Row extends RowData>(table: DataTableApi<Row>, id: string): Selected {
  const row = table.getRow(id);

  if (selectedOf(table, id) || row.getIsAllSubRowsSelected()) return true;

  return row.getIsSomeSelected() ? "indeterminate" : false;
}

/**
 * Returns whether a row's box accepts a press.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose options are read.
 * @param id - The row's id.
 * @returns `true` while the row can be selected.
 */
export function selectableOf<Row extends RowData>(table: DataTableApi<Row>, id: string): boolean {
  return table.getRow(id).getCanSelect();
}

/**
 * Returns the state of the checkbox that selects every row: on while every row is selected, partly
 * on while some are, and off otherwise.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose state is read.
 * @returns The checkbox's state.
 */
export function everySelectedOf<Row extends RowData>(table: DataTableApi<Row>): Selected {
  if (table.getIsAllRowsSelected()) return true;

  return table.getIsSomeRowsSelected() ? "indeterminate" : false;
}

/**
 * Returns whether the table renders a column whose cells select their rows, which makes each row
 * state `aria-selected`.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose columns are read.
 * @returns `true` while a visible column states `meta.selects`.
 */
export function selectsOf<Row extends RowData>(table: DataTableApi<Row>): boolean {
  return table.getVisibleLeafColumns().some((column) => column.columnDef.meta?.selects === true);
}

/**
 * Returns whether a row is expanded.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose state is read.
 * @param id - The row's id.
 * @returns `true` while the row is expanded.
 */
export function expandedOf<Row extends RowData>(table: DataTableApi<Row>, id: string): boolean {
  const { expanded } = table.state;

  return expanded === true || expanded[id] === true;
}

/**
 * Returns the region a row is pinned to, from the table's pinning state.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose state is read.
 * @param id - The row's id.
 * @returns `top` or `bottom` for a pinned row, and `false` for a row that is not pinned.
 */
export function pinOf<Row extends RowData>(
  table: DataTableApi<Row>,
  id: string,
): "bottom" | "top" | false {
  const { bottom, top } = table.state.rowPinning;

  if (top.includes(id)) return "top";

  return bottom.includes(id) ? "bottom" : false;
}

/**
 * Returns whether a row can be pinned.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose options are read.
 * @param id - The row's id.
 * @returns `true` while the table lets the row pin.
 */
export function pinnableOf<Row extends RowData>(table: DataTableApi<Row>, id: string): boolean {
  return table.getRow(id).getCanPin();
}

/**
 * Returns whether a row opens a detail: it can expand and has no sub-rows, which it opens instead.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose options and rows are read.
 * @param id - The row's id.
 * @returns `true` while the row can open a detail.
 */
export function detailableOf<Row extends RowData>(table: DataTableApi<Row>, id: string): boolean {
  const row = table.getRow(id);

  return row.getCanExpand() && row.subRows.length === 0;
}

/**
 * Returns whether an expanded row renders a full-width row under it: the detail a column renders,
 * or in a table with levels the row that waits for the rows under it.
 *
 * @remarks
 *   A row with sub-rows renders them instead, so a group row renders no detail of its first record.
 *   A row that waits can expand, has no sub-rows yet, and is in a table without a detail column.
 * @typeParam Row - Type of one record.
 * @param table - The table whose expansion is read.
 * @param row - The row to read.
 * @param detail - Whether a visible column renders details.
 * @param leveled - Whether the table has levels.
 * @returns `true` while the row renders a row under it.
 */
export function detailedOf<Row extends RowData>(
  table: DataTableApi<Row>,
  row: TableRow<Features, Row>,
  detail: boolean,
  leveled: boolean,
): boolean {
  if (row.subRows.length > 0 || !expandedOf(table, row.id)) return false;

  return detail || (leveled && row.getCanExpand());
}

/**
 * Returns the detail of the first visible column that renders one.
 *
 * @typeParam Row - Type of one record.
 * @param table - The table whose columns are read.
 * @returns The function that renders a record's detail, or undefined without such a column.
 */
export function detailOf<Row extends RowData>(
  table: DataTableApi<Row>,
): ((record: RowData) => ReactNode) | undefined {
  for (const column of table.getVisibleLeafColumns()) {
    const detail = column.columnDef.meta?.detail;

    if (detail !== undefined) return detail;
  }

  return undefined;
}

/**
 * Returns the id of the detail row under a row.
 *
 * @remarks
 *   The row's id is encoded, because an element's id takes no whitespace and a caller's row ids
 *   may contain spaces.
 * @param prefix - The root's unique prefix.
 * @param id - The row's id.
 * @returns The detail row's id.
 */
export function detailIdOf(prefix: string, id: string): string {
  return `${prefix}-detail-${encodeURIComponent(id)}`;
}

/**
 * Returns the id of a row's pin toggle, which the toggle focuses after the row moves.
 *
 * @remarks
 *   The row's id is encoded, as a detail row's id is.
 * @param prefix - The root's unique prefix.
 * @param id - The row's id.
 * @returns The toggle's id.
 */
export function pinIdOf(prefix: string, id: string): string {
  return `${prefix}-pin-${encodeURIComponent(id)}`;
}

/**
 * Returns the id of a record's row in a table with levels, which a keystroke focuses.
 *
 * @remarks
 *   The row's id is encoded, as a detail row's id is.
 * @param prefix - The root's unique prefix.
 * @param id - The record's id, which may contain spaces.
 * @returns The row element's id.
 */
export function rowIdOf(prefix: string, id: string): string {
  return `${prefix}-row-${encodeURIComponent(id)}`;
}

/**
 * Prefix of a record's line key.
 */
const RECORD = "record:";

/**
 * Returns the key of a line of the body: a record's row, or the detail row under it.
 *
 * @remarks
 *   A record's key starts with `record:` and a detail's with `detail:`, so no two lines share a
 *   key whatever the caller's row ids are.
 * @param id - The row's id.
 * @param detail - Whether the line is the detail row.
 * @returns `record:` or `detail:` followed by the row's id.
 */
export function lineKeyOf(id: string, detail: boolean): string {
  return detail ? `detail:${id}` : `${RECORD}${id}`;
}

/**
 * Returns the id of the record whose row an element is, from the row's `data-key`.
 *
 * @param target - The element, such as the target of a focus or a keystroke.
 * @returns The row's id, or undefined for an element that is not a record's row.
 */
export function recordIdOf(target: EventTarget): string | undefined {
  if (!(target instanceof HTMLTableRowElement)) return undefined;

  const key = target.dataset["key"];

  return key?.startsWith(RECORD) === true ? key.slice(RECORD.length) : undefined;
}

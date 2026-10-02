/**
 * Creates a data table over every stock feature TanStack Table offers.
 *
 * @remarks
 *   The hook subscribes to every state slice, so the component that calls it renders again on each
 *   change and hands `DataTable.Root` a new table. Rows, cells, columns and headers remain the same
 *   objects across changes, so every part reads state through the table. A table shows every row
 *   until the caller states a page size, sorts ascending first, and resizes no column until the
 *   caller turns resizing on, because each column's resize separator is a tab stop. A column's menu
 *   offers no grouping until the caller turns grouping on, and a grouping the caller states groups
 *   the rows either way. A column resizes while the pointer drags, because the kit renders no line
 *   that previews the size. The drag, the resize keys and the arrows that open and close a row
 *   follow the locale provider's direction unless the caller states `columnResizeDirection`, and
 *   run left to right outside a provider. A grid keeps its selected cells when `data` changes, so
 *   an edit written into `data` leaves the focused cell where it is.
 */

import { use } from "react";

import { type ReactTable, type RowData, type TableOptions, useTable } from "@tanstack/react-table";

import { LocaleContext } from "@stealthscale/provider-locale";

import { FEATURES, type Features } from "#data-table/features.ts";

/**
 * Describes the options of a data table: TanStack's table options without `features`, which the
 * kit states.
 *
 * @typeParam Row - Type of one record.
 */
export type DataTableOptions<Row extends RowData> = Omit<TableOptions<Features, Row>, "features">;

/**
 * Describes the table `useDataTable` returns, which `DataTable.Root` takes.
 *
 * @typeParam Row - Type of one record.
 */
export type DataTableApi<Row extends RowData = RowData> = ReactTable<Features, Row>;

/**
 * Page state of a table whose caller states no page size: one page of every row.
 */
const EVERY_ROW = { pageIndex: 0, pageSize: Number.POSITIVE_INFINITY };

/**
 * Creates a data table and renders the calling component again on every change of its state.
 *
 * @typeParam Row - Type of one record.
 * @param options - TanStack's table options without `features`. A stated option applies over the
 *   kit's default.
 * @returns The table, a new object after each change.
 */
export function useDataTable<Row extends RowData>(
  options: DataTableOptions<Row>,
): DataTableApi<Row> {
  const direction = use(LocaleContext)?.direction ?? "ltr";

  return useTable({
    autoResetCellSelection: false,
    columnResizeDirection: direction,
    columnResizeMode: "onChange",
    enableColumnResizing: false,
    enableGrouping: false,
    sortDescFirst: false,
    ...options,
    features: FEATURES,
    initialState: { pagination: EVERY_ROW, ...options.initialState },
  });
}

/**
 * Exports the data table kit: `useDataTable`, which creates a table over TanStack Table, the column
 * helper its columns are written with, `selectColumn`, whose boxes select rows, `expandColumn`,
 * whose buttons open a detail row, `pinColumn`, whose toggles pin rows, `pivot`, which creates a
 * cross-tab's columns and rows from records, `DataTable.Root`, which provides the table,
 * `DataTable.Table`, which renders it, `DataTable.ColumnFilter`, which filters a column from its
 * header, `DataTable.ColumnMenu`, which sorts, pins and hides a column from its header,
 * `DataTable.ColumnManager`, which orders, shows and hides the columns, `DataTable.Search`, which
 * filters the rows by any value, and `DataTable.Pagination` with `DataTable.PageSize`, which page
 * them.
 */

export {
  type ColumnFiltersState,
  type ExpandedState,
  type GroupingState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
export { ColumnFilter, type ColumnFilterProps } from "#data-table/column-filter.tsx";
export { createColumnHelper } from "#data-table/column-helper.ts";
export { ColumnManager, type ColumnManagerProps } from "#data-table/column-manager.tsx";
export {
  ColumnMenu,
  type ColumnMenuAction,
  type ColumnMenuIndicators,
  type ColumnMenuProps,
} from "#data-table/column-menu.tsx";
export { type ColumnActions, type TableColumn } from "#data-table/columns.ts";
export {
  type PivotAggregate,
  type PivotAggregator,
  type PivotCell,
  type PivotColumn,
  type PivotField,
  type PivotRow,
} from "#data-table/cross-tab.ts";
export { expandColumn, type ExpandColumnOptions } from "#data-table/expand-column.tsx";
export { type CellEdit, type ColumnMeta, type EditorProps } from "#data-table/features.ts";
export { PageSize, type PageSizeProps } from "#data-table/page-size.tsx";
export { TablePagination as Pagination, type PaginationProps } from "#data-table/pagination.tsx";
export { pinColumn, type PinColumnOptions } from "#data-table/pin-column.tsx";
export { type Pivot, pivot, type PivotOptions } from "#data-table/pivot.tsx";
export { Root, type RootProps } from "#data-table/root.tsx";
export { Search, type SearchProps } from "#data-table/search.tsx";
export { selectColumn, type SelectColumnOptions } from "#data-table/select-column.tsx";
export { Table, type TableProps } from "#data-table/table.tsx";
export {
  type DataTableApi,
  type DataTableOptions,
  useDataTable,
} from "#data-table/use-data-table.ts";
export { type CellEditEvent } from "#data-table/use-grid.tsx";

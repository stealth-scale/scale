/**
 * Declares the table features every data table registers, and what a column states about its
 * cells.
 *
 * @remarks
 *   The kit registers every stock feature with its row model and every stock sort, filter and
 *   aggregation function, 30.2 kB gzipped in all. A feature changes the rows only once its state
 *   asks for it: a table sorts once a column is sorted and groups once a column is grouped.
 */

import { type ReactNode } from "react";

import {
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  type RowData,
  stockFeatures,
  tableFeatures,
} from "@tanstack/react-table";

import { AGGREGATION_FNS, FILTER_FNS, SORT_FNS } from "#data-table/registries.ts";

/**
 * Describes the props a column's editor receives: its name, its state, the draft, and the calls
 * that change, save or abandon the draft.
 */
export interface EditorProps {
  /**
   * Id of the reason a value was refused, which the control's description points at, or
   * undefined while no value is refused.
   */
  readonly "aria-describedby": string | undefined;

  /**
   * Whether the table refused the last value saved.
   */
  readonly "aria-invalid": boolean;

  /**
   * Accessible name of the control, which names the column.
   */
  readonly "aria-label": string;

  /**
   * Abandons the edit: the draft is dropped and focus returns to the cell.
   */
  readonly cancel: () => void;

  /**
   * Saves the draft, or the value passed, through the column's check and the table's
   * `onCellEdit`. A control that knows its value when a person picks it passes the value.
   */
  readonly commit: (next?: string) => void;

  /**
   * Id of the control, which takes focus when the editor opens.
   */
  readonly id: string;

  /**
   * Replaces the draft.
   */
  readonly setValue: (next: string) => void;

  /**
   * Size of the table, which the control takes so its text matches the cells'.
   */
  readonly size: "lg" | "md" | "sm";

  /**
   * The draft.
   */
  readonly value: string;
}

/**
 * Describes how a grid edits a column's cells: the control and the check of a value.
 */
export interface CellEdit {
  /**
   * Renders the control that edits a cell. A text field at the table's size unless stated.
   */
  readonly editor?: ((props: EditorProps) => ReactNode) | undefined;

  /**
   * Returns why a value cannot be saved, from its text and the row's record, or undefined for a
   * value that can.
   */
  readonly validate?: ((text: string, record: RowData) => string | undefined) | undefined;
}

/**
 * Describes what a column states about its cells beyond TanStack's column definition.
 */
export interface ColumnMeta {
  /**
   * Returns the content of the detail row rendered under an expanded row, from the row's record.
   * `DataTable.expandColumn` sets it.
   */
  readonly detail?: ((record: RowData) => ReactNode) | undefined;

  /**
   * How a grid edits the column's cells. A column without it is read-only.
   */
  readonly edit?: CellEdit | undefined;

  /**
   * Filter `DataTable.ColumnFilter` offers for the column: a text the values contain, a choice of
   * the column's values, or a range of figures.
   *
   * @remarks
   *   `text` writes a string, which TanStack's `includesString` reads, the function it picks for a
   *   column of strings. `range` writes a minimum and a maximum, which `inNumberRange` reads, the
   *   function it picks for a column of numbers. `select` writes the chosen values in an array, so
   *   the column states `filterFn: "arrHas"`.
   */
  readonly filter?: "range" | "select" | "text" | undefined;

  /**
   * Whether the column is as narrow as its content while the table lays out its columns by their
   * content, such as a column of checkboxes. The kit's select, expand and pin columns set it.
   */
  readonly fit?: boolean | undefined;

  /**
   * Name of the column in words, which the sort announcement reads. The header when it is a
   * string, and the column's id otherwise, unless stated.
   */
  readonly label?: string | undefined;

  /**
   * Whether the column contains figures, aligned to the end in tabular figures.
   */
  readonly numeric?: boolean | undefined;

  /**
   * Whether the column's cells render as row headers, the `th` a screen reader names each row by.
   */
  readonly rowHeader?: boolean | undefined;

  /**
   * Whether the column's cells select their rows. While the column is visible each row states
   * `aria-selected`. `DataTable.selectColumn` sets it.
   */
  readonly selects?: boolean | undefined;
}

/**
 * Registers every stock feature, each row model, the stock functions and the column meta type.
 */
export const FEATURES = tableFeatures({
  ...stockFeatures,
  aggregationFns: AGGREGATION_FNS,
  columnMeta: metaHelper<ColumnMeta>(),
  expandedRowModel: createExpandedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  filterFns: FILTER_FNS,
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: SORT_FNS,
});

/**
 * Describes the features every data table registers.
 */
export type Features = typeof FEATURES;

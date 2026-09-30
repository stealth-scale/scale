/**
 * Creates the column whose buttons open a detail row under their rows.
 *
 * @remarks
 *   Each button is named by the caller's `label` for its record, so a screen reader names the row
 *   whose detail it opens. The column's header renders its name only for assistive technology,
 *   "Details" unless stated. The column states `meta.detail`, which the body renders in a
 *   full-width row under each expanded row. A row expands only while TanStack's `getRowCanExpand`
 *   allows it, so a table of detail rows passes `getRowCanExpand: () => true`. The column neither
 *   sorts, filters, hides, groups nor resizes, a grid's selection and keys skip its cells, and it
 *   fits its buttons in a table laid out by its content. Its size is 72 pixels, a 32-pixel button
 *   between the
 *   20-pixel insets of a large table, which a table with pinned or resizable columns lays the
 *   column out at. A caller whose theme or density widens the cells spreads the definition with a
 *   larger `size`.
 */

import { type ReactNode } from "react";

import { type DisplayColumnDef, type RowData } from "@tanstack/react-table";

import { ExpandCell } from "#data-table/expand-cell.tsx";
import { type Features } from "#data-table/features.ts";
import { HiddenText } from "#data-table/hidden-text.ts";

/**
 * Describes the options of the expand column: the detail, the names and the glyph.
 *
 * @typeParam Row - Type of one record.
 */
export interface ExpandColumnOptions<Row extends RowData> {
  /**
   * Returns the content of the detail row from the record.
   */
  readonly detail: (record: Row) => ReactNode;

  /**
   * Name of the column, which only assistive technology reads. "Details" unless stated.
   */
  readonly header?: string | undefined;

  /**
   * Glyph inside each button, pointing to the inline end, such as a chevron.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Returns the accessible name of a row's button from its record, such as "Details of Halden
   * Freight".
   */
  readonly label: (record: Row) => string;
}

/**
 * Creates the expand column, with the id `expand`.
 *
 * @typeParam Row - Type of one record.
 * @param options - The detail, the names and the glyph.
 * @returns The column's definition.
 */
export function expandColumn<Row extends RowData>(
  options: ExpandColumnOptions<Row>,
): DisplayColumnDef<Features, Row> {
  const { detail, header = "Details", indicator, label } = options;

  return {
    cell: ({ row }) => <ExpandCell id={row.id} indicator={indicator} label={label(row.original)} />,
    enableCellSelection: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    header: () => <HiddenText>{header}</HiddenText>,
    id: "expand",
    maxSize: 72,
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the body calls the detail with this column's own records
    meta: { detail: detail as (record: RowData) => ReactNode, fit: true, label: header },
    minSize: 72,
    size: 72,
  };
}

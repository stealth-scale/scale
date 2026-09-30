/**
 * Creates the column whose toggles pin rows to the top or the bottom of the body.
 *
 * @remarks
 *   Each toggle is named by the caller's `label` for its record, so a screen reader names the row
 *   it pins. The column's header renders its name only for assistive technology, "Pin" unless
 *   stated. A pinned row renders in its region whatever the sort, the filters or the page, which is
 *   TanStack's row pinning with `keepPinnedRows`. The column neither sorts, filters, hides, groups
 *   nor resizes, a grid's selection and keys skip its cells, and it fits its button in a table
 *   laid out by its content. Its size is 72 pixels, a
 *   32-pixel button between the 20-pixel insets of a large table, which a table with pinned or
 *   resizable columns lays the column out at.
 */

import { type ReactNode } from "react";

import { type DisplayColumnDef, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { HiddenText } from "#data-table/hidden-text.ts";
import { PinCell } from "#data-table/pin-cell.tsx";

/**
 * Describes the options of the pin column: the region, the names and the glyph.
 *
 * @typeParam Row - Type of one record.
 */
export interface PinColumnOptions<Row extends RowData> {
  /**
   * Name of the column, which only assistive technology reads. "Pin" unless stated.
   */
  readonly header?: string | undefined;

  /**
   * Glyph inside each toggle, such as a pin.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Returns the accessible name of a row's toggle from its record, such as "Pin Halden Freight".
   */
  readonly label: (record: Row) => string;

  /**
   * Region a press pins a row to. `top` unless stated.
   */
  readonly position?: "bottom" | "top" | undefined;
}

/**
 * Creates the pin column, with the id `pin`.
 *
 * @typeParam Row - Type of one record.
 * @param options - The region, the names and the glyph.
 * @returns The column's definition.
 */
export function pinColumn<Row extends RowData>(
  options: PinColumnOptions<Row>,
): DisplayColumnDef<Features, Row> {
  const { header = "Pin", indicator, label, position = "top" } = options;

  return {
    cell: ({ row }) => (
      <PinCell id={row.id} indicator={indicator} label={label(row.original)} position={position} />
    ),
    enableCellSelection: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    header: () => <HiddenText>{header}</HiddenText>,
    id: "pin",
    maxSize: 72,
    meta: { fit: true, label: header },
    minSize: 72,
    size: 72,
  };
}

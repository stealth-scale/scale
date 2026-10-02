/**
 * Creates the column whose cells select their rows, with a box in its header that selects every
 * row.
 *
 * @remarks
 *   Each box is named: a row's by the caller's `label` for its record, and the header's by
 *   `allLabel`, so a screen reader names the row a box selects. The column states `meta.selects`,
 *   which makes each row state `aria-selected`, and it neither sorts, filters, hides, groups nor
 *   resizes. A grid's selection and keys skip its cells. It fits its boxes in a table laid out by
 *   its content. Its size is 60 pixels, a
 *   20-pixel box between the 20-pixel insets of a large table, which a table with pinned or
 *   resizable columns lays the column out at. A caller whose theme or density widens the cells
 *   spreads the definition with a larger `size`.
 */

import { type ReactNode } from "react";

import { type DisplayColumnDef, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { SelectAll } from "#data-table/select-all.tsx";
import { SelectCell } from "#data-table/select-cell.tsx";

/**
 * Describes the options of the select column: the names of its boxes and their glyphs.
 *
 * @typeParam Row - Type of one record.
 */
export interface SelectColumnOptions<Row extends RowData> {
  /**
   * Accessible name of the header's box, which selects every row.
   */
  readonly allLabel: string;

  /**
   * Glyph inside a box while some of the rows it selects are selected, such as a dash: the header's
   * box, and a row's box while some rows under the row are.
   */
  readonly indeterminateIndicator?: ReactNode | undefined;

  /**
   * Glyph inside a checked box, such as a check mark.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Returns the accessible name of a row's box from its record, such as "Select Halden Freight".
   */
  readonly label: (record: Row) => string;
}

/**
 * Creates the select column, with the id `select`.
 *
 * @typeParam Row - Type of one record.
 * @param options - The names of the boxes and their glyphs.
 * @returns The column's definition.
 */
export function selectColumn<Row extends RowData>(
  options: SelectColumnOptions<Row>,
): DisplayColumnDef<Features, Row> {
  const { allLabel, indeterminateIndicator, indicator, label } = options;

  return {
    cell: ({ row }) => (
      <SelectCell
        id={row.id}
        indeterminateIndicator={indeterminateIndicator}
        indicator={indicator}
        label={label(row.original)}
      />
    ),
    enableCellSelection: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    header: () => (
      <SelectAll
        indeterminateIndicator={indeterminateIndicator}
        indicator={indicator}
        label={allLabel}
      />
    ),
    id: "select",
    maxSize: 60,
    meta: { fit: true, selects: true },
    minSize: 60,
    size: 60,
  };
}

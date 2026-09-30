/**
 * Renders a data table's footer row while a visible column states a footer.
 *
 * @remarks
 *   The row renders each leaf column's footer, such as a total, in the columns' visual order. A
 *   row-header column's footer is a row header, a numeric column's footer aligns to the end in
 *   tabular figures, and a pinned column's footer sticks with its cells. A row-header column that
 *   states no footer renders an empty data cell, because an empty row header names nothing. A
 *   footer's template receives the table React renders the row with, so a total follows every
 *   change of the filters. In a windowed table the row states its `aria-rowindex`, the last of the
 *   table's rows.
 */

import { type ReactElement } from "react";

import { type Header, type RowData } from "@tanstack/react-table";

import { Table } from "@stealthscale/component-collections";

import { Cell, RowHeader } from "#data-table/bound.ts";
import { fitOf, footedOf, pinnedOf } from "#data-table/columns.ts";
import { type Features } from "#data-table/features.ts";
import { useTableState } from "#data-table/state.ts";
import { footerContentOf } from "#data-table/templates.tsx";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes the props of the footer row: its index among the table's rows.
 */
export interface FooterProps {
  /**
   * Index of the footer row among every row of a windowed table, from 1. The row states no index
   * unless stated.
   */
  readonly rowIndex?: number | undefined;
}

/**
 * Returns one footer cell: a row header for a row-header column that states a footer, and a data
 * cell otherwise.
 */
function footed(table: DataTableApi, header: Header<Features, RowData>): ReactElement {
  const { footer, meta } = header.column.columnDef;
  const content = footerContentOf(table, header);
  const pinned = { ...pinnedOf(table, header.column), ...fitOf(header.column) };

  if (meta?.rowHeader === true && footer !== undefined) {
    return (
      <RowHeader key={header.id} {...pinned}>
        {content}
      </RowHeader>
    );
  }

  return (
    <Cell key={header.id} {...pinned} {...(meta?.numeric === true ? { "data-numeric": true } : {})}>
      {content}
    </Cell>
  );
}

/**
 * Renders the `tfoot` with the leaf columns' footers, or nothing while no visible column states
 * one.
 *
 * @param props - The row's index among the table's rows.
 * @returns The `tfoot` element, or `null`.
 */
export function Footer({ rowIndex }: FooterProps): null | ReactElement {
  const table = useTableState();

  if (!footedOf(table)) return null;

  return (
    <Table.Footer>
      <Table.Row {...(rowIndex === undefined ? {} : { "aria-rowindex": rowIndex })}>
        {table.getLeafHeaders().map((header) => footed(table, header))}
      </Table.Row>
    </Table.Footer>
  );
}

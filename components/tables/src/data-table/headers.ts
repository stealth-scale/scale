/**
 * Returns the header cells a data table renders in each header row, with their row spans.
 *
 * @remarks
 *   TanStack fills the rows above a column that no group spans with placeholder headers. The table
 *   renders that column's header once, in the first row it appears in, spanning every row it
 *   appears in, as `Table.Simple` does, so no header cell is empty.
 */

import { type Header, type HeaderGroup, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";

/**
 * Describes a header cell to render: the column's own header and the rows it spans.
 *
 * @typeParam Row - Type of one record.
 */
export interface HeaderSlot<Row extends RowData = RowData> {
  /**
   * The column's own header, never a placeholder, whose content and sort button render.
   */
  readonly header: Header<Features, Row>;

  /**
   * Number of header rows the cell spans.
   */
  readonly rowSpan: number;
}

/**
 * Describes one header row: its group's id and its cells.
 *
 * @typeParam Row - Type of one record.
 */
export interface HeaderRow<Row extends RowData = RowData> {
  /**
   * Id of the header group, the row's React key.
   */
  readonly id: string;

  /**
   * Cells of the row, placeholders left out.
   */
  readonly slots: ReadonlyArray<HeaderSlot<Row>>;
}

/**
 * Returns each header row's cells: a column's header in the first row it appears in, spanning
 * every row it appears in.
 *
 * @typeParam Row - Type of one record.
 * @param groups - TanStack's header groups, top row first.
 * @returns One row per header group.
 */
export function rowsOf<Row extends RowData>(
  groups: ReadonlyArray<HeaderGroup<Features, Row>>,
): ReadonlyArray<HeaderRow<Row>> {
  const spans = new Map<string, number>();
  const own = new Map<string, Header<Features, Row>>();

  for (const header of groups.flatMap((group) => group.headers)) {
    spans.set(header.column.id, (spans.get(header.column.id) ?? 0) + 1);

    if (!header.isPlaceholder) own.set(header.column.id, header);
  }

  const seen = new Set<string>();

  return groups.map((group) => ({
    id: group.id,
    slots: group.headers.flatMap((header) => {
      const { id } = header.column;

      if (seen.has(id)) return [];

      seen.add(id);

      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every column has one header of its own, counted in spans
      return [{ header: own.get(id) as Header<Features, Row>, rowSpan: spans.get(id) as number }];
    }),
  }));
}

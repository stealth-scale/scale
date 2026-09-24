/**
 * Describes the columns `Table.Simple` renders, and returns its header rows.
 *
 * @remarks
 *   A column states its name, width, figures, sort state and reader once. Columns form a tree: a
 *   branch spans the columns under it and adds a header row.
 */

import { type ReactNode } from "react";

/**
 * Describes a column that renders values.
 *
 * @typeParam Row - Type of one record.
 */
export interface Leaf<Row> {
  /**
   * Returns the column's value for a record. Defaults to the record's property named `key`.
   */
  readonly cell?: ((row: Row) => ReactNode) | undefined;

  /**
   * Key of the column, and the property its value is read from without `cell`.
   */
  readonly key: string;

  /**
   * Header of the column.
   */
  readonly label: ReactNode;

  /**
   * Whether the column contains figures, aligned to the end in tabular figures.
   */
  readonly numeric?: boolean | undefined;

  /**
   * Whether the column's cells render as row headers.
   */
  readonly rowHeader?: boolean | undefined;

  /**
   * Sort direction, on the column the table is sorted by.
   */
  readonly sorted?: "ascending" | "descending" | undefined;

  /**
   * Accessible name of the column's sort button. A column without it does not sort.
   */
  readonly sortLabel?: string | undefined;

  /**
   * Width of the column, as a CSS length or percentage.
   */
  readonly width?: string | undefined;
}

/**
 * Describes a header that spans the columns under it.
 *
 * @typeParam Row - Type of one record.
 */
export interface Branch<Row> {
  /**
   * Columns the header spans.
   */
  readonly columns: ReadonlyArray<Column<Row>>;

  /**
   * Text of the spanning header.
   */
  readonly label: ReactNode;
}

/**
 * Describes a column: a leaf that renders values, or a branch that spans columns.
 *
 * @typeParam Row - Type of one record.
 */
export type Column<Row> = Branch<Row> | Leaf<Row>;

/**
 * Returns whether a column is a branch.
 *
 * @typeParam Row - Type of one record.
 * @param column - A leaf or a branch.
 * @returns `true` for a branch.
 */
export function spans<Row>(column: Column<Row>): column is Branch<Row> {
  return "columns" in column;
}

/**
 * Returns the leaf columns in render order.
 *
 * @typeParam Row - Type of one record.
 * @param columns - Leaves and branches in render order.
 * @returns The leaves, flattened.
 */
export function leaves<Row>(columns: ReadonlyArray<Column<Row>>): ReadonlyArray<Leaf<Row>> {
  return columns.flatMap((column) => (spans(column) ? leaves(column.columns) : [column]));
}

/**
 * Returns the number of header rows the columns need.
 *
 * @typeParam Row - Type of one record.
 * @param columns - Leaves and branches in render order.
 * @returns The depth of the tree, at least 1.
 */
export function depth<Row>(columns: ReadonlyArray<Column<Row>>): number {
  return Math.max(1, ...columns.map((column) => (spans(column) ? 1 + depth(column.columns) : 1)));
}

/**
 * Describes one header cell with its spans.
 *
 * @typeParam Row - Type of one record.
 */
export interface Named<Row> {
  /**
   * Number of columns the header spans.
   */
  readonly colSpan: number;

  /**
   * Leaf the header belongs to, for a header over one column.
   */
  readonly column?: Leaf<Row> | undefined;

  /**
   * Key of the header: the leaf's key, or the key of the first leaf a branch spans.
   */
  readonly key: string;

  /**
   * Text of the header.
   */
  readonly label: ReactNode;

  /**
   * Number of header rows the header spans.
   */
  readonly rowSpan: number;
}

/**
 * Returns the header rows and each header's spans.
 *
 * @remarks
 *   A branch spans as many columns as it has leaves. Each leaf spans the header rows left below
 *   it, so every column's header ends on the last header row.
 * @typeParam Row - Type of one record.
 * @param columns - Leaves and branches in render order.
 * @param tall - The number of header rows.
 * @returns One list of headers per header row.
 */
export function named<Row>(
  columns: ReadonlyArray<Column<Row>>,
  tall = depth(columns),
): ReadonlyArray<ReadonlyArray<Named<Row>>> {
  const rows: Array<Array<Named<Row>>> = Array.from({ length: tall }, () => []);

  for (const column of columns) {
    if (spans(column)) {
      const held = leaves(column.columns);

      rows[0]?.push({
        colSpan: held.length,
        key: held[0]?.key ?? "",
        label: column.label,
        rowSpan: 1,
      });

      for (const [at, names] of named(column.columns, tall - 1).entries()) {
        rows[at + 1]?.push(...names);
      }
    } else {
      rows[0]?.push({ colSpan: 1, column, key: column.key, label: column.label, rowSpan: tall });
    }
  }

  return rows;
}

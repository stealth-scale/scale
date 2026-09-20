/**
 * Describes the columns a table draws, and works out what its header rows come to.
 *
 * @remarks
 *   A column's name, its width, whether it holds figures, whether it sorts, and how to read it off
 *   a record are one fact about one column. Written into the markup they land in four places: the
 *   column declarations, the name in the header, and `data-numeric` on the name and again on every
 *   cell of every row. Stating them once is what this is for.
 *   The columns are a tree. A name spanning the columns under it is a column holding columns, which
 *   is the only shape that carries the two rows of names a spanning header draws, and the only one
 *   that can work out the span.
 */

import { type ReactNode } from "react";

/**
 * Describes one column a table draws.
 *
 * @typeParam Row - What one record holds.
 */
export interface Leaf<Row> {
  /**
   * Reads what the column holds for one record. The key is read off the record where none is
   * given, which is what most columns want.
   */
  readonly cell?: ((row: Row) => ReactNode) | undefined;

  /**
   * The key the column is named by, which is also the key its value is read under.
   */
  readonly key: string;

  /**
   * The name at the head of the column.
   */
  readonly label: ReactNode;

  /**
   * Whether the column holds figures, which sets them in tabular figures against the column's end.
   */
  readonly numeric?: boolean | undefined;

  /**
   * Whether the column names the record rather than holding one of its values, which draws its
   * cells as row headers.
   */
  readonly rowHeader?: boolean | undefined;

  /**
   * Which way the table is in the order of this column, where it is the one the table is sorted by.
   */
  readonly sorted?: "ascending" | "descending" | undefined;

  /**
   * Reads out as the name of the control that sorts by this column. A column with none does not
   * sort.
   */
  readonly sortLabel?: string | undefined;

  /**
   * How wide the column is, as a CSS length or a share. Stated once for the table rather than on
   * the first cell of every row.
   */
  readonly width?: string | undefined;
}

/**
 * Describes a name spanning the columns under it.
 *
 * @typeParam Row - What one record holds.
 */
export interface Branch<Row> {
  /**
   * The columns the name spans.
   */
  readonly columns: ReadonlyArray<Column<Row>>;

  /**
   * The name over them.
   */
  readonly label: ReactNode;
}

/**
 * Describes a column, which either draws values or spans the columns that do.
 *
 * @typeParam Row - What one record holds.
 */
export type Column<Row> = Branch<Row> | Leaf<Row>;

/**
 * Reports whether a column spans others rather than drawing values itself.
 *
 * @typeParam Row - What one record holds.
 * @param column - The column to test.
 * @returns Whether it holds columns.
 */
export function spans<Row>(column: Column<Row>): column is Branch<Row> {
  return "columns" in column;
}

/**
 * Lists the columns that draw values, in the order they are drawn.
 *
 * @typeParam Row - What one record holds.
 * @param columns - The columns, spanning or not.
 * @returns Every column holding values, flattened.
 */
export function leaves<Row>(columns: ReadonlyArray<Column<Row>>): ReadonlyArray<Leaf<Row>> {
  return columns.flatMap((column) => (spans(column) ? leaves(column.columns) : [column]));
}

/**
 * Reports how deep the names go, which is how many rows the header draws.
 *
 * @typeParam Row - What one record holds.
 * @param columns - The columns, spanning or not.
 * @returns The count of rows, at least one.
 */
export function depth<Row>(columns: ReadonlyArray<Column<Row>>): number {
  return Math.max(1, ...columns.map((column) => (spans(column) ? 1 + depth(column.columns) : 1)));
}

/**
 * Describes one name in one row of the header, with the room it takes.
 *
 * @typeParam Row - What one record holds.
 */
export interface Named<Row> {
  /**
   * How many columns the name spans.
   */
  readonly colSpan: number;

  /**
   * The column the name belongs to, for a name that heads one column.
   */
  readonly column?: Leaf<Row> | undefined;

  /**
   * The key the name is drawn under, which is its own or the first of the columns it spans.
   */
  readonly key: string;

  /**
   * The name itself.
   */
  readonly label: ReactNode;

  /**
   * How many rows the name spans, for a name over columns that are not themselves spanned.
   */
  readonly rowSpan: number;
}

/**
 * Works out the rows of names a header draws, and what each name spans.
 *
 * @remarks
 *   A name over columns takes as many columns as there are values beneath it. A name over no
 *   columns takes as many rows as the deepest name has left, so a table mixing spanned and
 *   unspanned columns closes both down to the same line.
 * @typeParam Row - What one record holds.
 * @param columns - The columns, spanning or not.
 * @param tall - How many rows the header draws in all.
 * @returns One list of names per row of the header.
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

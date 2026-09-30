/**
 * Creates the columns and rows of a pivot table from flat records, the options `useDataTable`
 * takes.
 *
 * @remarks
 *   The rows are the cross-tab's rows, one per path through the row dimensions. The columns are a
 *   row-header column per row dimension, a column of figures per value of the column dimension and
 *   a totals column. An outer dimension's cell spans the rows of its group through TanStack's cell
 *   spanning, and every dimension's cell is a row header with `scope="row"`, which the HTML table
 *   model applies to every row the cell spans. A measured cell renders the data package's
 *   `Format.Number` in the locale in scope. A cell with nothing to measure renders words that only
 *   assistive technology reads, so it never reads as zero. The totals render in the last column and
 *   in a footer row, whose first dimension's cell names it. The columns neither sort, group, filter
 *   nor hide, because every total counts every record: a caller filters the records before the
 *   pivot. A dimension's value is the record's text, so a caller translates its records first. The
 *   column ids are the dimensions' fields, `column:value` for a value's column and `total` for the
 *   totals column, and each row's id is its path in JSON.
 */

import { type ReactElement } from "react";

import { Format } from "@stealthscale/component-data";

import { createColumnHelper } from "#data-table/column-helper.ts";
import {
  aggregatorOf,
  type CrossTab,
  crossTabOf,
  type PivotAggregate,
  type PivotAggregator,
  type PivotCell,
  type PivotField,
  type PivotRow,
  sharesGroupOf,
} from "#data-table/cross-tab.ts";
import { HiddenText } from "#data-table/hidden-text.ts";
import { type DataTableOptions } from "#data-table/use-data-table.ts";

/**
 * Describes the options of a pivot: its dimensions, the measured field, the aggregate and the words
 * of its headers and cells.
 *
 * @typeParam Row - Type of one record.
 */
export interface PivotOptions<Row> {
  /**
   * Aggregate of each cell's records: `sum` unless stated, `average`, `min`, `max`, `count`, or a
   * function of the records.
   */
  readonly aggregate?: PivotAggregate | PivotAggregator<Row> | undefined;

  /**
   * Field whose values become the columns, in the order they first appear.
   */
  readonly column: PivotField<Row>;

  /**
   * Options of `Intl.NumberFormat` every figure is written with, such as a currency.
   */
  readonly format?: Intl.NumberFormatOptions | undefined;

  /**
   * Header of each row dimension's column, by field. The field unless stated.
   */
  readonly headers?: Readonly<Partial<Record<PivotField<Row>, string>>> | undefined;

  /**
   * Words that only assistive technology reads in a cell with nothing to measure. "No value"
   * unless stated.
   */
  readonly missingLabel?: string | undefined;

  /**
   * Fields whose values become the rows, the outermost first.
   */
  readonly rows: ReadonlyArray<PivotField<Row>>;

  /**
   * Header of the totals column and name of the footer row. "Total" unless stated.
   */
  readonly totalLabel?: string | undefined;

  /**
   * Whether the table renders the totals column and the footer row. `true` unless stated.
   */
  readonly totals?: boolean | undefined;

  /**
   * Field the built-in aggregates measure. `count` reads none.
   */
  readonly value?: PivotField<Row> | undefined;
}

/**
 * Describes what `pivot` returns: the columns, the rows and the row ids `useDataTable` takes.
 */
export type Pivot = Required<Pick<DataTableOptions<PivotRow>, "columns" | "data" | "getRowId">>;

/**
 * Describes how a pivot's figures render: their format and the words of an empty cell.
 */
interface Figures {
  /**
   * Options of `Intl.NumberFormat` every figure is written with.
   */
  readonly format: Intl.NumberFormatOptions | undefined;

  /**
   * Words that only assistive technology reads in a cell with nothing to measure.
   */
  readonly missingLabel: string;
}

/**
 * Creates the pivot's columns, typed over its rows.
 */
const column = createColumnHelper<PivotRow>();

/**
 * Locks a pivot's column: it neither sorts, groups, filters nor hides.
 */
const LOCKED = {
  enableColumnFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableSorting: false,
};

/**
 * Returns a cell's content from its figure: the figure in the locale in scope, or the words of a
 * cell with nothing to measure.
 */
function figureOf(value: null | number, figures: Figures): ReactElement {
  if (value === null) return <HiddenText>{figures.missingLabel}</HiddenText>;

  return <Format.Number options={figures.format} value={value} />;
}

/**
 * Returns a row's cell at a column value's index.
 */
function cellAt(row: PivotRow, index: number): PivotCell {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every row has a cell per column value
  return row.cells[index] as PivotCell;
}

/**
 * Returns the row dimensions' columns: row headers whose outer cells span their groups, the first
 * naming the footer row with the footer's words while the table renders totals.
 */
function dimensionsOf<Row>(
  options: PivotOptions<Row>,
  footer: string | undefined,
): Pivot["columns"] {
  const { headers, rows } = options;

  return column.columns(
    rows.map((field, depth) =>
      column.accessor((row) => row.path[depth], {
        ...LOCKED,
        ...(footer === undefined || depth > 0 ? {} : { footer }),
        header: headers?.[field] ?? field,
        id: field,
        meta: { rowHeader: true },
        ...(depth < rows.length - 1
          ? {
              spanRows: ({ anchorRow, row }) =>
                sharesGroupOf(anchorRow.original.path, row.original.path, depth),
            }
          : {}),
      }),
    ),
  );
}

/**
 * Returns a column of figures per value of the column dimension, each with its total in the footer
 * row while the table renders totals.
 */
function valuesOf(
  tab: CrossTab,
  field: string,
  figures: Figures,
  totalled: boolean,
): Pivot["columns"] {
  return column.columns(
    tab.columns.map((each, index) =>
      column.accessor((row) => cellAt(row, index).value, {
        ...LOCKED,
        cell: ({ getValue }) => figureOf(getValue(), figures),
        ...(totalled ? { footer: () => figureOf(each.total.value, figures) } : {}),
        header: each.value,
        id: `${field}:${each.value}`,
        meta: { numeric: true },
      }),
    ),
  );
}

/**
 * Returns the totals column: each row's total, and the grand total in the footer row.
 */
function totalOf(tab: CrossTab, label: string, figures: Figures): Pivot["columns"] {
  return column.columns([
    column.accessor((row) => row.total.value, {
      ...LOCKED,
      cell: ({ getValue }) => figureOf(getValue(), figures),
      footer: () => figureOf(tab.grandTotal.value, figures),
      header: label,
      id: "total",
      meta: { numeric: true },
    }),
  ]);
}

/**
 * Returns the columns, rows and row ids of a pivot table of records, for `useDataTable`.
 *
 * @typeParam Row - Type of one record.
 * @param records - The records to aggregate, filtered and translated by the caller.
 * @param options - The dimensions, the measured field, the aggregate and the words.
 * @returns The options that render the cross-tab.
 */
export function pivot<Row>(records: readonly Row[], options: PivotOptions<NoInfer<Row>>): Pivot {
  const {
    aggregate = "sum",
    column: field,
    format,
    missingLabel = "No value",
    totalLabel = "Total",
  } = options;
  const tab = crossTabOf(records, {
    aggregate: aggregatorOf(aggregate, options.value),
    column: field,
    rows: options.rows,
  });
  const totalled = options.totals !== false && tab.rows.length > 0;
  const figures = { format, missingLabel };

  return {
    columns: [
      ...dimensionsOf(options, totalled ? totalLabel : undefined),
      ...valuesOf(tab, field, figures, totalled),
      ...(totalled ? totalOf(tab, totalLabel, figures) : []),
    ],
    data: tab.rows,
    getRowId: (row) => JSON.stringify(row.path),
  };
}

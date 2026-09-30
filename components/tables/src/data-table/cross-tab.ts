/**
 * Computes a pivot's cross-tab from flat records: a cell for each row path and column value, a
 * total for each row and each column value, and the grand total.
 *
 * @remarks
 *   Every total is aggregated from the records, never from the cells. With `sum` the two agree, and
 *   with `average` they do not: a row of one record of 10 and ninety-nine of 90 in two cells has
 *   cell averages of 10 and 90, whose mean is 50, while its records average 89.2. `min` and `max`
 *   differ the same way. A cell no record falls into is `null` with a count of zero, never `0`,
 *   because no records and records that sum to zero are different facts. The rows follow the
 *   first-seen order of each dimension, level by level, so the rows of an outer group are
 *   adjacent. The column values follow their first-seen order.
 */

/**
 * Describes a built-in aggregate: the sum, the mean, the least or the greatest of a cell's
 * figures, or the number of its records.
 */
export type PivotAggregate = "average" | "count" | "max" | "min" | "sum";

/**
 * Describes a function that returns one figure from a cell's records, or `null` for nothing to
 * measure.
 *
 * @typeParam Row - Type of one record.
 */
export type PivotAggregator<Row> = (records: readonly Row[]) => null | number;

/**
 * Describes a field of a record that a pivot reads.
 *
 * @typeParam Row - Type of one record.
 */
export type PivotField<Row> = Extract<keyof Row, string>;

/**
 * Describes one cell of a cross-tab: its figure and the number of records it aggregates.
 */
export interface PivotCell {
  /**
   * Number of records that fall into the cell, zero for a cell no record falls into.
   */
  readonly count: number;

  /**
   * Figure the aggregate returns, or `null` for a cell with nothing to measure.
   */
  readonly value: null | number;
}

/**
 * Describes one value of the column dimension: the value and the total of its records.
 */
export interface PivotColumn {
  /**
   * Cell aggregated from every record with the value.
   */
  readonly total: PivotCell;

  /**
   * Value of the column dimension, as text.
   */
  readonly value: string;
}

/**
 * Describes one row of a cross-tab: its path through the row dimensions, a cell per column value
 * and its total.
 */
export interface PivotRow {
  /**
   * Cells in the order of the cross-tab's columns.
   */
  readonly cells: readonly PivotCell[];

  /**
   * Value of each row dimension as text, the outermost first.
   */
  readonly path: readonly string[];

  /**
   * Cell aggregated from every record of the row.
   */
  readonly total: PivotCell;
}

/**
 * Describes a cross-tab: the column values, the rows and the grand total.
 */
export interface CrossTab {
  /**
   * Values of the column dimension in the order they first appear, each with its total.
   */
  readonly columns: readonly PivotColumn[];

  /**
   * Cell aggregated from every record.
   */
  readonly grandTotal: PivotCell;

  /**
   * Rows in the first-seen order of each dimension, level by level.
   */
  readonly rows: readonly PivotRow[];
}

/**
 * Describes what a cross-tab groups and aggregates: the row dimensions, the column dimension and
 * the function that aggregates a cell's records.
 *
 * @typeParam Row - Type of one record.
 */
export interface CrossTabOptions<Row> {
  /**
   * Returns a cell's figure from its records.
   */
  readonly aggregate: PivotAggregator<Row>;

  /**
   * Field whose values become the columns.
   */
  readonly column: PivotField<Row>;

  /**
   * Fields whose values become the rows, the outermost first.
   */
  readonly rows: ReadonlyArray<PivotField<Row>>;
}

/**
 * Returns the sum of figures.
 */
function sumOf(figures: readonly number[]): number {
  return figures.reduce((sum, figure) => sum + figure, 0);
}

/**
 * Lists the built-in aggregates over a cell's finite figures and its number of records, each
 * `null` while no figure is finite, except the count.
 */
const AGGREGATES: Readonly<
  Record<PivotAggregate, (figures: readonly number[], count: number) => null | number>
> = {
  average: (figures) => (figures.length === 0 ? null : sumOf(figures) / figures.length),
  count: (_figures, count) => count,
  max: (figures) =>
    figures.length === 0 ? null : figures.reduce((most, figure) => Math.max(most, figure)),
  min: (figures) =>
    figures.length === 0 ? null : figures.reduce((least, figure) => Math.min(least, figure)),
  sum: (figures) => (figures.length === 0 ? null : sumOf(figures)),
};

/**
 * Returns the finite figures of a field across records, without every value that is not a finite
 * number.
 */
function figuresOf<Row>(records: readonly Row[], field: PivotField<Row> | undefined): number[] {
  if (field === undefined) return [];

  return records.flatMap((record) => {
    const value: unknown = record[field];

    return typeof value === "number" && Number.isFinite(value) ? [value] : [];
  });
}

/**
 * Returns the function that aggregates a cell's records: a built-in aggregate over a field's finite
 * figures, or the caller's function.
 *
 * @typeParam Row - Type of one record.
 * @param aggregate - The built-in aggregate's name, or a function of a cell's records.
 * @param value - The field the built-in aggregates measure, which `count` does not read.
 * @returns The function a cross-tab calls for each cell and total with records.
 */
export function aggregatorOf<Row>(
  aggregate: PivotAggregate | PivotAggregator<Row>,
  value?: PivotField<Row>,
): PivotAggregator<Row> {
  if (typeof aggregate === "function") return aggregate;

  const aggregated = AGGREGATES[aggregate];

  return (records) => aggregated(figuresOf(records, value), records.length);
}

/**
 * Returns a dimension's value as the text its row or column is grouped under.
 *
 * @remarks
 *   A missing value groups under the empty string. A number, a boolean or a big integer groups
 *   under its digits or its word, and any other value under its JSON, so two different objects do
 *   not merge under one `[object Object]`.
 */
export function textOf(value: unknown): string {
  if (value === undefined || value === null) return "";

  if (typeof value === "string") return value;

  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }

  return JSON.stringify(value);
}

/**
 * Returns whether two paths agree on every dimension down to a depth, so a cell at that depth
 * spans both rows.
 *
 * @param path - The path of the row that starts the span.
 * @param other - The path of a later row.
 * @param depth - The dimension's depth, 0 for the outermost.
 * @returns Whether the two paths share the group.
 */
export function sharesGroupOf(
  path: readonly string[],
  other: readonly string[],
  depth: number,
): boolean {
  return path.slice(0, depth + 1).every((value, at) => value === other[at]);
}

/**
 * Adds an item to its group in a map of groups, creating the group with its first item.
 */
function grouped<Key, Item>(groups: Map<Key, Item[]>, key: Key, item: Item): void {
  const group = groups.get(key);

  if (group === undefined) {
    groups.set(key, [item]);

    return;
  }

  group.push(item);
}

/**
 * Returns the paths grouped by their value at a depth in the first-seen order of the values, each
 * group ordered the same way at the depths below.
 */
function orderedOf(
  paths: ReadonlyArray<readonly string[]>,
  depth = 0,
): ReadonlyArray<readonly string[]> {
  const groups = new Map<string | undefined, Array<readonly string[]>>();

  for (const path of paths) grouped(groups, path[depth], path);

  return [...groups.values()].flatMap((group) =>
    group.length === 1 ? group : orderedOf(group, depth + 1),
  );
}

/**
 * Returns the cross-tab of records: a cell per row path and column value, the totals of the rows
 * and the columns, and the grand total, each aggregated from its records.
 *
 * @typeParam Row - Type of one record.
 * @param records - The records to aggregate.
 * @param options - The row dimensions, the column dimension and the aggregate.
 * @returns The column values with their totals, the rows and the grand total.
 */
export function crossTabOf<Row>(records: readonly Row[], options: CrossTabOptions<Row>): CrossTab {
  const { aggregate, column, rows } = options;
  const byPath = new Map<string, Row[]>();
  const byColumn = new Map<string, Row[]>();
  const byPair = new Map<string, Row[]>();
  const paths: Array<readonly string[]> = [];

  for (const record of records) {
    const path = rows.map((field) => textOf(record[field]));
    const key = JSON.stringify(path);
    const value = textOf(record[column]);

    if (!byPath.has(key)) paths.push(path);

    grouped(byPath, key, record);
    grouped(byColumn, value, record);
    grouped(byPair, JSON.stringify([key, value]), record);
  }

  /**
   * Returns a group's cell: its count, and its figure while it has records.
   */
  const cellOf = (group: readonly Row[] = []): PivotCell => ({
    count: group.length,
    value: group.length === 0 ? null : aggregate(group),
  });

  return {
    columns: [...byColumn].map(([value, group]) => ({ total: cellOf(group), value })),
    grandTotal: cellOf(records),
    rows: orderedOf(paths).map((path) => {
      const key = JSON.stringify(path);

      return {
        cells: [...byColumn.keys()].map((value) =>
          cellOf(byPair.get(JSON.stringify([key, value]))),
        ),
        path,
        total: cellOf(byPath.get(key)),
      };
    }),
  };
}

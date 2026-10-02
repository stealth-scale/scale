/**
 * Resolves a heatmap's axes and cells: the headings in order, the place of every pair of a row and
 * a column with the reading the caller passed for it, the runs of the column groups, the key the
 * walk finds each place by, and the words a place is read with.
 *
 * @remarks
 *   An axis the caller does not state takes each key in the order the cells first name it, with the
 *   key as its label. Of two readings for one pair the later applies, so an export appended twice
 *   needs no clean-up. A value that is not a finite number is missing. A reading whose row or
 *   column is not on its axis is not rendered, because the axes state what exists. A group spans
 *   the consecutive columns that name it, so a group named again after another column starts a
 *   second run.
 */

import { type ReactNode } from "react";

/**
 * Describes one reading: the row and the column it belongs to, its value, and the words that name
 * it or its value where the caller writes them.
 */
export interface HeatmapCell {
  /**
   * Key of the column.
   */
  readonly column: string;

  /**
   * Words that name the reading, such as its date, which the readout writes as its heading and a
   * screen reader reads before the value. The row's and the column's words unless stated.
   */
  readonly label?: string | undefined;

  /**
   * Key of the row.
   */
  readonly row: string;

  /**
   * Words the cell prints and reads for its value, such as a head count while the fill shows a
   * rate. The value written in `valueOptions` unless stated.
   */
  readonly text?: string | undefined;

  /**
   * Value, or `null` for a reading that is missing, which renders apart from any value.
   */
  readonly value: null | number;
}

/**
 * Describes the heading of a row, a column or a group of columns: the key the cells name it by and
 * its words.
 */
export interface HeatmapHeading {
  /**
   * Key of the group of columns the column belongs to, one of the `groups` keys.
   */
  readonly group?: string | undefined;

  /**
   * Whether a screen reader reads the heading alone, such as a calendar's week heading.
   */
  readonly hidden?: boolean | undefined;

  /**
   * Key the cells name the row or the column by.
   */
  readonly key: string;

  /**
   * Words of the heading.
   */
  readonly label: ReactNode;
}

/**
 * Describes the place of a pair of a row and a column: its key, and the reading for the pair if the
 * caller passed one.
 *
 * @typeParam Cell - A reading, as the caller passes it.
 */
export interface Place<Cell extends HeatmapCell = HeatmapCell> {
  /**
   * Key of the column.
   */
  readonly column: string;

  /**
   * Key the walk finds the place by.
   */
  readonly key: string;

  /**
   * Reading the caller passed for the pair, the later of two, or undefined without one.
   */
  readonly reading: Cell | undefined;

  /**
   * Key of the row.
   */
  readonly row: string;

  /**
   * Value of the reading while it is a finite number, else `null`.
   */
  readonly value: null | number;
}

/**
 * Describes a row as the grid renders it: its heading and its places, one per column.
 *
 * @typeParam Cell - A reading, as the caller passes it.
 */
export interface Line<Cell extends HeatmapCell = HeatmapCell> {
  /**
   * Heading of the row.
   */
  readonly heading: HeatmapHeading;

  /**
   * Places of the row, in the columns' order.
   */
  readonly places: ReadonlyArray<Place<Cell>>;
}

/**
 * Describes a run of consecutive columns in one group, which one group heading spans.
 */
export interface Run {
  /**
   * Heading of the group, or undefined for columns in no group.
   */
  readonly heading: HeatmapHeading | undefined;

  /**
   * Key of the run: the place of its first column.
   */
  readonly key: string;

  /**
   * Number of columns the run spans.
   */
  readonly span: number;
}

/**
 * Describes a heatmap as the grid renders it.
 *
 * @typeParam Cell - A reading, as the caller passes it.
 */
export interface Resolved<Cell extends HeatmapCell = HeatmapCell> {
  /**
   * Places by key.
   */
  readonly byKey: ReadonlyMap<string, Place<Cell>>;

  /**
   * Headings of the columns, in order.
   */
  readonly columns: readonly HeatmapHeading[];

  /**
   * Rows, in order.
   */
  readonly lines: ReadonlyArray<Line<Cell>>;

  /**
   * Runs of the column groups, in order, or none without groups.
   */
  readonly runs: readonly Run[];
}

/**
 * Describes the headings a caller states for a heatmap's axes and groups.
 */
export interface Axes {
  /**
   * Columns in order, if the caller states them.
   */
  readonly columns?: readonly HeatmapHeading[] | undefined;

  /**
   * Headings of the groups of columns, if the columns are grouped.
   */
  readonly groups?: readonly HeatmapHeading[] | undefined;

  /**
   * Rows in order, if the caller states them.
   */
  readonly rows?: readonly HeatmapHeading[] | undefined;
}

/**
 * Returns the key the walk finds the place of a row and a column by, from the row's key and the
 * column's key.
 */
export function keyOf(row: string, column: string): string {
  return JSON.stringify([row, column]);
}

/**
 * Returns an axis' headings: the caller's, else each key in the order the cells first name it.
 */
function headingsOf(
  stated: readonly HeatmapHeading[] | undefined,
  named: readonly string[],
): readonly HeatmapHeading[] {
  return stated ?? [...new Set(named)].map((key) => ({ key, label: key }));
}

/**
 * Returns the runs of consecutive columns that name one group, each with its group's heading.
 */
function runsOf(
  columns: readonly HeatmapHeading[],
  groups: readonly HeatmapHeading[] | undefined,
): readonly Run[] {
  if (groups === undefined) return [];

  const starts = columns.flatMap((column, at) =>
    at > 0 && columns[at - 1]?.group === column.group ? [] : [at],
  );

  return starts.map((start, at) => ({
    heading: groups.find((group) => group.key === columns[start]?.group),
    key: String(start),
    span: (starts[at + 1] ?? columns.length) - start,
  }));
}

/**
 * Returns a heatmap's headings, its places, one for every pair of a row and a column, and the runs
 * of its column groups.
 *
 * @param cells - The readings, in any order.
 * @param axes - The rows, the columns and the groups, if the caller states them.
 */
export function resolve<Cell extends HeatmapCell>(
  cells: readonly Cell[],
  axes: Axes = {},
): Resolved<Cell> {
  const read = new Map(cells.map((cell) => [keyOf(cell.row, cell.column), cell]));
  const across = headingsOf(
    axes.columns,
    cells.map((cell) => cell.column),
  );
  const lines = headingsOf(
    axes.rows,
    cells.map((cell) => cell.row),
  ).map((heading) => ({
    heading,
    places: across.map((column) => {
      const key = keyOf(heading.key, column.key);
      const reading = read.get(key);
      const value = reading?.value ?? null;

      return {
        column: column.key,
        key,
        reading,
        row: heading.key,
        value: value !== null && Number.isFinite(value) ? value : null,
      };
    }),
  }));

  return {
    byKey: new Map(lines.flatMap((line) => line.places).map((place) => [place.key, place])),
    columns: across,
    lines,
    runs: runsOf(across, axes.groups),
  };
}

/**
 * Returns the words of a place's value: the reading's `text`, else the value written in the chart's
 * locale, or the missing words for a place without a value.
 *
 * @param place - A place of the grid.
 * @param write - Writes a value in the chart's locale.
 * @param missing - The words of a place without a value.
 */
export function textOf(place: Place, write: (value: unknown) => string, missing: string): string {
  if (place.value === null) return missing;

  return place.reading?.text ?? write(place.value);
}

/**
 * Returns the words a screen reader reads before a place's value: the reading's `label` and the
 * locale's list separator, or undefined without a label.
 *
 * @param place - A place of the grid.
 * @param separator - The locale's list separator.
 */
export function leadOf(place: Place, separator: string): string | undefined {
  const label = place.reading?.label;

  return label === undefined ? undefined : `${label}${separator}`;
}

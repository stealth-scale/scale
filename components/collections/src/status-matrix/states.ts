/**
 * Describes the three things a matrix is built out of, and works out what a row comes to.
 *
 * @remarks
 *   The cells are sparse. A pair nobody measured is a pair nobody wrote a cell for, which is the
 *   shape an export already has, and it keeps a matrix of a hundred rows against thirty columns to
 *   the crossings that were actually run. Two cells for one pair is not an error: the later one
 *   wins, which is the honest reading of a log that appends rather than updates.
 *   A rollup reads the worst thing along a row. The order is read off the tone, so a caller states
 *   nothing extra, and a gap is ranked between a warning and anything in progress. A row with one
 *   region never checked is not a healthy row, and drawing it as one is the failure a status matrix
 *   exists to prevent.
 */

import { type ReactNode } from "react";

/**
 * The palettes a state is drawn in.
 *
 * @remarks
 *   The four the theme reports a status with, and the neutral one for a crossing that does not
 *   apply. A tone is the whole of a state's colour: a matrix that let a caller name a colour would
 *   be a matrix nobody could theme.
 */
export type MatrixTone = "error" | "info" | "neutral" | "success" | "warning";

/**
 * Describes one state in a caller's own vocabulary.
 */
export interface MatrixState {
  /**
   * Written in the legend and read out in the cell. A state a reader cannot name is a colour.
   */
  readonly label: string;

  /**
   * Drawn inside the cell. Two states sharing a tone need one each, or they draw as the same mark
   * and the matrix says less than the legend claims. A state with none draws a filled disc.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * The palette the mark is drawn in, and what the rollup ranks the state by.
   */
  readonly tone: MatrixTone;
}

/**
 * Describes one heading, on either axis.
 */
export interface MatrixHeading {
  /**
   * The section this row is gathered under, which is both the key and the words. Rows only, and
   * the sections are drawn where every row states one.
   */
  readonly group?: string | undefined;

  /**
   * The name the cells of this row or column are written against.
   */
  readonly id: string;

  /**
   * Drawn at the head of the row or the column.
   */
  readonly label: ReactNode;
}

/**
 * Describes one measured crossing.
 */
export interface MatrixCell {
  /**
   * The column this was measured against.
   */
  readonly column: string;

  /**
   * The row this was measured for.
   */
  readonly row: string;

  /**
   * The state it came back in, named among the ones the matrix was given.
   */
  readonly state: string;
}

/**
 * Every measured crossing, by its row and then by its column.
 *
 * @remarks
 *   Nested rather than keyed by the pair joined into one string. A joined key needs a character no
 *   name can hold, which is a control character in the source of a file people read.
 */
export type MatrixIndex = ReadonlyMap<string, ReadonlyMap<string, MatrixCell>>;

/**
 * Ranks the tones, worst first, for the rollup to read.
 */
const RANK: Readonly<Record<MatrixTone, number>> = {
  error: 5,
  info: 2,
  neutral: 0,
  success: 1,
  warning: 4,
};

/**
 * Ranks a gap, which sits under a warning and over anything that passed or is under way.
 */
const GAP = 3;

/**
 * Gathers the cells by the pair they were measured for, the later of two winning.
 *
 * @param cells - Every measured crossing, in whatever order a caller has them.
 * @returns The cells, one per pair.
 */
export function indexed(cells: readonly MatrixCell[]): MatrixIndex {
  const rows = new Map<string, Map<string, MatrixCell>>();

  for (const cell of cells) {
    const held = rows.get(cell.row) ?? new Map<string, MatrixCell>();

    held.set(cell.column, cell);
    rows.set(cell.row, held);
  }

  return rows;
}

/**
 * Reads the state a crossing came back in, off the vocabulary the matrix was given.
 *
 * @remarks
 *   A cell naming a state the vocabulary does not hold reads as a gap rather than as an error. An
 *   export that has grown a state nobody has drawn yet should say so on the screen, and a matrix
 *   that threw would take the page down with it.
 * @param states - The caller's vocabulary, keyed by the names the cells use.
 * @param cell - The cell, or nothing where the pair was never measured.
 * @returns The state, or nothing where there is none to read.
 */
export function stateOf(
  states: Readonly<Record<string, MatrixState>>,
  cell: MatrixCell | undefined,
): MatrixState | undefined {
  return cell === undefined ? undefined : states[cell.state];
}

/**
 * Returns the worst state along a row, or nothing where the worst thing about it is a gap.
 *
 * @remarks
 *   Read from the first crossing to the last, and the first of two equals wins, so a row of one
 *   repeated state rolls up to that state rather than to the last copy of it.
 * @param along - The state at each crossing of the row, a gap carrying nothing.
 * @returns The worst state, or nothing where a gap outranks everything measured.
 */
export function worst(along: ReadonlyArray<MatrixState | undefined>): MatrixState | undefined {
  let held: MatrixState | undefined;
  let rank = -1;

  for (const state of along) {
    const at = state === undefined ? GAP : RANK[state.tone];

    if (at > rank) {
      held = state;
      rank = at;
    }
  }

  return held;
}

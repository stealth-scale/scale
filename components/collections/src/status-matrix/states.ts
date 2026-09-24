/**
 * Types of the matrix's states, headings and cells, and the functions that index the cells and
 * roll a row up.
 *
 * @remarks
 *   Cells are sparse: a pair without a cell is unmeasured, and the later of two cells for one pair
 *   applies. The rollup ranks tones from worst to best as error, warning, a gap, info, success and
 *   neutral, so a row with an unmeasured crossing never rolls up to a pass.
 */

import { type ReactNode } from "react";

/**
 * Palettes a state renders in: the four statuses and `neutral` for a crossing that does not apply.
 */
export type MatrixTone = "error" | "info" | "neutral" | "success" | "warning";

/**
 * Describes one state of the caller's vocabulary.
 */
export interface MatrixState {
  /**
   * Text of the state in the legend, and the accessible name of a crossing without `cellLabel`.
   */
  readonly label: string;

  /**
   * Mark rendered in the cell. Defaults to a filled dot. Two states with one tone need a mark each,
   * or they render alike.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Palette of the mark, and the rank the rollup reads.
   */
  readonly tone: MatrixTone;
}

/**
 * Describes one heading on either axis.
 */
export interface MatrixHeading {
  /**
   * Section a row is grouped under, as both its key and its heading. Read on rows only. Sections
   * render only when every row has one.
   */
  readonly group?: string | undefined;

  /**
   * Identifier of the row or the column in the cells.
   */
  readonly id: string;

  /**
   * Content of the row header or the column header.
   */
  readonly label: ReactNode;
}

/**
 * Describes one measured crossing.
 */
export interface MatrixCell {
  /**
   * Identifier of the column.
   */
  readonly column: string;

  /**
   * Identifier of the row.
   */
  readonly row: string;

  /**
   * Key of the state in the matrix's vocabulary.
   */
  readonly state: string;
}

/**
 * Cells by row identifier, then by column identifier.
 *
 * @remarks
 *   Nested maps, because a key joining the two identifiers needs a separator no identifier
 *   contains.
 */
export type MatrixIndex = ReadonlyMap<string, ReadonlyMap<string, MatrixCell>>;

/**
 * Ranks each tone for the rollup. A higher rank is worse.
 */
const RANK: Readonly<Record<MatrixTone, number>> = {
  error: 5,
  info: 2,
  neutral: 0,
  success: 1,
  warning: 4,
};

/**
 * Rank of a gap: under a warning and over info, success and neutral.
 */
const GAP = 3;

/**
 * Returns the cells by row and column. The later of two cells for one pair applies.
 *
 * @param cells - Measured crossings in any order.
 * @returns The index, with one cell per pair.
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
 * Returns the state a cell names.
 *
 * @remarks
 *   A cell with a state outside the vocabulary returns undefined and renders as unmeasured, so a
 *   new state in the data does not throw.
 * @param states - Vocabulary keyed by the names the cells use.
 * @param cell - The cell, or undefined for a pair without one.
 * @returns The state, or undefined when there is no cell or no such state.
 */
export function stateOf(
  states: Readonly<Record<string, MatrixState>>,
  cell: MatrixCell | undefined,
): MatrixState | undefined {
  return cell === undefined ? undefined : states[cell.state];
}

/**
 * Returns the worst state along a row, or undefined when a gap ranks worst.
 *
 * @remarks
 *   Of two states with one rank, the first applies. An empty row returns undefined.
 * @param along - The state at each crossing, undefined for a gap.
 * @returns The worst state, or undefined when a gap ranks worst.
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

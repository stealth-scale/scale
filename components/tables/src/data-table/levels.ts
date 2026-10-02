/**
 * Reads what a table with levels renders: whether the table has levels, each row's place among its
 * siblings, the column whose cells lead with a row's toggle, whether a row opens rows under it, a
 * row's attributes, the move a keystroke on a row asks for, and where that move takes focus.
 *
 * @remarks
 *   A table has levels while it states `getSubRows` or groups its rows by a column, and renders as
 *   a `treegrid`. A row's place counts its siblings in the rows before expansion, which are sorted,
 *   filtered and grouped, so a page does not cut a row's set. The arrows that open and close a row
 *   swap under right-to-left.
 */

import { type ReactNode } from "react";

import { type RowData, type Row as TableRow } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";
import { detailOf, expandedOf, lineKeyOf, rowIdOf } from "#data-table/rows.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes one row of a data table.
 */
type AnyRow = TableRow<Features, RowData>;

/**
 * Describes a row's place among its siblings.
 */
export interface Position {
  /**
   * Position of the row among its siblings, from 1.
   */
  readonly index: number;

  /**
   * Number of rows among the row's siblings, the row included.
   */
  readonly size: number;
}

/**
 * Describes the words and the glyph of the rows of a table with levels.
 */
export interface Branches {
  /**
   * Accessible name of the toggle of an open row. "Collapse" unless stated.
   */
  readonly collapseLabel: string;

  /**
   * Accessible name of the toggle of a closed row. "Expand" unless stated.
   */
  readonly expandLabel: string;

  /**
   * Glyph inside each toggle, pointing to the inline end, such as a chevron.
   */
  readonly indicator: ReactNode;

  /**
   * Words of the row under an open row whose rows have not arrived. "Loading…" unless stated.
   */
  readonly loadingLabel: string;
}

/**
 * Describes what the body of a table with levels passes to its rows: the row with the tab stop,
 * and the words and the glyph of the toggles.
 */
export interface Leveling {
  /**
   * Id of the row with the tab stop, or undefined while the body has no rows.
   */
  readonly active: string | undefined;

  /**
   * Words and glyph of the toggles.
   */
  readonly branches: Branches;
}

/**
 * Describes what every row of a table with levels reads alike.
 */
export interface Levels extends Leveling {
  /**
   * Whether a visible column renders details, which makes a row without sub-rows a leaf.
   */
  readonly detailed: boolean;

  /**
   * Number of columns the rows are grouped by, the depth of a record in a grouped table.
   */
  readonly grouped: number;

  /**
   * Place of each row among its siblings, by the row's id.
   */
  readonly positions: ReadonlyMap<string, Position>;

  /**
   * Id of the column whose cells lead with a row's toggle in a table of sub-rows.
   */
  readonly tree: string | undefined;
}

/**
 * Describes what a keystroke on a row asks for.
 */
export type Move = "close" | "first" | "last" | "next" | "open" | "previous" | "toggle";

/**
 * Describes what a keystroke does: the row opens or closes, and a row takes focus.
 */
export interface Step {
  /**
   * `true` to open the row, `false` to close it, and undefined to leave it.
   */
  readonly expanded?: boolean;

  /**
   * Id of the row that takes focus, or undefined for a move that keeps it.
   */
  readonly focus?: string;
}

/**
 * Describes the rows a keystroke moves between: the table, its rows in render order, and whether
 * a column renders details.
 */
export interface Walk {
  /**
   * Whether a visible column renders details, which makes a row without sub-rows a leaf.
   */
  readonly detailed: boolean;

  /**
   * The body's rows in render order.
   */
  readonly rows: readonly AnyRow[];

  /**
   * The table whose state is read.
   */
  readonly table: DataTableApi;
}

/**
 * English words of the rows of a table with levels.
 */
export const BRANCHES: Branches = {
  collapseLabel: "Collapse",
  expandLabel: "Expand",
  indicator: undefined,
  loadingLabel: "Loading…",
};

/**
 * Leveling of a body that passes no row with the tab stop, with the English words.
 */
export const UNLEVELED: Leveling = { active: undefined, branches: BRANCHES };

/**
 * Describes the attributes of a record's row in a table with levels.
 */
export interface LevelMarks {
  /**
   * Whether the row is open, on a row that opens rows under it.
   */
  readonly "aria-expanded"?: boolean;

  /**
   * Level of the row, from 1.
   */
  readonly "aria-level": number;

  /**
   * Position of the row among its siblings, from 1.
   */
  readonly "aria-posinset"?: number;

  /**
   * Number of rows among the row's siblings, the row included.
   */
  readonly "aria-setsize"?: number;

  /**
   * Key of the row's line, by which a focused row reports its record.
   */
  readonly "data-key": string;

  /**
   * Id of the row, by which a keystroke focuses it.
   */
  readonly id: string;

  /**
   * 0 on the row with the tab stop, -1 on every other row.
   */
  readonly tabIndex: number;
}

/**
 * Maps each key a row takes to its move, left to right.
 */
const MOVES: ReadonlyMap<string, Move> = new Map<string, Move>([
  [" ", "toggle"],
  ["ArrowDown", "next"],
  ["ArrowLeft", "close"],
  ["ArrowRight", "open"],
  ["ArrowUp", "previous"],
  ["End", "last"],
  ["Enter", "toggle"],
  ["Home", "first"],
]);

/**
 * Returns whether a table has levels: it states `getSubRows`, or groups its rows by a column.
 *
 * @param table - The table whose options and state are read.
 * @returns `true` while the table renders as a `treegrid`.
 */
export function leveledOf(table: DataTableApi): boolean {
  return table.options.getSubRows !== undefined || table.state.grouping.length > 0;
}

/**
 * Records the place of each row of a set and of every row under it.
 */
function placed(positions: Map<string, Position>, rows: readonly AnyRow[]): void {
  for (const [at, row] of rows.entries()) {
    positions.set(row.id, { index: at + 1, size: rows.length });
    placed(positions, row.subRows);
  }
}

/**
 * Returns each row's place among its siblings, by the row's id.
 *
 * @param table - The table whose rows before expansion are read.
 * @returns The place of every row the table sorts, filters and groups.
 */
export function positionsOf(table: DataTableApi): ReadonlyMap<string, Position> {
  const positions = new Map<string, Position>();

  placed(positions, table.getPreExpandedRowModel().rows);

  return positions;
}

/**
 * Returns the column whose cells lead with a row's toggle in a table of sub-rows: the first
 * visible row-header column, else the first visible column with an accessor.
 *
 * @param table - The table whose options and visible columns are read.
 * @returns The column's id, or undefined for a table that states no `getSubRows`.
 */
export function treeColumnOf(table: DataTableApi): string | undefined {
  if (table.options.getSubRows === undefined) return undefined;

  const columns = table.getVisibleLeafColumns();
  const tree =
    columns.find((column) => column.columnDef.meta?.rowHeader === true) ??
    columns.find((column) => column.accessorFn !== undefined);

  return tree?.id;
}

/**
 * Returns what every row of a table reads alike while the table has levels.
 *
 * @param table - The table whose rows, columns and state are read.
 * @param leveling - The row with the tab stop, and the words and the glyph of the toggles.
 * @returns The levels, or undefined for a table without levels.
 */
export function levelsOf(table: DataTableApi, leveling: Leveling): Levels | undefined {
  if (!leveledOf(table)) return undefined;

  return {
    ...leveling,
    detailed: detailOf(table) !== undefined,
    grouped: table.state.grouping.length,
    positions: positionsOf(table),
    tree: treeColumnOf(table),
  };
}

/**
 * Returns whether a row opens rows under it: it can expand, and it has sub-rows or the table
 * renders no detail.
 *
 * @param row - The row to read.
 * @param detailed - Whether a visible column renders details.
 * @returns `true` for a row that states `aria-expanded` and renders a toggle.
 */
export function branchOf(row: AnyRow, detailed: boolean): boolean {
  return row.getCanExpand() && (row.subRows.length > 0 || !detailed);
}

/**
 * Returns the attributes of a record's row in a table with levels.
 *
 * @remarks
 *   A row pinned while a filter leaves it out renders outside the rows the filter keeps, and states
 *   no place among siblings.
 * @param table - The table whose expansion is read.
 * @param row - The row to render.
 * @param levels - The levels every row of the table reads.
 * @param prefix - The root's unique prefix of ids.
 * @returns The row's level, place, state, key, id and tab stop.
 */
export function levelMarksOf(
  table: DataTableApi,
  row: AnyRow,
  levels: Levels,
  prefix: string,
): LevelMarks {
  const position = levels.positions.get(row.id);

  return {
    ...(branchOf(row, levels.detailed) ? { "aria-expanded": expandedOf(table, row.id) } : {}),
    "aria-level": row.depth + 1,
    ...(position === undefined
      ? {}
      : { "aria-posinset": position.index, "aria-setsize": position.size }),
    "data-key": lineKeyOf(row.id, false),
    id: rowIdOf(prefix, row.id),
    tabIndex: row.id === levels.active ? 0 : -1,
  };
}

/**
 * Returns the move a key asks for on a row.
 *
 * @param key - The key's `KeyboardEvent.key`.
 * @param rtl - Whether the table reads right to left, which swaps the arrows that open and close.
 * @returns The move, or undefined for a key a row does not take.
 */
export function moveOf(key: string, rtl: boolean): Move | undefined {
  const move = MOVES.get(key);

  if (!rtl) return move;
  if (move === "open") return "close";

  return move === "close" ? "open" : move;
}

/**
 * Returns the step that focuses a row, or none for no row.
 */
function focusOf(row: AnyRow | undefined): Step {
  return row === undefined ? {} : { focus: row.id };
}

/**
 * Returns the step of ArrowRight: a closed branch opens, and an open branch moves to its first row.
 */
function opened(walk: Walk, at: number): Step {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the walk reads the index of a row it contains
  const row = walk.rows[at] as AnyRow;

  if (!branchOf(row, walk.detailed)) return {};
  if (!expandedOf(walk.table, row.id)) return { expanded: true };

  const next = walk.rows[at + 1];

  return next?.parentId === row.id ? { focus: next.id } : {};
}

/**
 * Returns the step of ArrowLeft: an open branch closes, and any other row moves to its parent.
 */
function closed(walk: Walk, at: number): Step {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the walk reads the index of a row it contains
  const row = walk.rows[at] as AnyRow;

  if (branchOf(row, walk.detailed) && expandedOf(walk.table, row.id)) return { expanded: false };

  return focusOf(walk.rows.find((each) => each.id === row.parentId));
}

/**
 * Returns the step of Enter and Space: a branch opens or closes.
 */
function toggled(walk: Walk, at: number): Step {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the walk reads the index of a row it contains
  const row = walk.rows[at] as AnyRow;

  return branchOf(row, walk.detailed) ? { expanded: !expandedOf(walk.table, row.id) } : {};
}

/**
 * Returns the step of each move from the row at an index.
 */
const STEPS: Readonly<Record<Move, (walk: Walk, at: number) => Step>> = {
  close: closed,
  first: (walk) => focusOf(walk.rows[0]),
  last: (walk) => focusOf(walk.rows.at(-1)),
  next: (walk, at) => focusOf(walk.rows[at + 1]),
  open: opened,
  previous: (walk, at) => focusOf(walk.rows[at - 1]),
  toggle: toggled,
};

/**
 * Returns what a move does from a row.
 *
 * @param walk - The table, its rows in render order and whether a column renders details.
 * @param id - Id of the row that has focus.
 * @param move - The move a keystroke asks for.
 * @returns Whether the row opens or closes and which row takes focus, or nothing for a row the
 *   walk does not contain.
 */
export function stepOf(walk: Walk, id: string, move: Move): Step {
  const at = walk.rows.findIndex((row) => row.id === id);

  return at < 0 ? {} : STEPS[move](walk, at);
}

/**
 * Decides which keys open a grid cell's editor and in which mode, where the focused cell moves
 * after a key saves an edit, and which columns a grid edits.
 *
 * @remarks
 *   Enter and F2 open the editor in caret mode with the cell's value, where the arrows move the
 *   caret. A printable character opens it in type mode with the character in place of the value,
 *   and Backspace and Delete open it empty in type mode, where the arrows save and move as they do
 *   in a spreadsheet. A keystroke with Alt, Control or Meta opens nothing. Enter saves and moves
 *   down, Tab saves and moves to the next cell and Shift with Tab to the previous one, and an arrow
 *   moves in its direction, left and right swapped while the grid reads right to left.
 */

import { textOf } from "#data-table/cross-tab.ts";
import { type CellEdit } from "#data-table/features.ts";
import { type Direction, type GridCell, wayOf } from "#data-table/grid.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes how an editor treats the arrows: `caret` moves the caret, `type` saves and moves.
 */
export type EditMode = "caret" | "type";

/**
 * Describes the key that saved an edit and whether Shift was pressed, which decide where the
 * focused cell moves.
 */
export interface Leave {
  /**
   * The key, as `KeyboardEvent.key` names it.
   */
  readonly key: string;

  /**
   * Whether Shift is pressed.
   */
  readonly shift: boolean;
}

/**
 * Describes how a key opens an editor: its mode and the text it opens with.
 */
export interface EditStart {
  /**
   * Mode the editor opens in.
   */
  readonly mode: EditMode;

  /**
   * Text the editor opens with, or undefined for the cell's value.
   */
  readonly text: string | undefined;
}

/**
 * Describes the parts of a keystroke that decide whether it opens an editor.
 */
export interface Keystroke {
  /**
   * Whether Alt is pressed.
   */
  readonly altKey: boolean;

  /**
   * Whether Control is pressed.
   */
  readonly ctrlKey: boolean;

  /**
   * The key, as `KeyboardEvent.key` names it.
   */
  readonly key: string;

  /**
   * Whether Meta is pressed.
   */
  readonly metaKey: boolean;
}

/**
 * Maps each arrow key to the direction it points in a grid that reads left to right.
 */
const ARROWS: ReadonlyMap<string, Direction> = new Map([
  ["ArrowDown", "down"],
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"],
  ["ArrowUp", "up"],
]);

/**
 * Returns how a keystroke on an editable cell opens its editor.
 *
 * @param stroke - The keystroke.
 * @returns The mode and the text, or undefined for a keystroke that opens nothing.
 */
export function editStartOf(stroke: Keystroke): EditStart | undefined {
  if (stroke.altKey || stroke.ctrlKey || stroke.metaKey) return undefined;
  if (stroke.key === "Enter" || stroke.key === "F2") return { mode: "caret", text: undefined };
  if (stroke.key === "Backspace" || stroke.key === "Delete") return { mode: "type", text: "" };

  return /^.$/su.test(stroke.key) ? { mode: "type", text: stroke.key } : undefined;
}

/**
 * Returns how a grid edits a column's cells.
 *
 * @param table - The table whose columns are read.
 * @param columnId - The column's id, which a cell's `data-column` states.
 * @returns The column's `meta.edit`, or undefined for a read-only column and for a column the table
 *   does not have.
 */
export function editOf(table: DataTableApi, columnId: string): CellEdit | undefined {
  return table.getAllFlatColumnsById()[columnId]?.columnDef.meta?.edit;
}

/**
 * Returns whether any visible column of a grid is editable, which makes every other cell
 * read-only.
 *
 * @param table - The table whose columns are read.
 * @returns Whether a visible column states `meta.edit`.
 */
export function editsOf(table: DataTableApi): boolean {
  return table.getVisibleLeafColumns().some((column) => column.columnDef.meta?.edit !== undefined);
}

/**
 * Returns a cell's value as the text its editor opens with, which a saved text is compared with.
 *
 * @param table - The table whose rows are read.
 * @param cell - The cell's row and column ids.
 * @returns The value as text, empty for a missing value.
 */
export function textAt(table: DataTableApi, cell: GridCell): string {
  return textOf(table.getRow(cell.rowId).getValue(cell.columnId));
}

/**
 * Returns where the focused cell moves after a key saves an edit.
 *
 * @param key - The key that saved the edit.
 * @param shift - Whether Shift is pressed.
 * @param rtl - Whether the grid reads right to left.
 * @returns The direction, or undefined for a key that moves nothing.
 */
export function leaveOf(key: string, shift: boolean, rtl: boolean): Direction | undefined {
  if (key === "Enter") return "down";
  if (key === "Tab") return shift ? "left" : "right";

  const arrow = ARROWS.get(key);

  return arrow === undefined ? undefined : wayOf(arrow, rtl);
}

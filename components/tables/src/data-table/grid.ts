/**
 * Runs a grid's keys, presses and tab stop over TanStack's cell selection, returns the attributes
 * of its `table` element and of its cells, and writes its selection as text.
 *
 * @remarks
 *   One cell has the tab stop: TanStack's focused cell, the anchor of the last range, while its row
 *   renders, else the first selectable cell. The arrows move the focused cell, left and right
 *   swapped while `columnResizeDirection` is `rtl`, and Shift with an arrow extends the range from
 *   it. Home and End go to the row's first and last selectable cell, and Control or Meta with Home
 *   or End to the grid's first and last cell. Page Up and Page Down move ten rows. Control or Meta
 *   with A selects every cell, and Escape collapses the range to the focused cell. While
 *   `enableCellRangeSelection` is `false`, Shift with an arrow moves the focused cell and Control
 *   or Meta with A does nothing. A keystroke with Alt pressed is left to the browser. A press
 *   selects through TanStack's handler, clears the page's text selection and starts none. After a
 *   press or a key, focus moves to the focused cell, and a key that extends the range scrolls the
 *   range's moving corner into view. The text of a selection has a tab between values and a line
 *   break between rows, TanStack's raw values. A text value that opens with `=`, `+`, `-` or `@`
 *   takes a leading quote, so a spreadsheet does not run it as a formula, and a value with a tab, a
 *   line break or a quote is quoted.
 */

import { type KeyboardEvent, type MouseEvent } from "react";
import { flushSync } from "react-dom";

import { type Cell, type RowData } from "@tanstack/react-table";

import { textOf } from "#data-table/cross-tab.ts";
import { type Features } from "#data-table/features.ts";
import { regionsOf } from "#data-table/rows.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes a cell of a grid by its row's id and its column's id.
 */
export interface GridCell {
  /**
   * Id of the cell's column.
   */
  readonly columnId: string;

  /**
   * Id of the cell's row.
   */
  readonly rowId: string;
}

/**
 * Describes the state of a keystroke besides its key: its modifiers, the grid's direction, and
 * whether the grid selects ranges.
 */
export interface Stroke {
  /**
   * Whether Control or Meta is pressed.
   */
  readonly modified: boolean;

  /**
   * Whether the grid selects ranges, which `enableCellRangeSelection: false` turns off.
   */
  readonly ranged: boolean;

  /**
   * Whether the grid reads right to left.
   */
  readonly rtl: boolean;

  /**
   * Whether Shift is pressed.
   */
  readonly shift: boolean;
}

/**
 * Describes what a key does to the grid's selection, and which cell it brings into view.
 */
export interface GridStep {
  /**
   * Cell the step brings into view: the focused cell, which takes focus, or the range's moving
   * corner, which scrolls into view while focus remains on the focused cell.
   */
  readonly reveals: "corner" | "focused";

  /**
   * Applies the step to the table from the cell the key was pressed on.
   */
  readonly run: (table: DataTableApi, from: GridCell) => void;
}

/**
 * Describes the attributes of a grid's `table` element.
 */
export interface GridSheet {
  /**
   * Whether a person may select several cells, which TanStack's ranges allow unless both range
   * options are off.
   */
  readonly "aria-multiselectable": boolean;

  /**
   * Moves the focused cell or changes the selection.
   */
  readonly onKeyDown: (event: KeyboardEvent<HTMLTableElement>) => void;

  /**
   * Role of the table.
   */
  readonly role: "grid";
}

/**
 * Describes the attributes of a selectable cell of a grid.
 */
export interface GridMarks {
  /**
   * Whether the cell is inside the selection.
   */
  readonly "aria-selected": boolean;

  /**
   * Id of the cell's column, by which a keystroke finds the cell.
   */
  readonly "data-column": string;

  /**
   * Sides of a selected cell on the selection's outer edge, as a space-separated list of
   * `block-start`, `inline-end`, `block-end` and `inline-start`, which the recipe rules.
   */
  readonly "data-edges"?: string;

  /**
   * Id of the cell's row, by which a keystroke finds the cell.
   */
  readonly "data-row": string;

  /**
   * Id of the cell's element, which focus follows.
   */
  readonly id: string;

  /**
   * Starts a selection at the cell through TanStack's handler, and focuses the focused cell.
   */
  readonly onMouseDown: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Extends a dragged selection to the cell, TanStack's handler.
   */
  readonly onMouseEnter: (event: unknown) => void;

  /**
   * `0` for the cell with the tab stop, `-1` for every other.
   */
  readonly tabIndex: number;
}

/**
 * Describes the attributes a grid gives a cell: the marks of a selectable cell and, in a grid that
 * edits, the marks of its edits. A cell that cannot be selected takes none.
 */
export interface CellMarks extends Partial<GridMarks> {
  /**
   * Present on a cell of a read-only column in a grid that edits another column.
   */
  readonly "aria-readonly"?: true;

  /**
   * Present on the cell whose editor is open.
   */
  readonly "data-editing"?: "";

  /**
   * Present on a cell with an unsaved change.
   */
  readonly "data-unsaved"?: "";

  /**
   * Opens the editor of a cell of an editable column, in caret mode.
   */
  readonly onDoubleClick?: () => void;
}

/**
 * Describes a direction a cell moves or a range extends in, in the order the cells render.
 */
export type Direction = "down" | "left" | "right" | "up";

/**
 * Opens the editor of a cell for a keystroke on it, and returns whether it did.
 */
export type EditKey = (from: GridCell, stroke: KeyboardEvent<HTMLTableElement>) => boolean;

/**
 * Number of rows Page Up and Page Down move.
 */
const PAGE = 10;

/**
 * Maps each direction to the one a right-to-left grid reads it as.
 */
const MIRRORED: Readonly<Record<Direction, Direction>> = {
  down: "down",
  left: "right",
  right: "left",
  up: "up",
};

/**
 * Maps each side TanStack reports on the selection's edge to its logical name, because TanStack's
 * left and right are the previous and the next column in the order the cells render.
 */
const SIDES = [
  ["top", "block-start"],
  ["right", "inline-end"],
  ["bottom", "block-end"],
  ["left", "inline-start"],
] as const;

/**
 * Returns the direction an arrow moves in the order the cells render: left and right swapped while
 * the grid reads right to left.
 *
 * @param direction - The arrow's direction on screen.
 * @param rtl - Whether the grid reads right to left.
 * @returns The direction in the order the cells render.
 */
export function wayOf(direction: Direction, rtl: boolean): Direction {
  return rtl ? MIRRORED[direction] : direction;
}

/**
 * Returns the id of a cell's element: the root's prefix and the cell's encoded ids, which an
 * encoded id's colon cannot join wrongly, because encoding writes a colon as `%3A`.
 *
 * @param prefix - The root's unique prefix of ids.
 * @param cell - The cell's row and column ids.
 * @returns The element's id.
 */
export function cellIdOf(prefix: string, cell: GridCell): string {
  return `${prefix}-cell-${encodeURIComponent(cell.rowId)}:${encodeURIComponent(cell.columnId)}`;
}

/**
 * Returns a row's selectable cells in the order they render.
 */
function selectableOf(table: DataTableApi, rowId: string): Array<Cell<Features, RowData>> {
  return table
    .getRow(rowId)
    .getVisibleCells()
    .filter((cell) => cell.getCanSelect());
}

/**
 * Returns the first or the last of a list's items.
 */
function endOf<Item>(items: readonly Item[], end: "first" | "last"): Item | undefined {
  return end === "first" ? items[0] : items.at(-1);
}

/**
 * Focuses a row's first or last selectable cell.
 */
function focusedAt(table: DataTableApi, rowId: string, end: "first" | "last"): void {
  const cell = endOf(selectableOf(table, rowId), end);

  if (cell !== undefined) table.setFocusedCell(rowId, cell.column.id);
}

/**
 * Returns the step of an arrow: a move of the focused cell, or with Shift in a grid of ranges an
 * extension of the range, none with Control or Meta.
 */
function arrowed(direction: Direction, stroke: Stroke): GridStep | undefined {
  if (stroke.modified) return undefined;

  const way = wayOf(direction, stroke.rtl);

  return stroke.shift && stroke.ranged
    ? {
        reveals: "corner",
        run: (table) => {
          table.extendCellSelection(way);
        },
      }
    : {
        reveals: "focused",
        run: (table) => {
          table.moveCellSelection(way);
        },
      };
}

/**
 * Returns the step of Home or End: the row's first or last cell, or with Control or Meta the
 * grid's.
 */
function ended(end: "first" | "last", stroke: Stroke): GridStep {
  return {
    reveals: "focused",
    run: (table, from) => {
      if (!stroke.modified) {
        focusedAt(table, from.rowId, end);

        return;
      }

      const row = endOf(table.getRowModel().rows, end);

      if (row !== undefined) focusedAt(table, row.id, end);
    },
  };
}

/**
 * Returns the step of Page Up or Page Down: the cell of the same column a page of rows away,
 * stopped at the first and the last row.
 */
function paged(rows: number): GridStep {
  return {
    reveals: "focused",
    run: (table, from) => {
      const all = table.getRowModel().rows;
      const at = all.findIndex((row) => row.id === from.rowId);
      const to = all[Math.min(Math.max(at + rows, 0), all.length - 1)];

      if (to !== undefined) table.setFocusedCell(to.id, from.columnId);
    },
  };
}

/**
 * Returns the step of A: every cell selected with Control or Meta in a grid of ranges, none
 * otherwise.
 */
function whole(stroke: Stroke): GridStep | undefined {
  return stroke.modified && stroke.ranged
    ? {
        reveals: "focused",
        run: (table) => {
          table.selectAllCells();
        },
      }
    : undefined;
}

/**
 * Returns the step of Escape: the range collapsed to the focused cell.
 */
function collapsed(): GridStep {
  return {
    reveals: "focused",
    run: (table, from) => {
      table.setFocusedCell(from.rowId, from.columnId);
    },
  };
}

/**
 * Lists each key a grid acts on with the step it takes.
 */
const STROKES: ReadonlyMap<string, (stroke: Stroke) => GridStep | undefined> = new Map([
  ["a", whole],
  ["A", whole],
  ["ArrowDown", (stroke: Stroke) => arrowed("down", stroke)],
  ["ArrowLeft", (stroke: Stroke) => arrowed("left", stroke)],
  ["ArrowRight", (stroke: Stroke) => arrowed("right", stroke)],
  ["ArrowUp", (stroke: Stroke) => arrowed("up", stroke)],
  ["End", (stroke: Stroke) => ended("last", stroke)],
  ["Escape", collapsed],
  ["Home", (stroke: Stroke) => ended("first", stroke)],
  ["PageDown", () => paged(PAGE)],
  ["PageUp", () => paged(-PAGE)],
]);

/**
 * Returns the step a key takes on a grid.
 *
 * @param key - The key, as `KeyboardEvent.key` names it.
 * @param stroke - The keystroke's modifiers, the grid's direction and whether it selects ranges.
 * @returns The step, or undefined for a key the grid leaves to the browser.
 */
export function gridStepOf(key: string, stroke: Stroke): GridStep | undefined {
  return STROKES.get(key)?.(stroke);
}

/**
 * Returns the cell an element is, or undefined for any other element, a control inside a cell
 * included, so the control keeps its own keys.
 *
 * @param target - An event's target, or the focused element.
 * @returns The cell's row and column ids.
 */
export function gridCellOf(target: EventTarget | null): GridCell | undefined {
  if (!(target instanceof HTMLElement)) return undefined;

  const { column, row } = target.dataset;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a selectable cell writes both attributes together
  return column === undefined ? undefined : { columnId: column, rowId: row as string };
}

/**
 * Returns the cell with a grid's tab stop: the focused cell while its row renders, else the first
 * selectable cell of the first row.
 *
 * @param table - The table whose selection and rows are read.
 * @returns The cell, or undefined for a grid without rows or without a selectable cell.
 */
export function tabbedOf(table: DataTableApi): GridCell | undefined {
  const rows = regionsOf(table).map(({ row }) => row);
  const focused = table.getFocusedCell();

  if (focused !== undefined && rows.some((row) => row.id === focused.row.id)) {
    return { columnId: focused.column.id, rowId: focused.row.id };
  }

  const first = rows[0]?.getVisibleCells().find((cell) => cell.getCanSelect());

  return first === undefined ? undefined : { columnId: first.column.id, rowId: first.row.id };
}

/**
 * Returns a copied value as a field of tab-separated text.
 */
function fieldOf(value: unknown): string {
  const text = textOf(value);
  const safe = typeof value === "string" && /^[\t\r ]*[=+@-]/u.test(text) ? `'${text}` : text;

  return /["\t\n\r]/u.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

/**
 * Returns the selection's regions as tab-separated text, a blank line between two regions.
 *
 * @param regions - TanStack's selected values by region, row and column.
 * @returns The text a copy writes.
 */
export function tsvOf(regions: ReadonlyArray<ReadonlyArray<readonly unknown[]>>): string {
  return regions
    .map((region) => region.map((row) => row.map((value) => fieldOf(value)).join("\t")).join("\n"))
    .join("\n\n");
}

/**
 * Returns the element of a grid's cell, or `null` for a cell whose row does not render.
 */
function cellElementOf(document: Document, prefix: string, cell: GridCell): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[id="${cellIdOf(prefix, cell)}"]`);
}

/**
 * Focuses the grid's focused cell, whose element renders once the state commits, and scrolls it
 * into view unless stated.
 *
 * @param table - The table whose focused cell is read.
 * @param document - The document the grid renders in.
 * @param prefix - The root's unique prefix of ids.
 * @param preventScroll - Whether the cell keeps its place on screen.
 */
export function focusFocusedCell(
  table: DataTableApi,
  document: Document,
  prefix: string,
  preventScroll: boolean,
): void {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a press or a step leaves a focused cell
  const focused = table.getFocusedCell() as Cell<Features, RowData>;
  const at = { columnId: focused.column.id, rowId: focused.row.id };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the focused cell's row renders in the grid's window
  (cellElementOf(document, prefix, at) as HTMLElement).focus({ preventScroll });
}

/**
 * Scrolls the moving corner of the grid's last range into view, while its row renders.
 *
 * @param table - The table whose selection is read.
 * @param document - The document the grid renders in.
 * @param prefix - The root's unique prefix of ids.
 */
export function revealCorner(table: DataTableApi, document: Document, prefix: string): void {
  const range = table.atoms.cellSelection.get().at(-1);

  if (range === undefined) return;

  const corner = { columnId: range.focusColumnId, rowId: range.focusRowId };

  cellElementOf(document, prefix, corner)?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

/**
 * Makes a cell the focused cell while TanStack's focused cell is another, such as a cell whose row
 * a filter removed, and keeps the range while the two are the same cell.
 *
 * @param table - The table whose selection changes.
 * @param cell - The cell with focus.
 */
export function focusedTo(table: DataTableApi, cell: GridCell): void {
  const focused = table.getFocusedCell();

  if (focused?.row.id !== cell.rowId || focused.column.id !== cell.columnId) {
    table.setFocusedCell(cell.rowId, cell.columnId);
  }
}

/**
 * Opens a cell's editor for a keystroke, or applies the keystroke's step and then focuses the
 * focused cell or reveals the range's moving corner.
 */
function keyed(
  event: KeyboardEvent<HTMLTableElement>,
  table: DataTableApi,
  prefix: string,
  edit: EditKey,
): void {
  const from = gridCellOf(event.target);

  if (from === undefined || event.altKey) return;

  if (edit(from, event)) {
    event.preventDefault();

    return;
  }

  const step = gridStepOf(event.key, {
    modified: event.ctrlKey || event.metaKey,
    ranged: table.options.enableCellRangeSelection !== false,
    rtl: table.options.columnResizeDirection === "rtl",
    shift: event.shiftKey,
  });

  if (step === undefined) return;

  event.preventDefault();
  flushSync(() => {
    focusedTo(table, from);
    step.run(table, from);
  });

  const document = event.currentTarget.ownerDocument;

  if (step.reveals === "focused") focusFocusedCell(table, document, prefix, false);
  else revealCorner(table, document, prefix);
}

/**
 * Starts a selection at a pressed cell and focuses the focused cell where it is, which after
 * Shift with a press is the range's anchor.
 *
 * @remarks
 *   The press takes no default action, so the browser neither selects text across the cells a
 *   drag crosses nor focuses the pressed cell itself.
 */
function pressed(
  event: MouseEvent<HTMLElement>,
  table: DataTableApi,
  cell: Cell<Features, RowData>,
  prefix: string,
): void {
  const start = cell.getSelectionStartHandler();
  const document = event.currentTarget.ownerDocument;

  event.preventDefault();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a document with a window has a selection
  (document.getSelection() as Selection).removeAllRanges();
  flushSync(() => {
    start(event);
  });
  focusFocusedCell(table, document, prefix, true);
}

/**
 * Returns the attributes of a grid's `table` element.
 *
 * @param table - The table whose options, rows and selection the handler reads.
 * @param prefix - The root's unique prefix of ids, by which focus finds a cell.
 * @param edit - Opens a cell's editor for a keystroke, and returns whether it did.
 * @returns The role, `aria-multiselectable` and the key handler.
 */
export function gridSheetOf(table: DataTableApi, prefix: string, edit: EditKey): GridSheet {
  const { enableCellRangeSelection, enableMultiCellRangeSelection } = table.options;

  return {
    "aria-multiselectable":
      enableCellRangeSelection !== false || enableMultiCellRangeSelection !== false,
    onKeyDown: (event) => {
      keyed(event, table, prefix, edit);
    },
    role: "grid",
  };
}

/**
 * Returns the sides of a selected cell on the selection's outer edge, or undefined for a cell with
 * none.
 */
function edgesOf(cell: Cell<Features, RowData>): string | undefined {
  const edges = cell.getSelectionEdges();
  const sides = SIDES.filter(([side]) => edges[side]).map(([, logical]) => logical);

  return sides.length === 0 ? undefined : sides.join(" ");
}

/**
 * Returns a selectable grid cell's attributes: its selection and the sides of it on the
 * selection's edge, its tab stop, its ids and the pointer handlers.
 *
 * @param table - The table whose focused cell a press focuses.
 * @param cell - The cell to mark, which the caller has found selectable.
 * @param prefix - The root's unique prefix of ids.
 * @param tabbed - The cell with the grid's tab stop.
 * @returns The attributes to spread onto the cell's element.
 */
export function gridMarksOf(
  table: DataTableApi,
  cell: Cell<Features, RowData>,
  prefix: string,
  tabbed: GridCell,
): GridMarks {
  const at = { columnId: cell.column.id, rowId: cell.row.id };
  const edges = edgesOf(cell);

  return {
    "aria-selected": cell.getIsSelected(),
    "data-column": at.columnId,
    ...(edges === undefined ? {} : { "data-edges": edges }),
    "data-row": at.rowId,
    id: cellIdOf(prefix, at),
    onMouseDown: (event) => {
      pressed(event, table, cell, prefix);
    },
    onMouseEnter: cell.getSelectionExtendHandler(),
    tabIndex: tabbed.rowId === at.rowId && tabbed.columnId === at.columnId ? 0 : -1,
  };
}

/**
 * Runs a grid: the attributes of its `table` element and its cells, its keys and copy, and the
 * editors of its cells.
 *
 * @remarks
 *   One cell's editor is open at a time. A key or a double click opens it over a cell of an
 *   editable column, with the cell's value as text or with the text the key typed. Saving runs the
 *   column's `validate`: a reason keeps the editor open with the reason under the cell. A valid
 *   text that differs from the cell's value goes to `onCellEdit`, and the caller writes it into
 *   `data`. After the editor closes, focus moves to the cell a key moved to, or back to the cell
 *   when the editor had focus, and remains where a person put it otherwise. In a grid with an
 *   editable column every selectable cell of another column states `aria-readonly`. A cell
 *   `unsaved` names states `data-unsaved` and renders `unsavedLabel` after its content for
 *   assistive technology.
 */

import { type Dispatch, type SetStateAction, useState } from "react";
import { flushSync } from "react-dom";

import { labelOf } from "#data-table/columns.ts";
import {
  type EditMode,
  editOf,
  editsOf,
  editStartOf,
  type Leave,
  leaveOf,
  textAt,
} from "#data-table/editing.ts";
import { type CellEdit } from "#data-table/features.ts";
import { GridContent, type GridContentProps } from "#data-table/grid-content.tsx";
import {
  type CellMarks,
  focusedTo,
  focusFocusedCell,
  type GridCell,
  gridMarksOf,
  type GridSheet,
  gridSheetOf,
  tabbedOf,
} from "#data-table/grid.ts";
import { type GridRendering } from "#data-table/rowed.tsx";
import { type DataTableApi } from "#data-table/use-data-table.ts";
import { useGridCopy } from "#data-table/use-grid-copy.ts";

/**
 * Describes an edit a grid saves: the cell's column and row, the row's record and the text.
 */
export interface CellEditEvent {
  /**
   * Id of the cell's column.
   */
  readonly columnId: string;

  /**
   * Record of the cell's row.
   */
  readonly record: unknown;

  /**
   * Id of the cell's row.
   */
  readonly rowId: string;

  /**
   * Text saved.
   */
  readonly value: string;
}

/**
 * Describes what a grid's editors read: the words, the table's size and the caller's calls.
 */
export interface GridWords {
  /**
   * Returns an editor's accessible name from its column's name.
   */
  readonly editLabel: (column: string) => string;

  /**
   * Receives each edit a person saves.
   */
  readonly onCellEdit: ((edit: CellEditEvent) => void) | undefined;

  /**
   * Size of the table, which an editor's control takes.
   */
  readonly size: "lg" | "md" | "sm";

  /**
   * Returns whether a cell has an unsaved change, from its row's and its column's ids.
   */
  readonly unsaved: ((rowId: string, columnId: string) => boolean) | undefined;

  /**
   * Words of an unsaved change, which a cell with one renders for assistive technology.
   */
  readonly unsavedLabel: string;
}

/**
 * Describes what a grid renders: its `table` element's attributes and what it adds to its cells.
 */
export interface Gridding {
  /**
   * Attributes and content the grid gives its cells, or undefined for a table that is not a grid
   * and a grid without a selectable cell.
   */
  readonly rendering: GridRendering | undefined;

  /**
   * Attributes of the `table` element, or undefined for a table that is not a grid.
   */
  readonly sheet: GridSheet | undefined;
}

/**
 * Describes the open editor: its cell, how the column edits, its mode and its text.
 */
interface Open extends GridCell {
  /**
   * How the cell's column edits.
   */
  readonly edit: CellEdit;

  /**
   * How the text field treats the arrows.
   */
  readonly mode: EditMode;

  /**
   * Text the editor opens with.
   */
  readonly text: string;
}

/**
 * Describes what the grid's calls read and change: the table, the prefix, the words and the state.
 */
interface Editing {
  /**
   * The open editor, or undefined.
   */
  readonly open: Open | undefined;

  /**
   * The root's unique prefix of ids.
   */
  readonly prefix: string;

  /**
   * Reason the open editor's last value was refused, or undefined.
   */
  readonly refused: string | undefined;

  /**
   * Opens or closes the editor.
   */
  readonly setOpen: Dispatch<SetStateAction<Open | undefined>>;

  /**
   * Records or clears the reason.
   */
  readonly setRefused: Dispatch<SetStateAction<string | undefined>>;

  /**
   * The table.
   */
  readonly table: DataTableApi;

  /**
   * The words and the caller's calls.
   */
  readonly words: GridWords;
}

/**
 * Opens a cell's editor for a keystroke or a double click, and returns whether the column edits.
 */
function started(editing: Editing, cell: GridCell, mode: EditMode, text?: string): boolean {
  const { table } = editing;
  const edit = editOf(table, cell.columnId);

  if (edit === undefined) return false;

  flushSync(() => {
    focusedTo(table, cell);
  });
  editing.setRefused(undefined);
  editing.setOpen({ ...cell, edit, mode, text: text ?? textAt(table, cell) });

  return true;
}

/**
 * Closes the editor, moves the focused cell after a key that saved, and focuses the focused cell
 * when the key moved it or the editor had focus.
 *
 * @remarks
 *   Focus leaving the editor saves it while the document's focused element is the body, so the
 *   element that takes focus keeps it.
 */
function closed(editing: Editing, leave?: Leave): void {
  const { prefix, table } = editing;
  const rtl = table.options.columnResizeDirection === "rtl";
  const way = leave === undefined ? undefined : leaveOf(leave.key, leave.shift, rtl);
  const inEditor = document.activeElement !== document.body;

  flushSync(() => {
    editing.setOpen(undefined);
    editing.setRefused(undefined);
  });
  if (way !== undefined) {
    flushSync(() => {
      table.moveCellSelection(way);
    });
  }
  if (way !== undefined || inEditor) focusFocusedCell(table, document, prefix, false);
}

/**
 * Saves the open editor's text: records the reason the column refuses it, or passes a changed
 * text to `onCellEdit` and closes the editor.
 */
function committed(editing: Editing, open: Open, text: string, leave?: Leave): void {
  const row = editing.table.getRow(open.rowId);
  const reason = open.edit.validate?.(text, row.original);

  if (reason !== undefined) {
    editing.setRefused(reason);

    return;
  }

  if (text !== textAt(editing.table, open)) {
    editing.words.onCellEdit?.({
      columnId: open.columnId,
      record: row.original,
      rowId: open.rowId,
      value: text,
    });
  }

  closed(editing, leave);
}

/**
 * Describes a cell of a grid's body.
 */
type BodyCell = Parameters<GridRendering["marks"]>[0];

/**
 * Returns a cell's row and column ids.
 */
function idsOf(cell: BodyCell): GridCell {
  return { columnId: cell.column.id, rowId: cell.row.id };
}

/**
 * Returns the open editor while it is open on a cell, else undefined.
 */
function openAt(open: Open | undefined, cell: GridCell): Open | undefined {
  return open?.rowId === cell.rowId && open.columnId === cell.columnId ? open : undefined;
}

/**
 * Returns whether a cell has an unsaved change the caller names.
 */
function unsavedAt(words: GridWords, cell: GridCell): boolean {
  return words.unsaved?.(cell.rowId, cell.columnId) === true;
}

/**
 * Returns the props of a cell's open editor.
 */
function editorOf(
  editing: Editing,
  cell: BodyCell,
  open: Open,
): NonNullable<GridContentProps["editor"]> {
  const { refused, words } = editing;

  return {
    editor: open.edit.editor,
    error: refused,
    label: words.editLabel(labelOf(cell.column)),
    mode: open.mode,
    onCancel: () => {
      closed(editing);
    },
    onCommit: (text, leave) => {
      committed(editing, open, text, leave);
    },
    size: words.size,
    text: open.text,
  };
}

/**
 * Returns a cell's attributes in the grid: its selection marks, and in a grid that edits whether
 * it is read-only, open or unsaved, and the double click that opens its editor.
 */
function marksOf(editing: Editing, cell: BodyCell, edits: boolean, tabbed: GridCell): CellMarks {
  if (!cell.getCanSelect()) return {};

  const here = idsOf(cell);
  const editable = cell.column.columnDef.meta?.edit !== undefined;
  const opening = {
    onDoubleClick: (): void => {
      started(editing, here, "caret");
    },
  };

  return {
    ...gridMarksOf(editing.table, cell, editing.prefix, tabbed),
    ...(edits && !editable ? { "aria-readonly": true } : {}),
    ...(openAt(editing.open, here) === undefined ? {} : { "data-editing": "" }),
    ...(unsavedAt(editing.words, here) ? { "data-unsaved": "" } : {}),
    ...(editable ? opening : {}),
  };
}

/**
 * Returns what the grid adds to its cells.
 */
function renderingOf(editing: Editing, tabbed: GridCell): GridRendering {
  const { open, words } = editing;
  const edits = editsOf(editing.table);

  return {
    content: (cell, content) => {
      const here = idsOf(cell);
      const opened = openAt(open, here);

      return (
        <GridContent
          editor={opened === undefined ? undefined : editorOf(editing, cell, opened)}
          unsaved={unsavedAt(words, here) ? words.unsavedLabel : undefined}
        >
          {content}
        </GridContent>
      );
    },
    marks: (cell) => marksOf(editing, cell, edits, tabbed),
    tabbedRow: tabbed.rowId,
  };
}

/**
 * Runs the grid of a table that is one, and nothing for any other table.
 *
 * @param table - The table whose selection, columns and rows the grid reads.
 * @param prefix - The root's unique prefix of ids.
 * @param active - Whether the table is a grid.
 * @param words - The words, the table's size and the caller's calls.
 * @returns The `table` element's attributes and what the grid adds to its cells.
 */
export function useGrid(
  table: DataTableApi,
  prefix: string,
  active: boolean,
  words: GridWords,
): Gridding {
  const [open, setOpen] = useState<Open>();
  const [refused, setRefused] = useState<string>();

  useGridCopy(table, prefix, active);

  if (!active) return { rendering: undefined, sheet: undefined };

  const editing = { open, prefix, refused, setOpen, setRefused, table, words };
  const tabbed = tabbedOf(table);
  const sheet = gridSheetOf(table, prefix, (from, stroke) => {
    const start = editStartOf(stroke);

    return start !== undefined && started(editing, from, start.mode, start.text);
  });

  return { rendering: tabbed === undefined ? undefined : renderingOf(editing, tabbed), sheet };
}

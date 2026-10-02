/**
 * Writes a grid's selected cells to the clipboard as tab-separated text on a copy while one of its
 * cells has focus.
 *
 * @remarks
 *   The hook listens on the document, because Firefox dispatches a copy without a text selection at
 *   the body rather than at the focused cell, and it decides by the focused element in every
 *   engine. A copy while focus is on another element, on another grid's cell, or on a grid without
 *   a selected cell is left to the browser.
 */

import { useEffect } from "react";

import { cellIdOf, gridCellOf, tsvOf } from "#data-table/grid.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Writes the selection as tab-separated text on a copy while the focused element is a cell of the
 * grid.
 *
 * @param event - The copy.
 * @param focused - The document's focused element.
 * @param table - The table whose selection is read.
 * @param prefix - The root's unique prefix of ids, which the grid's cells' ids open with.
 */
export function copiedOf(
  event: ClipboardEvent,
  focused: Element | null,
  table: DataTableApi,
  prefix: string,
): void {
  if (!(focused instanceof HTMLElement) || event.clipboardData === null) return;

  const cell = gridCellOf(focused);

  if (cell === undefined || focused.id !== cellIdOf(prefix, cell)) return;

  const regions = table.getSelectedCellRangesData();

  if (regions.length === 0) return;

  event.preventDefault();
  event.clipboardData.setData("text/plain", tsvOf(regions));
}

/**
 * Listens for a copy on the document while the table is a grid.
 *
 * @param table - The table whose selection a copy writes.
 * @param prefix - The root's unique prefix of ids.
 * @param active - Whether the table is a grid.
 */
export function useGridCopy(table: DataTableApi, prefix: string, active: boolean): void {
  useEffect(() => {
    /**
     * Writes the selection on a copy while a cell of the grid has focus.
     */
    const listener = (event: ClipboardEvent): void => {
      copiedOf(event, document.activeElement, table, prefix);
    };

    if (active) document.addEventListener("copy", listener);

    return (): void => {
      document.removeEventListener("copy", listener);
    };
  }, [active, prefix, table]);
}

/**
 * Hides a column from its menu, and moves focus to the menu button that takes its place.
 *
 * @remarks
 *   A hidden column's header leaves the table with its menu button, which had focus once the menu
 *   closed. React applies the hide first, and focus then moves to the menu button at the same place
 *   among the header's menu buttons, the next column's, or to the last one when the hidden
 *   column's button was last. A table whose other columns render no menu button leaves focus where
 *   the browser puts it.
 */

import { flushSync } from "react-dom";

import { type Column, type RowData } from "@tanstack/react-table";

import { type Features } from "#data-table/features.ts";

/**
 * Attribute every column menu button states, which the focus after a hide finds the buttons by.
 */
export const TRIGGER = "data-column-menu";

/**
 * Returns the menu buttons of a table's header, in the order they render.
 */
function buttonsOf(head: HTMLTableSectionElement): HTMLElement[] {
  return [...head.querySelectorAll<HTMLElement>(`[${TRIGGER}]`)];
}

/**
 * Hides a column and moves focus to the menu button that takes its button's place.
 *
 * @param column - The column to hide.
 * @param trigger - The column's menu button.
 */
export function hid(column: Column<Features, RowData>, trigger: HTMLElement): void {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a column's menu button renders inside its table's header
  const head = trigger.closest("thead") as HTMLTableSectionElement;
  const index = buttonsOf(head).indexOf(trigger);

  flushSync(() => {
    column.toggleVisibility(false);
  });

  const buttons = buttonsOf(head);

  (buttons[index] ?? buttons.at(-1))?.focus();
}

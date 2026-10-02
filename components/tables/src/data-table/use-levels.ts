/**
 * Runs the tab stop and the keys of a table with levels, and returns the `treegrid` attributes of
 * its `table` element.
 *
 * @remarks
 *   One record row has the tab stop: the row that last had focus while it renders, else the first
 *   row. A focused row takes the keys `moveOf` maps, which `stepOf` turns into an open, a close or
 *   a move. A keystroke with Alt, Control or Meta pressed is left to the browser. The row that
 *   opens or closes renders before focus moves, and so does the row that takes focus, so a windowed
 *   table renders a row out of view first. The table reads right to left while
 *   `columnResizeDirection` is `rtl`, the direction the resize keys read. The table states
 *   `aria-multiselectable` while a column selects rows. A table without levels takes no role and no
 *   handlers.
 */

import {
  type Dispatch,
  type FocusEvent,
  type KeyboardEvent,
  type SetStateAction,
  useState,
} from "react";
import { flushSync } from "react-dom";

import { leveledOf, moveOf, stepOf, type Walk } from "#data-table/levels.ts";
import { detailOf, recordIdOf, regionsOf, rowIdOf, selectsOf } from "#data-table/rows.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes the attributes of the `table` element of a table with levels.
 */
export interface TreeGrid {
  /**
   * Present while a column selects rows, which a person may select several of.
   */
  readonly "aria-multiselectable"?: true;

  /**
   * Records the row that takes focus, which then has the tab stop.
   */
  readonly onFocus: (event: FocusEvent<HTMLTableElement>) => void;

  /**
   * Opens, closes or leaves the focused row, and moves focus to another row.
   */
  readonly onKeyDown: (event: KeyboardEvent<HTMLTableElement>) => void;

  /**
   * Role of the table.
   */
  readonly role: "treegrid";
}

/**
 * Describes what a table with levels renders: the row with the tab stop, and the attributes of
 * its `table` element.
 */
export interface Leveled {
  /**
   * Id of the row with the tab stop, or undefined for a table without levels or without rows.
   */
  readonly active: string | undefined;

  /**
   * Attributes of the `table` element, or undefined for a table without levels.
   */
  readonly sheet: TreeGrid | undefined;
}

/**
 * Applies a keystroke on a focused row: opens or closes it, and moves focus to the row the step
 * names once that row renders.
 */
function stepped(
  event: KeyboardEvent<HTMLTableElement>,
  walk: Walk,
  prefix: string,
  setFocused: Dispatch<SetStateAction<string | undefined>>,
): void {
  const id = recordIdOf(event.target);
  const move = moveOf(event.key, walk.table.options.columnResizeDirection === "rtl");

  if (id === undefined || move === undefined || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  event.preventDefault();

  const { expanded, focus } = stepOf(walk, id, move);

  flushSync(() => {
    if (expanded !== undefined) walk.table.getRow(id).toggleExpanded(expanded);
    if (focus !== undefined) setFocused(focus);
  });

  if (focus === undefined) return;

  const selector = `[id="${rowIdOf(prefix, focus)}"]`;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the row renders once the state that names it commits
  (event.currentTarget.ownerDocument.querySelector(selector) as HTMLElement).focus();
}

/**
 * Returns the row with the tab stop and the `treegrid` attributes of a table with levels.
 *
 * @param table - The table whose rows, columns, options and state are read.
 * @param prefix - The root's unique prefix of ids, by which a keystroke finds a row.
 * @returns The row with the tab stop and the `table` element's attributes.
 */
export function useLevels(table: DataTableApi, prefix: string): Leveled {
  const [focused, setFocused] = useState<string>();

  if (!leveledOf(table)) return { active: undefined, sheet: undefined };

  const rows = regionsOf(table).map(({ row }) => row);
  const walk: Walk = { detailed: detailOf(table) !== undefined, rows, table };

  return {
    active: rows.some((row) => row.id === focused) ? focused : rows[0]?.id,
    sheet: {
      ...(selectsOf(table) ? { "aria-multiselectable": true } : {}),
      onFocus: (event) => {
        const id = recordIdOf(event.target);

        if (id !== undefined) setFocused(id);
      },
      onKeyDown: (event) => {
        stepped(event, walk, prefix, setFocused);
      },
      role: "treegrid",
    },
  };
}

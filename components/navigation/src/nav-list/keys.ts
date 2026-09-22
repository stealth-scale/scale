/**
 * Moves focus from row to row on the arrow keys, Home and End.
 *
 * @remarks
 *   A sidebar holding sixty destinations is one a reader crosses with the arrows. Tab reaches every
 *   row on its own, and it also reaches every branch and every control beside a row, so a reader
 *   looking for the twentieth page presses it forty times. The arrows step row to row instead.
 *   Every row keeps its own tab stop. The list states no role and announces no orientation, so a
 *   keyboard that walks it row by row still works and the arrows are the shorter way rather than
 *   the only one. The accessibility package's roving focus group is the other answer, and it is the
 *   one a toolbar takes: it holds the whole group to a single tab stop, which is what
 *   `role=toolbar` promises and what a list of links does not. The rows are read from the DOM
 *   rather than registered by each part, because a branch draws a list of its own and the root
 *   cannot see through the components between them. They are read on each press, so a branch that
 *   has just opened is stepped into without anything telling the root it did.
 */

import { type KeyboardEvent, useCallback } from "react";

import { CLASS } from "#nav-list/recipe.ts";

/**
 * Selects the rows the arrows step through: a destination, and the row a branch opens from.
 *
 * @remarks
 *   The control beside a row is left out. It acts on the row rather than being one, and a reader
 *   crossing the list would stop on it twice for every destination.
 */
const ROWS = `.${CLASS}__link, .${CLASS}__trigger`;

/**
 * Where a key asks focus to go: one end of the list, or a signed step from the row it is on.
 */
type Intent = "end" | "start" | number;

/**
 * The step each arrow moves by, before the writing direction is applied to the inline pair.
 */
const STEPS: Readonly<Record<string, number | undefined>> = {
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
};

/**
 * The arrows that run along the line rather than down the page.
 */
const ALONG_THE_LINE = new Set(["ArrowLeft", "ArrowRight"]);

/**
 * Translates a key press into where it asks focus to go.
 *
 * @param key - The `key` value of the keyboard event.
 * @param along - Whether the list runs along the line, which a dock does and a column does not.
 * @param forward - 1 in a left-to-right list and -1 in a right-to-left one.
 * @returns Where to go, or undefined where the list does not answer the key.
 */
function intentOf(key: string, along: boolean, forward: number): Intent | undefined {
  if (key === "Home") return "start";
  if (key === "End") return "end";

  const step = STEPS[key];

  if (step === undefined || ALONG_THE_LINE.has(key) !== along) return undefined;

  return along ? step * forward : step;
}

/**
 * Reports whether a row is one a reader can see.
 *
 * @remarks
 *   Two readings, because a row is hidden two ways. A closed branch marks the list it holds
 *   `hidden`, which is an attribute on an ancestor. A list collapsed to a rail of marks takes its
 *   nested lists out of the layout, which is a computed style and nothing an attribute reports.
 */
function shown(row: HTMLElement): boolean {
  return row.closest("[hidden]") === null && row.checkVisibility();
}

/**
 * Returns the rows a reader can see, in the order they are drawn.
 */
function rowsOf(root: HTMLElement): readonly HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(ROWS)].filter((row) => shown(row));
}

/**
 * Returns the row focus moves to, holding at the ends rather than continuing at the other.
 *
 * @remarks
 *   A list of destinations has a first and a last, and a reader holding the down arrow to reach the
 *   foot of it does not expect to arrive back at the head.
 */
function nextOf(
  rows: readonly HTMLElement[],
  from: number,
  intent: Intent,
): HTMLElement | undefined {
  if (intent === "start") return rows[0];
  if (intent === "end") return rows.at(-1);

  return rows[Math.min(rows.length - 1, Math.max(0, from + intent))];
}

/**
 * Builds the key handler the list answers with.
 *
 * @remarks
 *   The row a press comes from is the one holding what has focus rather than the one the event
 *   names, because a row holds a mark and a count and the press bubbles up through them.
 * @param along - Whether the list runs along the line, which the `dock` variant does.
 * @returns The handler, which ignores every key the list does not answer.
 */
export function useRowKeys(along: boolean): (event: KeyboardEvent<HTMLElement>) => void {
  return useCallback(
    (event: KeyboardEvent<HTMLElement>): void => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;

      const root = event.currentTarget;
      const direction = globalThis.getComputedStyle(root).direction;
      const intent = intentOf(event.key, along, direction === "rtl" ? -1 : 1);

      if (intent === undefined) return;

      const rows = rowsOf(root);
      const at = rows.findIndex((row) => row.contains(root.ownerDocument.activeElement));

      if (at === -1) return;

      nextOf(rows, at, intent)?.focus();
      event.preventDefault();
    },
    [along],
  );
}

/**
 * Moves focus between rows with the arrow keys, Home and End.
 *
 * @remarks
 *   Tab reaches every row, every branch trigger and every control beside a row, so reaching the
 *   twentieth link of a sidebar with sixty takes about forty presses. The arrow keys step from row
 *   to row instead. Every row keeps its own tab stop, and the list sets no role and no orientation,
 *   so Tab still works and the arrow keys are a shortcut. The a11y package's roving focus group is
 *   the alternative a toolbar uses: it gives the whole group one tab stop, which `role="toolbar"`
 *   requires and a list of links does not. The rows are queried from the DOM on each key press,
 *   not registered by each part, because the root cannot see through the components between it and
 *   a branch's nested list, and a branch that has just opened is included without notifying the
 *   root.
 */

import { type KeyboardEvent, useCallback } from "react";

import { CLASS } from "#nav-list/recipe.ts";

/**
 * Selects the rows the arrow keys step through: links and branch triggers.
 *
 * @remarks
 *   The control beside a row is excluded. It acts on the row, and including it would add a second
 *   stop for every row that has one.
 */
const ROWS = `.${CLASS}__link, .${CLASS}__trigger`;

/**
 * Describes where a key moves focus: to one end of the list, or by a signed step from the current
 * row.
 */
type Intent = "end" | "start" | number;

/**
 * Maps each arrow key to its step, before the writing direction is applied to the inline pair.
 */
const STEPS: Readonly<Record<string, number | undefined>> = {
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
};

/**
 * The arrow keys on the inline axis.
 */
const ALONG_THE_LINE = new Set(["ArrowLeft", "ArrowRight"]);

/**
 * Returns where a key moves focus, or `undefined` when the list does not handle the key.
 *
 * @param key - The `key` value of the keyboard event.
 * @param along - Whether the rows run along the inline axis, as in the dock.
 * @param forward - 1 in a left-to-right list and -1 in a right-to-left list.
 */
function intentOf(key: string, along: boolean, forward: number): Intent | undefined {
  if (key === "Home") return "start";
  if (key === "End") return "end";

  const step = STEPS[key];

  if (step === undefined || ALONG_THE_LINE.has(key) !== along) return undefined;

  return along ? step * forward : step;
}

/**
 * Returns whether a row is visible.
 *
 * @remarks
 *   A row is hidden in two ways. A closed branch sets `hidden` on its nested list, an attribute on
 *   an ancestor. The iconic list removes nested lists from the layout, a computed style that no
 *   attribute reports.
 */
function shown(row: HTMLElement): boolean {
  return row.closest("[hidden]") === null && row.checkVisibility();
}

/**
 * Returns the visible rows in document order.
 */
function rowsOf(root: HTMLElement): readonly HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(ROWS)].filter((row) => shown(row));
}

/**
 * Returns the row focus moves to, stopping at the first and last rows instead of wrapping.
 *
 * @remarks
 *   A person holding the down arrow to reach the end of a list does not expect to arrive back at
 *   the top.
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
 * Returns the list's key handler.
 *
 * @remarks
 *   The handler finds the current row from the focused element, not from the event target, because
 *   a key press can bubble up from an icon or a count inside the row.
 * @param along - Whether the rows run along the inline axis, as in the `dock` variant.
 * @returns The handler, which ignores every key the list does not handle.
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

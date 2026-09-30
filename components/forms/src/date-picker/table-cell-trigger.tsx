/**
 * Renders the button inside a table cell that a person picks the cell's date with.
 *
 * @remarks
 *   The element is a `div` in the `button` role, in the tab order only while keyboard focus is on
 *   its date. A day's trigger is named by its date in the locale, a month's by the month and a
 *   year's by the year. A press or Space selects it, and Enter does through the table. It contains
 *   the caller's text, such as the day of the month. The arrows move focus from a script, and
 *   Firefox matches `:focus-visible` on such a focus only when the element before it matched, which
 *   a day focused as a press opens the panel does not. A trigger focused while the last input was a
 *   key sets `data-focus-visible`, which the ring's condition matches in every browser.
 */

import { type ComponentProps, type FocusEvent, type KeyboardEvent, type ReactElement } from "react";

import { isFocusVisible } from "@zag-js/focus-visible";
import { mergeProps } from "@zag-js/react";

import { cellTriggerProps } from "#date-picker/cells.ts";
import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useCell, useTable } from "#date-picker/scopes.ts";

/**
 * Renders the `div` with the date picker's table cell trigger class.
 */
const Picked = withContext("div", "tableCellTrigger");

/**
 * Describes the props of a table cell trigger: its text and the props of a `div`.
 */
export type TableCellTriggerProps = ComponentProps<typeof Picked>;

/**
 * Selects the cell on Space, as a button does, and keeps the page from scrolling.
 */
function spaced(event: KeyboardEvent<HTMLDivElement>): void {
  if (event.key !== " ") return;

  event.preventDefault();
  event.currentTarget.click();
}

/**
 * Sets `data-focus-visible` on the trigger as it takes focus when the last input was a key.
 */
function focused(event: FocusEvent<HTMLDivElement>): void {
  event.currentTarget.toggleAttribute("data-focus-visible", isFocusVisible());
}

/**
 * Removes the trigger's `data-focus-visible` as it loses focus.
 */
function blurred(event: FocusEvent<HTMLDivElement>): void {
  event.currentTarget.toggleAttribute("data-focus-visible", false);
}

/**
 * Renders the trigger with the machine's props for its cell.
 *
 * @param props - The text and the props of a `div`.
 * @returns The `div` element in the `button` role.
 */
export function TableCellTrigger(props: TableCellTriggerProps): ReactElement {
  const api = useDatePicker();
  const { view } = useTable();
  const cell = useCell();

  return (
    <Picked
      {...mergeProps(
        cellTriggerProps(api, view, cell),
        { onBlur: blurred, onFocus: focused, onKeyDown: spaced },
        props,
      )}
    />
  );
}

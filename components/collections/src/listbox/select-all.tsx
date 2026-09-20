/**
 * Draws the row that turns the whole list on, and again to clear it.
 *
 * @remarks
 *   It counts off the list it is in rather than off every row that exists, so a narrowed list is
 *   counted as narrowed: pressing it takes what a reader can see and not what the filter hid.
 *   Part of the way through it says so, through `data-state="indeterminate"`, so the row reports
 *   how much of the list is on rather than only whether it was pressed. A box drawn inside it
 *   reads that state the same way a row's box reads its own.
 *   The element is a `button` that stays pressed rather than a checkbox, because what it does is
 *   act on the list rather than hold a value of its own, and `aria-pressed` carries the part-way
 *   state as `mixed` the same way a checkbox would.
 *   The box it draws is the list's, taken from the root along with the two marks, so the row above
 *   a boxed list carries the same box as the rows beneath it. The part-way mark is picked here
 *   rather than switched in the stylesheet, because the row already knows which of the two it is
 *   in and a rule that swapped them would have to size two marks that are never both drawn.
 *   It belongs on a list of several. The machine throws on `selectAll` in the single mode, and the
 *   connected api carries no flag to test the mode by, so the rule is stated here rather than
 *   guarded: turning a whole list on has no meaning where only one row can be on.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#listbox/context.ts";
import { ItemCheckbox } from "#listbox/item-checkbox.ts";
import { useListbox } from "#listbox/machine.ts";
import { useShown } from "#listbox/shown.ts";

/**
 * Draws the row above the list.
 */
const Whole = withContext("button", "selectAll", { defaultProps: { type: "button" } });

/**
 * Describes what the row takes: everything a styled button element takes.
 */
export type SelectAllProps = ComponentProps<typeof Whole>;

/**
 * Selects how much of the list is on.
 */
type Held = "checked" | "indeterminate" | "unchecked";

/**
 * Reports how much of the list is on.
 */
function heldBy(picked: number, total: number): Held {
  if (picked === 0) return "unchecked";

  return picked === total ? "checked" : "indeterminate";
}

/**
 * Turns the whole list on, and again to clear it.
 *
 * @param props - The words above the list, and everything a styled button takes.
 * @returns The row, holding its box and saying how much of the list is on.
 */
export function SelectAll({ children, onClick, ...rest }: SelectAllProps): ReactElement {
  const api = useListbox();
  const { boxed, mark, mixedMark } = useShown();
  const state = heldBy(api.value.length, api.collection.size);

  return (
    <Whole
      {...rest}
      aria-pressed={state === "indeterminate" ? "mixed" : state === "checked"}
      data-state={state}
      onClick={(event) => {
        if (state === "checked") api.clearValue();
        else api.selectAll();
        onClick?.(event);
      }}
    >
      {boxed ? <ItemCheckbox>{state === "indeterminate" ? mixedMark : mark}</ItemCheckbox> : null}
      {children}
    </Whole>
  );
}

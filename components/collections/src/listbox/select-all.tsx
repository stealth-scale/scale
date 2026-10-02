/**
 * Renders the row that selects every row of the list, and clears the selection when every row is
 * selected.
 *
 * @remarks
 *   The row counts the collection it is in, so in a filtered list it selects the visible rows. The
 *   element is a toggle `button`: `aria-pressed` is `true`, `false` or `mixed`, and `data-state` is
 *   `checked`, `unchecked` or `indeterminate`. In a boxed list it renders the root's checkbox and
 *   picks the mixed mark while part of the list is selected. The row belongs in a list that allows
 *   several rows: the machine throws on `selectAll` in the single mode, and the api exposes no mode
 *   to check.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#listbox/context.ts";
import { ItemCheckbox } from "#listbox/item-checkbox.ts";
import { useListbox } from "#listbox/machine.ts";
import { useShown } from "#listbox/shown.ts";

/**
 * Renders the `button` with the listbox's select-all class.
 */
const Whole = withContext("button", "selectAll", { defaultProps: { type: "button" } });

/**
 * Describes the props of the select-all row: the props of a `button`.
 */
export type SelectAllProps = ComponentProps<typeof Whole>;

/**
 * Selects how much of the list is selected.
 */
type Held = "checked" | "indeterminate" | "unchecked";

/**
 * Returns how much of the list is selected.
 */
function heldBy(picked: number, total: number): Held {
  if (picked === 0) return "unchecked";

  return picked === total ? "checked" : "indeterminate";
}

/**
 * Renders the select-all row.
 *
 * @param props - The row's text as children, and the props of a `button`.
 * @returns The `button` element with `aria-pressed` and `data-state`.
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

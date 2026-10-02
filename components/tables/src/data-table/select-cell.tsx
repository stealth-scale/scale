/**
 * Renders the checkbox that selects one row, in the select column's cell.
 *
 * @remarks
 *   The box is the forms `Checkbox`, named by the caller's label for the row. It is checked while
 *   the row or every row under it is selected, and partly on while some rows under it are. A press
 *   with Shift held, by the pointer or with Space, selects or clears every row from the row pressed
 *   before it, TanStack's range. Firefox does not pass a click with Shift held from a label to its
 *   box, so the cell applies such a press itself in both engines and cancels the label's default,
 *   then focuses the box. The box is in a `span` one line tall that centres it, so its row is as
 *   tall as a row of text. The cell reads the table from the root, so its state follows every
 *   change.
 */

import { type ReactElement, type ReactNode, useRef } from "react";

import { Checkbox } from "@stealthscale/component-forms";

import { SelectBox } from "#data-table/bound.ts";
import { checkedOf, selectableOf, selectedOf } from "#data-table/rows.ts";
import { SelectLabel } from "#data-table/select-label.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of a row's checkbox: the row, its name and its two glyphs.
 */
export interface SelectCellProps {
  /**
   * Id of the row the box selects.
   */
  readonly id: string;

  /**
   * Glyph inside the box while some rows under the row are selected, such as a dash.
   */
  readonly indeterminateIndicator?: ReactNode | undefined;

  /**
   * Glyph inside a checked box, such as a check mark.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Accessible name of the box, such as "Select Halden Freight".
   */
  readonly label: string;
}

/**
 * Renders the row's checkbox, checked while the row is selected.
 *
 * @param props - The row's id, the box's name and the glyphs.
 * @returns The `span` around the checkbox's `label` element.
 */
export function SelectCell({
  id,
  indeterminateIndicator,
  indicator,
  label,
}: SelectCellProps): ReactElement {
  const table = useTableState();
  const shifted = useRef(false);

  return (
    <SelectBox>
      <Checkbox.Root
        checked={checkedOf(table, id)}
        disabled={!selectableOf(table, id)}
        onCheckedChange={(details) => {
          table.getRow(id).getToggleSelectedHandler()({
            shiftKey: shifted.current,
            target: { checked: details.checked === true },
          });
        }}
        onClick={(event) => {
          if (!event.shiftKey || event.target instanceof HTMLInputElement) return;

          event.preventDefault();
          table.getRow(id).getToggleSelectedHandler()({
            shiftKey: true,
            target: { checked: !selectedOf(table, id) },
          });
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the checkbox's root is the label of the input it renders
          (event.currentTarget.control as HTMLInputElement).focus();
        }}
        onKeyDownCapture={(event) => {
          shifted.current = event.shiftKey;
        }}
        onPointerDownCapture={(event) => {
          shifted.current = event.shiftKey;
        }}
      >
        <Checkbox.Control>
          <Checkbox.Indicator>{indicator}</Checkbox.Indicator>
          <Checkbox.Indicator indeterminate>{indeterminateIndicator}</Checkbox.Indicator>
        </Checkbox.Control>
        <SelectLabel>{label}</SelectLabel>
      </Checkbox.Root>
    </SelectBox>
  );
}

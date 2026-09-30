/**
 * Renders the checkbox that selects every row, in the select column's header.
 *
 * @remarks
 *   The box is the forms `Checkbox`: on while every row the filters leave is selected, partly on
 *   while some are, and off otherwise. A press on a box that is partly on selects every row. The
 *   box is in a `span` one line tall that centres it, so the header is as tall as one without it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Checkbox } from "@stealthscale/component-forms";

import { SelectBox } from "#data-table/bound.ts";
import { everySelectedOf } from "#data-table/rows.ts";
import { SelectLabel } from "#data-table/select-label.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of the header's checkbox: its name and its two glyphs.
 */
export interface SelectAllProps {
  /**
   * Glyph inside the box while some rows are selected, such as a dash.
   */
  readonly indeterminateIndicator?: ReactNode | undefined;

  /**
   * Glyph inside the box while every row is selected, such as a check mark.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Accessible name of the box, such as "Select every payout".
   */
  readonly label: string;
}

/**
 * Renders the header's checkbox in the state of the table's selection.
 *
 * @param props - The box's name and its glyphs.
 * @returns The `span` around the checkbox's `label` element.
 */
export function SelectAll({
  indeterminateIndicator,
  indicator,
  label,
}: SelectAllProps): ReactElement {
  const table = useTableState();

  return (
    <SelectBox>
      <Checkbox.Root
        checked={everySelectedOf(table)}
        onCheckedChange={(details) => {
          table.toggleAllRowsSelected(details.checked === true);
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

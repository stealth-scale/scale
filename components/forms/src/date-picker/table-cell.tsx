/**
 * Renders a cell of a table: a day, a month or a year.
 *
 * @remarks
 *   The element is a `gridcell` that reports `aria-selected` while its date is selected or in the
 *   selected range, `aria-current="date"` for today, and `aria-disabled` while a person cannot pick
 *   it. Its trigger reads the cell's value from it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { cellProps } from "#date-picker/cells.ts";
import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { CellProvider, type CellScope, useTable } from "#date-picker/scopes.ts";

/**
 * Renders the `td` with the date picker's table cell class.
 */
const Celled = withContext("td", "tableCell");

/**
 * Describes the props of a table cell: its value, whether it is disabled, the range its table
 * shows, and the props of a `td`.
 */
export interface TableCellProps
  extends CellScope, Omit<ComponentProps<typeof Celled>, keyof CellScope> {}

/**
 * Renders the cell with the machine's props for its table's view, and provides the cell to its
 * trigger.
 *
 * @remarks
 *   The cell spans one column. The machine's month and year getters set `colSpan` to the columns
 *   they are given, so the cell passes them none.
 * @param props - The value, the disabled state, the visible range, the trigger and the props of a
 *   `td`.
 * @returns The `td` element in the `gridcell` role.
 */
export function TableCell({
  disabled,
  value,
  visibleRange,
  ...props
}: TableCellProps): ReactElement {
  const api = useDatePicker();
  const { view } = useTable();
  const cell: CellScope = { ...omitUndefined({ disabled, visibleRange }), value };

  return (
    <CellProvider value={cell}>
      <Celled {...mergeProps(cellProps(api, view, cell), props)} />
    </CellProvider>
  );
}

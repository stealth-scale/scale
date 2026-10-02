/**
 * Renders a table of the days of a month, the months of a year or the years of a decade.
 *
 * @remarks
 *   The element is a `grid` named by the visible range, such as "September 2026", and the machine
 *   moves focus through its cells: the arrows by a day, a week, a month or a year, Page Up and Page
 *   Down by a month and by a year with Shift, Home and End to the view's first and last cell, the
 *   first and the last day of the month in the day view. Enter and Space select the focused cell.
 *   The machine's English roledescription is left out.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-picker/context.ts";
import { type DatePickerApi, useDatePicker } from "#date-picker/machine.ts";
import { TableProvider, type TableScope, useView } from "#date-picker/scopes.ts";
import { visibleText } from "#date-picker/texts.ts";

/**
 * Renders the `table` with the date picker's table class.
 */
const Gridded = withContext("table", "table");

/**
 * Describes the props of a table: the number of its columns and the props of a `table`.
 */
export interface TableProps extends Omit<ComponentProps<typeof Gridded>, "columns"> {
  /**
   * Number of columns: 7 days, else 4 months or years by default.
   */
  readonly columns?: number | undefined;
}

/**
 * Renders the table with the machine's table props for its view, and provides the table to its
 * cells.
 *
 * @param props - The columns, the head and the body, and the props of a `table`.
 * @returns The `table` element in the `grid` role.
 */
export function Table({ columns, ...props }: TableProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();
  const id = useId();
  const scope: TableScope = { columns, id, view };
  const {
    "aria-roledescription": _description,
    ...machine
  }: ReturnType<DatePickerApi["getTableProps"]> = api.getTableProps(omitUndefined(scope));

  return (
    <TableProvider value={scope}>
      <Gridded {...mergeProps(machine, { "aria-label": visibleText(api) }, props)} />
    </TableProvider>
  );
}

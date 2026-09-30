/**
 * Renders a week's number at the start of its row.
 *
 * @remarks
 *   The element is the row's `rowheader`, named by `label` and the number, "Week 39" by default.
 *   It shows the number in the locale's week numbering.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type DateValue } from "@internationalized/date";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";

/**
 * Renders the `td` with the date picker's table cell class.
 */
const Numbered = withContext("td", "tableCell");

/**
 * Describes the props of a week number cell: the week, its index, the word before the number and
 * the props of a `td`.
 */
export interface WeekNumberCellProps extends ComponentProps<typeof Numbered> {
  /**
   * Word before the number in the cell's name. Defaults to `Week`.
   */
  readonly label?: string | undefined;

  /**
   * The days of the week.
   */
  readonly week: DateValue[];

  /**
   * Index of the week in the table.
   */
  readonly weekIndex: number;
}

/**
 * Renders the cell with the machine's week number props, named by `label` and the number.
 *
 * @param props - The week, its index, the word and the props of a `td`.
 * @returns The `td` element in the `rowheader` role.
 */
export function WeekNumberCell({
  children,
  label = "Week",
  week,
  weekIndex,
  ...props
}: WeekNumberCellProps): ReactElement {
  const api = useDatePicker();
  const number = api.getWeekNumber(week);

  return (
    <Numbered
      {...mergeProps(
        api.getWeekNumberCellProps({ week, weekIndex }),
        { "aria-label": `${label} ${number}` },
        props,
      )}
    >
      {children ?? number}
    </Numbered>
  );
}

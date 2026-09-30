/**
 * Renders a month of days: a head of weekday names and a row per week, with the week numbers
 * where the root shows them.
 *
 * @remarks
 *   `offset` shows a month after the first visible one, for a panel of `numOfMonths` months. Every
 *   table is named by the month it shows, such as "October 2026", also where the panel shows two.
 *   The weekday names are short, such as `Mon` in `en-US`. `weekLabel` names the week numbers'
 *   column and precedes each week's number in its row header's name.
 */

import { type ReactElement } from "react";

import { DayHead } from "#date-picker/day-head.tsx";
import { useDatePicker } from "#date-picker/machine.ts";
import { TableBody } from "#date-picker/table-body.tsx";
import { TableCellTrigger } from "#date-picker/table-cell-trigger.tsx";
import { TableCell } from "#date-picker/table-cell.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { Table, type TableProps } from "#date-picker/table.tsx";
import { WeekNumberCell } from "#date-picker/week-number-cell.tsx";

/**
 * Describes the props of a day table: the month it shows, the word of its week numbers and the
 * props of a table.
 */
export interface DayTableProps extends Omit<TableProps, "children" | "columns" | "offset"> {
  /**
   * Months after the first visible one the table shows. Defaults to 0.
   */
  readonly offset?: number | undefined;

  /**
   * Name of the week numbers' column and the word before each week's number. Defaults to `Week`.
   */
  readonly weekLabel?: string | undefined;
}

/**
 * Renders the days of the first visible month, or of the month `offset` after it.
 *
 * @param props - The offset, the week numbers' word and the props of a `table`.
 * @returns The `table` element.
 */
export function DayTable({ offset = 0, weekLabel, ...props }: DayTableProps): ReactElement {
  const api = useDatePicker();
  const shown = api.getOffset({ months: offset });

  return (
    <Table aria-label={shown.visibleRangeText.start} {...props}>
      <DayHead weekLabel={weekLabel} />
      <TableBody>
        {shown.weeks.map((week, index) => (
          <TableRow key={week[0]?.toString()}>
            {api.showWeekNumbers ? (
              <WeekNumberCell label={weekLabel} week={week} weekIndex={index} />
            ) : null}
            {week.map((day) => (
              <TableCell key={day.toString()} value={day} visibleRange={shown.visibleRange}>
                <TableCellTrigger>{day.day}</TableCellTrigger>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

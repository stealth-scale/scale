/**
 * Renders the head of a month of days: a row of short weekday names in the locale, after the week
 * numbers' header where the root shows week numbers.
 */

import { type ReactElement } from "react";

import { useDatePicker } from "#date-picker/machine.ts";
import { TableHead } from "#date-picker/table-head.tsx";
import { TableHeader } from "#date-picker/table-header.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { WeekNumberHeaderCell } from "#date-picker/week-number-header-cell.tsx";

/**
 * Describes the props of the head: the name of the week numbers' column.
 */
export interface DayHeadProps {
  /**
   * Name of the week numbers' column. Defaults to `Week`.
   */
  readonly weekLabel?: string | undefined;
}

/**
 * Renders the head row of `DatePicker.DayTable`.
 *
 * @param props - The name of the week numbers' column.
 * @returns The `thead` element.
 */
export function DayHead({ weekLabel }: DayHeadProps): ReactElement {
  const api = useDatePicker();

  return (
    <TableHead>
      <TableRow>
        {api.showWeekNumbers ? (
          <WeekNumberHeaderCell label={weekLabel}>#</WeekNumberHeaderCell>
        ) : null}
        {api.weekDays.map((day) => (
          <TableHeader key={day.short}>{day.short}</TableHeader>
        ))}
      </TableRow>
    </TableHead>
  );
}

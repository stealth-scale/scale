/**
 * Renders the months of a year, four to a row, by their short names in the locale.
 */

import { type ReactElement } from "react";

import { useDatePicker } from "#date-picker/machine.ts";
import { TableBody } from "#date-picker/table-body.tsx";
import { TableCellTrigger } from "#date-picker/table-cell-trigger.tsx";
import { TableCell } from "#date-picker/table-cell.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { Table, type TableProps } from "#date-picker/table.tsx";

/**
 * Describes the props of a month table: the props of a table.
 */
export type MonthTableProps = Omit<TableProps, "children">;

/**
 * Renders the months of the visible year.
 *
 * @param props - The columns, 4 by default, and the props of a `table`.
 * @returns The `table` element.
 */
export function MonthTable({ columns = 4, ...props }: MonthTableProps): ReactElement {
  const api = useDatePicker();

  return (
    <Table columns={columns} {...props}>
      <TableBody>
        {api.getMonthsGrid({ columns, format: "short" }).map((months) => (
          <TableRow key={months[0]?.value}>
            {months.map((month) => (
              <TableCell key={month.value} value={month.value}>
                <TableCellTrigger>{month.label}</TableCellTrigger>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

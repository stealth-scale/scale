/**
 * Renders the years of a decade, four to a row.
 */

import { type ReactElement } from "react";

import { useDatePicker } from "#date-picker/machine.ts";
import { TableBody } from "#date-picker/table-body.tsx";
import { TableCellTrigger } from "#date-picker/table-cell-trigger.tsx";
import { TableCell } from "#date-picker/table-cell.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { Table, type TableProps } from "#date-picker/table.tsx";

/**
 * Describes the props of a year table: the props of a table.
 */
export type YearTableProps = Omit<TableProps, "children">;

/**
 * Renders the years of the visible decade.
 *
 * @param props - The columns, 4 by default, and the props of a `table`.
 * @returns The `table` element.
 */
export function YearTable({ columns = 4, ...props }: YearTableProps): ReactElement {
  const api = useDatePicker();

  return (
    <Table columns={columns} {...props}>
      <TableBody>
        {api.getYearsGrid({ columns }).map((years) => (
          <TableRow key={years[0]?.value}>
            {years.map((year) => (
              <TableCell key={year.value} value={year.value}>
                <TableCellTrigger>{year.label}</TableCellTrigger>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

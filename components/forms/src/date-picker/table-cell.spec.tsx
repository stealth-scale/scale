import { parseDate, today } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { day, inlined, OCTOBER_14 } from "#date-picker/date-picker.fixtures.tsx";
import { TableBody } from "#date-picker/table-body.tsx";
import { TableCellTrigger } from "#date-picker/table-cell-trigger.tsx";
import { TableCell } from "#date-picker/table-cell.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { Table } from "#date-picker/table.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Returns the cell of the day of the given name.
 *
 * @param name - The day's name, such as `Wednesday, October 14, 2026`.
 * @returns The `td` element, or nothing outside a cell.
 */
function cellOf(name: string): HTMLElement | null {
  return day(name).closest("td");
}

describe("TableCell", () => {
  it("renders a td in the gridcell role", async () => {
    await drawn(inlined());

    const cell = cellOf("Wednesday, October 14, 2026");

    expect([cell?.tagName, cell?.getAttribute("role")]).toStrictEqual(["TD", "gridcell"]);
  });

  it("sets aria-selected on a selected day", async () => {
    await drawn(inlined({ defaultValue: [OCTOBER_14] }));

    expect(cellOf("Wednesday, October 14, 2026")?.getAttribute("aria-selected")).toBe("true");
  });

  it("sets aria-current to date on today", async () => {
    const now = today("UTC");
    const { container } = await drawn(inlined({ defaultFocusedValue: now }));

    expect(
      container.querySelector(`td[data-value="${now.toString()}"]`)?.getAttribute("aria-current"),
    ).toBe("date");
  });

  it("sets aria-disabled on a day before min", async () => {
    await drawn(inlined({ min: parseDate("2026-10-10") }));

    expect(cellOf("Friday, October 9, 2026")?.getAttribute("aria-disabled")).toBe("true");
  });

  it("disables its date by disabled", async () => {
    await drawn(
      inlined(
        {},
        <View>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell disabled value={OCTOBER_14}>
                  <TableCellTrigger>14</TableCellTrigger>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </View>,
      ),
    );

    expect(cellOf("Wednesday, October 14, 2026")?.getAttribute("aria-disabled")).toBe("true");
  });

  it("spans one column with a month's cell", async () => {
    const { container } = await drawn(inlined());

    expect(container.querySelector<HTMLTableCellElement>('td[data-value="10"]')?.colSpan).toBe(1);
  });

  it("spans one column with a year's cell", async () => {
    const { container } = await drawn(inlined());

    expect(container.querySelector<HTMLTableCellElement>('td[data-value="2026"]')?.colSpan).toBe(1);
  });
});

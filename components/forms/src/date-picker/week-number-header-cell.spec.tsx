import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { TableHead } from "#date-picker/table-head.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { Table } from "#date-picker/table.tsx";
import { View } from "#date-picker/view.tsx";
import { WeekNumberHeaderCell } from "#date-picker/week-number-header-cell.tsx";

/**
 * Returns the header of the week numbers column inside a render.
 *
 * @param container - The render's container.
 * @returns The `th` element, or nothing without one.
 */
function weekHeader(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('thead th[data-type="week-number"]');
}

describe("WeekNumberHeaderCell", () => {
  it("renders a th named Week by default", async () => {
    const { container } = await drawn(inlined({ showWeekNumbers: true }));
    const header = weekHeader(container);

    expect([header?.tagName, header?.getAttribute("aria-label")]).toStrictEqual(["TH", "Week"]);
  });

  it("is named by label", async () => {
    const { container } = await drawn(
      inlined(
        {},
        <View>
          <Table>
            <TableHead>
              <TableRow>
                <WeekNumberHeaderCell label="KW">#</WeekNumberHeaderCell>
              </TableRow>
            </TableHead>
          </Table>
        </View>,
      ),
    );

    expect(weekHeader(container)?.getAttribute("aria-label")).toBe("KW");
  });

  it("renders the caller's text", async () => {
    const { container } = await drawn(inlined({ showWeekNumbers: true }));

    expect(weekHeader(container)?.textContent).toBe("#");
  });
});

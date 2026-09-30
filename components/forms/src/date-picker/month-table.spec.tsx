import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { framed, inlined } from "#date-picker/date-picker.fixtures.tsx";
import { MonthTable } from "#date-picker/month-table.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Returns the number of cells in each row of a grid's body.
 *
 * @param grid - The table.
 * @returns The counts in row order.
 */
function rows(grid: HTMLElement): number[] {
  return [...grid.querySelectorAll("tbody tr")].map((row) => row.children.length);
}

describe("MonthTable", () => {
  it("renders a grid named by the visible year in the month view", async () => {
    await drawn(inlined());
    await pressed(screen.getByRole("button", { name: "October 2026, Choose month" }));
    await framed();

    expect(screen.getByRole("grid", { name: "2026" })).toBeDefined();
  });

  it("renders four months to a row", async () => {
    await drawn(inlined({ defaultView: "month" }));

    expect(rows(screen.getByRole("grid", { name: "2026" }))).toStrictEqual([4, 4, 4]);
  });

  it("renders the number of columns it is given", async () => {
    await drawn(
      inlined(
        { defaultView: "month" },
        <View view="month">
          <MonthTable columns={3} />
        </View>,
      ),
    );

    expect(rows(screen.getByRole("grid", { name: "2026" }))).toStrictEqual([3, 3, 3, 3]);
  });

  it("shows each month by its short name", async () => {
    await drawn(inlined({ defaultView: "month" }));

    expect(screen.getByRole("button", { name: "January 2026" }).textContent).toBe(
      new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
        new Date(Date.UTC(2026, 0, 1)),
      ),
    );
  });

  it("moves to the days of a month on a press", async () => {
    await drawn(inlined({ defaultView: "month" }));
    await pressed(screen.getByRole("button", { name: "March 2026" }));
    await framed();

    expect(screen.getByRole("grid", { name: "March 2026" })).toBeDefined();
  });
});

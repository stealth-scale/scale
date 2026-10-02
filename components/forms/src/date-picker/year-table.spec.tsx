import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { framed, inlined } from "#date-picker/date-picker.fixtures.tsx";
import { View } from "#date-picker/view.tsx";
import { YearTable } from "#date-picker/year-table.tsx";

/**
 * Returns the number of cells in each row of a grid's body.
 *
 * @param grid - The table.
 * @returns The counts in row order.
 */
function rows(grid: HTMLElement): number[] {
  return [...grid.querySelectorAll("tbody tr")].map((row) => row.children.length);
}

/**
 * Returns the grid of the decade 2020 to 2029.
 *
 * @returns The `table` element.
 */
function decade(): HTMLElement {
  return screen.getByRole("grid", { name: "2020 – 2029" });
}

describe("YearTable", () => {
  it("renders a grid named by the visible decade in the year view", async () => {
    await drawn(inlined({ defaultView: "year" }));

    expect(decade().tagName).toBe("TABLE");
  });

  it("renders four years to a row", async () => {
    await drawn(inlined({ defaultView: "year" }));

    expect(rows(decade())).toStrictEqual([4, 4, 2]);
  });

  it("renders the number of columns it is given", async () => {
    await drawn(
      inlined(
        { defaultView: "year" },
        <View view="year">
          <YearTable columns={5} />
        </View>,
      ),
    );

    expect(rows(decade())).toStrictEqual([5, 5]);
  });

  it("moves to the months of a year on a press", async () => {
    await drawn(inlined({ defaultView: "year" }));
    await pressed(screen.getByRole("button", { name: "2028" }));
    await framed();

    expect(screen.getByRole("grid", { name: "2028" })).toBeDefined();
  });
});

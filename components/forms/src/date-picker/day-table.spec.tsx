import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Returns the rows of weeks of a grid.
 *
 * @param grid - The day table.
 * @returns The body's rows.
 */
function weeks(grid: HTMLElement): HTMLTableRowElement[] {
  return [...grid.querySelectorAll<HTMLTableRowElement>("tbody tr")];
}

/**
 * Renders an inline picker of two months, a day table per month.
 *
 * @returns The date picker.
 */
function paired(): ReturnType<typeof inlined> {
  return inlined(
    { numOfMonths: 2 },
    <View>
      <DayTable />
      <DayTable offset={1} />
    </View>,
  );
}

/**
 * Renders an inline picker with week numbers whose day table names them Kalenderwoche.
 *
 * @returns The date picker.
 */
function numbered(): ReturnType<typeof inlined> {
  return inlined(
    { showWeekNumbers: true },
    <View>
      <DayTable weekLabel="Kalenderwoche" />
    </View>,
  );
}

describe("DayTable", () => {
  it("renders a grid named by the visible month", async () => {
    await drawn(inlined());

    expect(screen.getByRole("grid", { name: "October 2026" }).tagName).toBe("TABLE");
  });

  it("renders a row per week of the month", async () => {
    await drawn(inlined());

    expect(weeks(screen.getByRole("grid", { name: "October 2026" }))).toHaveLength(5);
  });

  it("renders six rows with fixedWeeks", async () => {
    await drawn(inlined({ fixedWeeks: true }));

    expect(weeks(screen.getByRole("grid", { name: "October 2026" }))).toHaveLength(6);
  });

  it("names the first grid of two months by its own month", async () => {
    await drawn(paired());

    expect(screen.getByRole("grid", { name: "October 2026" })).toBeDefined();
  });

  it("renders the month offset after the first visible one", async () => {
    await drawn(paired());

    expect(screen.getByRole("grid", { name: "November 2026" })).toBeDefined();
  });

  it("keeps the days of the offset month inside its range", async () => {
    await drawn(paired());

    const november = screen.getByRole("grid", { name: "November 2026" });

    expect(
      within(november).getByRole("button", { name: "Monday, November 16, 2026" }).dataset[
        "outsideRange"
      ],
    ).toBeUndefined();
  });

  it("renders a week number first in each row when the root shows week numbers", async () => {
    await drawn(inlined({ showWeekNumbers: true }));

    expect(
      weeks(screen.getByRole("grid", { name: "October 2026" }))[0]?.firstElementChild?.getAttribute(
        "role",
      ),
    ).toBe("rowheader");
  });

  it("names each week's row header by weekLabel followed by the number", async () => {
    await drawn(numbered());

    const [first] = screen.getAllByRole("rowheader");

    expect(first?.getAttribute("aria-label")).toBe(`Kalenderwoche ${first?.textContent ?? ""}`);
  });

  it("names the week numbers' column by weekLabel", async () => {
    const { container } = await drawn(numbered());

    expect(
      container.querySelector('thead th[data-type="week-number"]')?.getAttribute("aria-label"),
    ).toBe("Kalenderwoche");
  });
});

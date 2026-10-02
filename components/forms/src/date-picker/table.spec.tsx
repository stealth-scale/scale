import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { day, inlined, keyed } from "#date-picker/date-picker.fixtures.tsx";
import { TableBody } from "#date-picker/table-body.tsx";
import { Table } from "#date-picker/table.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Returns the grid of October 2026.
 *
 * @returns The `table` element.
 */
function october(): HTMLElement {
  return screen.getByRole("grid", { name: "October 2026" });
}

describe("Table", () => {
  it("renders a table in the grid role named by the visible range", async () => {
    await drawn(inlined());

    expect(october().tagName).toBe("TABLE");
  });

  it("is named by aria-label over the visible range", async () => {
    await drawn(
      inlined(
        {},
        <View>
          <Table aria-label="Days of October">
            <TableBody />
          </Table>
        </View>,
      ),
    );

    expect(screen.getByRole("grid", { name: "Days of October" })).toBeDefined();
  });

  it("leaves out the machine's roledescription", async () => {
    await drawn(inlined());

    expect(october().hasAttribute("aria-roledescription")).toBe(false);
  });

  it("renders an ID without a space", async () => {
    await drawn(inlined({ id: "trip" }));

    expect(october().id).toMatch(/^datepicker:trip:table:day-\S+$/u);
  });

  it("sets data-columns to seven in the day view", async () => {
    await drawn(inlined());

    expect(october().dataset["columns"]).toBe("7");
  });

  it("sets data-columns to the columns it is given", async () => {
    await drawn(
      inlined(
        { defaultView: "month" },
        <View view="month">
          <Table columns={3}>
            <TableBody />
          </Table>
        </View>,
      ),
    );

    expect(screen.getByRole("grid", { name: "2026" }).dataset["columns"]).toBe("3");
  });

  it("sets aria-multiselectable for a range", async () => {
    await drawn(inlined({ selectionMode: "range" }));

    expect(october().getAttribute("aria-multiselectable")).toBe("true");
  });

  it("moves focus a day on ArrowRight", async () => {
    await drawn(inlined());
    await keyed(day("Wednesday, October 14, 2026"), "ArrowRight");

    expect(document.activeElement).toBe(day("Thursday, October 15, 2026"));
  });

  it("moves focus a week on ArrowDown", async () => {
    await drawn(inlined());
    await keyed(day("Wednesday, October 14, 2026"), "ArrowDown");

    expect(document.activeElement).toBe(day("Wednesday, October 21, 2026"));
  });

  it("moves focus a month on Page Down", async () => {
    await drawn(inlined());
    await keyed(day("Wednesday, October 14, 2026"), "PageDown");

    expect(document.activeElement).toBe(day("Saturday, November 14, 2026"));
  });

  it("moves focus a year on Shift+Page Down", async () => {
    await drawn(inlined());
    await keyed(day("Wednesday, October 14, 2026"), "PageDown", true);

    expect(document.activeElement).toBe(day("Thursday, October 14, 2027"));
  });
});

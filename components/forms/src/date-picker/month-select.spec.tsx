import { type ReactElement, type ReactNode } from "react";

import { parseDate } from "@internationalized/date";
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { MonthSelect } from "#date-picker/month-select.tsx";
import { type RootProps } from "#date-picker/root.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Renders an inline picker whose day view has a month select above its table.
 *
 * @param props - The props of the root.
 * @param select - The select. Defaults to one with its default name.
 * @returns The date picker.
 */
function selected(props: RootProps = {}, select: ReactNode = <MonthSelect />): ReactElement {
  return inlined(
    props,
    <View>
      {select}
      <DayTable />
    </View>,
  );
}

/**
 * Returns the month select.
 *
 * @returns The `select` element.
 */
function months(): HTMLSelectElement {
  return screen.getByRole<HTMLSelectElement>("combobox", { name: "Month" });
}

describe("MonthSelect", () => {
  it("renders a select named Month by default", async () => {
    await drawn(selected());

    expect(months().tagName).toBe("SELECT");
  });

  it("is named by label", async () => {
    await drawn(selected({}, <MonthSelect label="Billing month" />));

    expect(screen.getByRole("combobox", { name: "Billing month" })).toBeDefined();
  });

  it("lists the months by their long names", async () => {
    await drawn(selected());

    const format = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });

    expect(
      within(months())
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toStrictEqual(
      Array.from({ length: 12 }, (_, index) => format.format(new Date(Date.UTC(2026, index, 1)))),
    );
  });

  it("selects the first visible month", async () => {
    await drawn(selected());

    expect(months().value).toBe("10");
  });

  it("disables the months outside min and max", async () => {
    await drawn(selected({ max: parseDate("2026-11-30"), min: parseDate("2026-03-01") }));

    expect(
      within(months())
        .getAllByRole<HTMLOptionElement>("option")
        .map((option) => option.disabled),
    ).toStrictEqual([
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it("moves the view to the chosen month", async () => {
    await drawn(selected());

    fireEvent.change(months(), { target: { value: "3" } });
    await settled();

    expect(screen.getByRole("grid", { name: "March 2026" })).toBeDefined();
  });

  it("is disabled in a disabled picker", async () => {
    await drawn(selected({ disabled: true }));

    expect(months().disabled).toBe(true);
  });
});

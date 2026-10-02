import { type ReactElement, type ReactNode } from "react";

import { parseDate } from "@internationalized/date";
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { type RootProps } from "#date-picker/root.tsx";
import { View } from "#date-picker/view.tsx";
import { YearSelect } from "#date-picker/year-select.tsx";

/**
 * Renders an inline picker whose day view has a year select above its table.
 *
 * @param props - The props of the root.
 * @param select - The select. Defaults to one with its default name.
 * @returns The date picker.
 */
function selected(props: RootProps = {}, select: ReactNode = <YearSelect />): ReactElement {
  return inlined(
    props,
    <View>
      {select}
      <DayTable />
    </View>,
  );
}

/**
 * Returns the year select.
 *
 * @returns The `select` element.
 */
function years(): HTMLSelectElement {
  return screen.getByRole<HTMLSelectElement>("combobox", { name: "Year" });
}

describe("YearSelect", () => {
  it("renders a select named Year by default", async () => {
    await drawn(selected());

    expect(years().tagName).toBe("SELECT");
  });

  it("is named by label", async () => {
    await drawn(selected({}, <YearSelect label="Birth year" />));

    expect(screen.getByRole("combobox", { name: "Birth year" })).toBeDefined();
  });

  it("lists the years min and max allow", async () => {
    await drawn(selected({ max: parseDate("2030-12-31"), min: parseDate("2020-01-01") }));

    expect(
      within(years())
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toStrictEqual(Array.from({ length: 11 }, (_, index) => String(2020 + index)));
  });

  it("selects the first visible month's year", async () => {
    await drawn(selected());

    expect(years().value).toBe("2026");
  });

  it("moves the view to the chosen year", async () => {
    await drawn(selected());

    fireEvent.change(years(), { target: { value: "2028" } });
    await settled();

    expect(screen.getByRole("grid", { name: "October 2028" })).toBeDefined();
  });

  it("is disabled in a disabled picker", async () => {
    await drawn(selected({ disabled: true }));

    expect(years().disabled).toBe(true);
  });
});

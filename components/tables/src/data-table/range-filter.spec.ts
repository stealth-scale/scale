import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { filtered } from "#data-table/data-table.fixtures.tsx";

/**
 * Opens the amount column's filter.
 */
async function opened(name = "Filter Amount"): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name }));
  await settled();
}

/**
 * Types a figure into the field with the label given.
 */
async function typed(label: string, value: string): Promise<void> {
  const input = screen.getByRole<HTMLInputElement>("spinbutton", { name: label });

  act(() => {
    input.focus();
  });
  fireEvent.input(input, { target: { value } });
  await settled();
}

/**
 * Returns the amount column's cells in the body, in render order.
 */
function amountsShown(): string[] {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.children[2]?.textContent ?? "");
}

describe("RangeFilter", () => {
  it("keeps the rows whose figure is at least the minimum", async () => {
    await drawn(filtered());
    await opened();
    await typed("Minimum", "1000");

    expect(amountsShown()).toStrictEqual(["1100", "1000"]);
  });

  it("keeps the rows whose figure is at most the maximum", async () => {
    await drawn(filtered());
    await opened();
    await typed("Maximum", "100");

    expect(amountsShown()).toStrictEqual(["0", "100"]);
  });

  it("shows the least and the greatest faceted figures as placeholders", async () => {
    await drawn(filtered());
    await opened();

    expect(
      screen.getAllByRole<HTMLInputElement>("spinbutton").map((input) => input.placeholder),
    ).toStrictEqual(["0", "1100"]);
  });

  it("shows the filter's ends in the fields", async () => {
    await drawn(
      filtered({ initialState: { columnFilters: [{ id: "amount", value: [200, 800] }] } }),
    );
    await opened("Filter Amount, active");

    expect(
      screen.getAllByRole<HTMLInputElement>("spinbutton").map((input) => input.value),
    ).toStrictEqual(["200", "800"]);
  });

  it("removes the filter when both fields are emptied", async () => {
    await drawn(
      filtered({ initialState: { columnFilters: [{ id: "amount", value: [200, 800] }] } }),
    );
    await opened("Filter Amount, active");
    await typed("Minimum", "");
    await typed("Maximum", "");

    expect(amountsShown()).toHaveLength(12);
  });
});

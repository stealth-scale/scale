import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { COLUMNS, filtered, FILTERING } from "#data-table/data-table.fixtures.tsx";

/**
 * Opens the filter whose button has the name given.
 */
async function opened(name: string): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name }));
  await settled();
}

/**
 * Returns the number of rows in the table's body.
 */
function rowsShown(): number {
  return screen.getAllByRole("rowheader").length;
}

describe("ColumnFilter", () => {
  it("names the button by the column", async () => {
    await drawn(filtered());

    expect(
      screen.getByRole("button", { name: "Filter Account" }).getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("names the button active while the column filters", async () => {
    await drawn(filtered({ initialState: { columnFilters: [{ id: "account", value: "11" }] } }));

    expect(screen.getByRole("button", { name: "Filter Account, active" })).toBeDefined();
  });

  it("marks the button pressed while the column filters", async () => {
    await drawn(filtered({ initialState: { columnFilters: [{ id: "account", value: "11" }] } }));
    const button = screen.getByRole("button", { name: "Filter Account, active" });

    expect([button.dataset["pressed"], button.getAttribute("aria-pressed")]).toStrictEqual([
      "",
      null,
    ]);
  });

  it("marks no button pressed while its column does not filter", async () => {
    await drawn(filtered());

    expect(
      screen.getByRole("button", { name: "Filter Account" }).dataset["pressed"],
    ).toBeUndefined();
  });

  it("opens a panel titled by the filter's name", async () => {
    await drawn(filtered());
    await opened("Filter Account");

    expect(screen.getByRole("dialog", { name: "Filter Account" })).toBeDefined();
  });

  it("clears the filter from the panel's button", async () => {
    await drawn(filtered({ initialState: { columnFilters: [{ id: "account", value: "11" }] } }));
    await opened("Filter Account, active");
    await pressed(screen.getByRole("button", { name: "Clear" }));

    expect(rowsShown()).toBe(12);
  });

  it("renders no button for a column without meta.filter", async () => {
    await drawn(filtered({ columns: COLUMNS }));

    expect(screen.queryByRole("button", { name: /^Filter/u })).toBeNull();
  });

  it("renders no button for a column that cannot filter", async () => {
    await drawn(filtered({ columns: FILTERING, enableColumnFilters: false }));

    expect(screen.queryByRole("button", { name: /^Filter/u })).toBeNull();
  });

  it("writes the caller's words on the button and the panel", async () => {
    await drawn(
      filtered(
        {},
        {
          clearLabel: "Leeren",
          label: (column, active) => (active ? `${column} filtern, aktiv` : `${column} filtern`),
        },
      ),
    );
    await opened("Account filtern");

    expect([
      screen.getByRole("dialog").getAttribute("aria-labelledby") === null,
      screen.getByRole("button", { name: "Leeren" }).textContent,
    ]).toStrictEqual([false, "Leeren"]);
  });
});

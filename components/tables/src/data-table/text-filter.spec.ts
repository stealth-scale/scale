import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { filtered } from "#data-table/data-table.fixtures.tsx";

/**
 * Opens the account column's filter and returns its field.
 */
async function field(name = "Filter Account"): Promise<HTMLInputElement> {
  fireEvent.click(screen.getByRole("button", { name }));
  await settled();

  return screen.getByRole<HTMLInputElement>("textbox", { name: "Filter Account" });
}

/**
 * Returns the number of rows in the table's body.
 */
function rowsShown(): number {
  return screen.getAllByRole("rowheader").length;
}

describe("TextFilter", () => {
  it("keeps the rows whose value contains the text typed", async () => {
    await drawn(filtered());
    const input = await field();

    act(() => {
      fireEvent.change(input, { target: { value: "account 1" } });
    });

    expect(rowsShown()).toBe(3);
  });

  it("shows the column's filter value", async () => {
    await drawn(filtered({ initialState: { columnFilters: [{ id: "account", value: "11" }] } }));

    expect((await field("Filter Account, active")).value).toBe("11");
  });

  it("removes the filter when the field is emptied", async () => {
    await drawn(filtered({ initialState: { columnFilters: [{ id: "account", value: "11" }] } }));
    const input = await field("Filter Account, active");

    act(() => {
      fireEvent.change(input, { target: { value: "" } });
    });

    expect(rowsShown()).toBe(12);
  });
});

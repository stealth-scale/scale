import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { searched } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the search field.
 */
function field(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("searchbox", { name: "Search entries" });
}

/**
 * Returns the number of rows in the table's body.
 */
function rowsShown(): number {
  return screen.getAllByRole("rowheader").length;
}

describe("Search", () => {
  it("filters the rows by the text a person types", () => {
    render(searched());
    act(() => {
      fireEvent.change(field(), { target: { value: "Account 03" } });
    });

    expect(rowsShown()).toBe(1);
  });

  it("filters the rows by a value in any column", () => {
    render(searched());
    act(() => {
      fireEvent.change(field(), { target: { value: "South" } });
    });

    expect(rowsShown()).toBe(6);
  });

  it("shows the table's global filter as its value", () => {
    render(searched({ initialState: { globalFilter: "North" } }));

    expect(field().value).toBe("North");
  });

  it("renders the field inside the box with the data table's search class", () => {
    render(searched());

    expect(field().closest(".data-table__search")).not.toBeNull();
  });

  it("shows every row again after Escape clears the field", () => {
    render(searched({ initialState: { globalFilter: "North" } }));
    act(() => {
      fireEvent.keyDown(field(), { key: "Escape" });
    });

    expect(rowsShown()).toBe(12);
  });
});

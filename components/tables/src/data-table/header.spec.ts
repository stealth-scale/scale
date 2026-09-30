import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GROUPED, SELECTING, tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the column header named by its text.
 */
function headerOf(name: string): HTMLElement {
  return screen.getByRole("columnheader", { name });
}

describe("Header", () => {
  it("renders each column's header with scope col", () => {
    render(tabled());

    expect(headerOf("Region").getAttribute("scope")).toBe("col");
  });

  it("renders a sortable column's name as a button inside its header", () => {
    render(tabled());

    expect(within(headerOf("Amount")).getByRole("button", { name: "Amount" })).toBeDefined();
  });

  it("renders a column that does not sort without a button", () => {
    render(tabled());

    expect(within(headerOf("Region")).queryByRole("button")).toBeNull();
  });

  it("states no aria-sort on a column that is not sorted", () => {
    render(tabled());

    expect(headerOf("Amount").hasAttribute("aria-sort")).toBe(false);
  });

  it("states aria-sort ascending after the first press", () => {
    render(tabled());
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Amount" }));
    });

    expect(headerOf("Amount").getAttribute("aria-sort")).toBe("ascending");
  });

  it("states aria-sort descending after the second press", () => {
    render(tabled());
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Amount" }));
    });
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Amount" }));
    });

    expect(headerOf("Amount").getAttribute("aria-sort")).toBe("descending");
  });

  it("renders the indicator hidden from assistive technology with the direction none", () => {
    render(tabled({}, { sortIndicator: "↑" }));
    const indicator = within(headerOf("Amount")).getByText("↑");

    expect([indicator.getAttribute("aria-hidden"), indicator.dataset["direction"]]).toStrictEqual([
      "true",
      "none",
    ]);
  });

  it("writes the sorted direction on the indicator", () => {
    render(
      tabled({ initialState: { sorting: [{ desc: true, id: "amount" }] } }, { sortIndicator: "↑" }),
    );

    expect(within(headerOf("Amount")).getByText("↑").dataset["direction"]).toBe("descending");
  });

  it("renders the indicator before the name in a numeric column", () => {
    render(tabled({}, { sortIndicator: "↑" }));

    expect(screen.getByRole("button", { name: "Amount" }).firstChild?.textContent).toBe("↑");
  });

  it("renders the indicator after the name in a column that is not numeric", () => {
    render(tabled({}, { sortIndicator: "↑" }));

    expect(screen.getByRole("button", { name: "Account" }).lastChild?.textContent).toBe("↑");
  });

  it("renders no indicator when the table states none", () => {
    render(tabled());

    expect(screen.getByRole("button", { name: "Amount" }).children).toHaveLength(0);
  });

  it("marks the header of a numeric column data-numeric", () => {
    render(tabled());

    expect(headerOf("Amount").dataset["numeric"]).toBe("true");
  });

  it("spans a group's header over its columns with scope colgroup", () => {
    render(tabled({ columns: GROUPED }));

    expect([
      headerOf("Figures").getAttribute("colspan"),
      headerOf("Figures").getAttribute("scope"),
    ]).toStrictEqual(["2", "colgroup"]);
  });

  it("spans a column no group spans over both header rows", () => {
    render(tabled({ columns: GROUPED }));

    expect(headerOf("Account").getAttribute("rowspan")).toBe("2");
  });

  it("renders no empty header cell for a placeholder", () => {
    render(tabled({ columns: GROUPED }));

    expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toStrictEqual([
      "Account",
      "Figures",
      "Region",
      "Amount",
    ]);
  });

  it("marks a pinned column's header with its region", () => {
    render(tabled({ initialState: { columnPinning: { end: [], start: ["account"] } } }));

    expect(headerOf("Account").dataset["pinned"]).toBe("start");
  });

  it("renders no header of a hidden column", () => {
    render(tabled({ initialState: { columnVisibility: { region: false } } }));

    expect(screen.queryByRole("columnheader", { name: "Region" })).toBeNull();
  });

  it("marks the header of a column that fits its content data-fit", () => {
    render(tabled({ columns: SELECTING }));

    expect(headerOf("Select every entry").dataset["fit"]).toBe("");
  });

  it("marks a resizable column's header data-resizable", () => {
    render(tabled({ enableColumnResizing: true }));

    expect(headerOf("Amount").dataset["resizable"]).toBe("");
  });

  it("renders no separator on a group's header", () => {
    render(tabled({ columns: GROUPED, enableColumnResizing: true }));

    expect(within(headerOf("Figures")).queryByRole("separator")).toBeNull();
  });

  it("names a resizable column's header by its sort button", () => {
    render(tabled({ enableColumnResizing: true }));
    const button = within(headerOf("Amount")).getByRole("button", { name: "Amount" });

    expect(headerOf("Amount").getAttribute("aria-labelledby")).toBe(button.id);
  });

  it("names a resizable column that does not sort by the element around its name", () => {
    render(tabled({ enableColumnResizing: true }));
    const id = headerOf("Region").getAttribute("aria-labelledby") ?? "";

    expect(document.querySelector(`[id="${id}"]`)?.textContent).toBe("Region");
  });

  it("names a column that does not resize from its content", () => {
    render(tabled());

    expect(headerOf("Amount").getAttribute("aria-labelledby")).toBeNull();
  });

  it("renders a column's actions after its name", () => {
    render(tabled({}, { columnActions: () => "⋮" }));

    expect(headerOf("Account").querySelector(".data-table__heading")?.textContent).toBe("Account⋮");
  });

  it("renders a numeric column's actions before its name", () => {
    render(tabled({}, { columnActions: () => "⋮" }));

    expect(headerOf("Amount").querySelector(".data-table__heading")?.textContent).toBe("⋮Amount");
  });

  it("names a header with actions by its sort button", () => {
    render(tabled({}, { columnActions: () => "⋮" }));
    const button = within(headerOf("Amount")).getByRole("button", { name: "Amount" });

    expect(headerOf("Amount").getAttribute("aria-labelledby")).toBe(button.id);
  });

  it("renders no actions on a group's header", () => {
    render(tabled({ columns: GROUPED }, { columnActions: () => "⋮" }));

    expect(headerOf("Figures").textContent).toBe("Figures");
  });

  it("renders a header without the row while its actions are null", () => {
    render(tabled({}, { columnActions: () => null }));

    expect(headerOf("Account").querySelector(".data-table__heading")).toBeNull();
  });

  it("states aria-rowindex on each header row of a windowed table", () => {
    const { container } = render(tabled({ columns: GROUPED }, { windowed: true }));

    expect(
      [...container.querySelectorAll("thead tr")].map((row) => row.getAttribute("aria-rowindex")),
    ).toStrictEqual(["1", "2"]);
  });

  it("states no aria-rowindex on the header rows of a table that renders every row", () => {
    const { container } = render(tabled());

    expect(container.querySelector("thead tr")?.hasAttribute("aria-rowindex")).toBe(false);
  });
});

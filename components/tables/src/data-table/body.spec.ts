import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ENTRIES,
  EXPANDING,
  SELECTING,
  SPANNING,
  tabled,
} from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the body's rows.
 */
function bodyRowsOf(container: HTMLElement): HTMLTableRowElement[] {
  return [...container.querySelectorAll<HTMLTableRowElement>("tbody > tr")];
}

describe("Body", () => {
  it("renders a row per record after the header row", () => {
    render(tabled());

    expect(screen.getAllByRole("row")).toHaveLength(ENTRIES.length + 1);
  });

  it("renders a row-header column's cells as row headers", () => {
    render(tabled());

    expect(screen.getByRole("rowheader", { name: "Account 01" }).tagName).toBe("TH");
  });

  it("marks a numeric column's cells data-numeric", () => {
    render(tabled());
    const [, first] = screen.getAllByRole("row");

    expect(
      within(first as HTMLElement)
        .getAllByRole("cell")
        .at(-1)?.dataset["numeric"],
    ).toBe("true");
  });

  it("marks no other cell data-numeric", () => {
    render(tabled());
    const [, first] = screen.getAllByRole("row");

    expect(
      within(first as HTMLElement).getAllByRole("cell")[0]?.dataset["numeric"],
    ).toBeUndefined();
  });

  it("renders the empty content in one cell across every column without rows", () => {
    render(tabled({ data: [] }, { empty: "Nothing yet" }));
    const cell = screen.getByRole("cell", { name: "Nothing yet" });

    expect(cell.getAttribute("colspan")).toBe("3");
  });

  it("states aria-selected true on a selected row while a column selects rows", () => {
    render(tabled({ columns: SELECTING, initialState: { rowSelection: { "Account 02": true } } }));

    expect(screen.getByRole("row", { name: /Account 02/u }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("states aria-selected false on a row that is not selected while a column selects rows", () => {
    render(tabled({ columns: SELECTING }));

    expect(screen.getByRole("row", { name: /Account 02/u }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("marks a pinned column's cells with its region", () => {
    render(tabled({ initialState: { columnPinning: { end: [], start: ["account"] } } }));

    expect(screen.getByRole("rowheader", { name: "Account 01" }).dataset["pinned"]).toBe("start");
  });

  it("writes a pinned column's offset on its cells", () => {
    render(tabled({ initialState: { columnPinning: { end: ["region", "amount"], start: [] } } }));

    expect(
      screen.getAllByRole("cell", { name: "North" })[0]?.style.getPropertyValue("--pin-offset"),
    ).toBe("150px");
  });

  it("renders a row pinned to the top first with its region", () => {
    const { container } = render(
      tabled({ initialState: { rowPinning: { bottom: [], top: ["Account 05"] } } }),
    );
    const [first] = bodyRowsOf(container);

    expect([first?.querySelector("th")?.textContent, first?.dataset["pinned"]]).toStrictEqual([
      "Account 05",
      "top",
    ]);
  });

  it("marks the last row of a region another region follows", () => {
    const { container } = render(
      tabled({ initialState: { rowPinning: { bottom: [], top: ["Account 05"] } } }),
    );

    expect(bodyRowsOf(container)[0]?.dataset["regionEnd"]).toBe("");
  });

  it("renders a row pinned to the bottom last with its region", () => {
    const { container } = render(
      tabled({ initialState: { rowPinning: { bottom: ["Account 01"], top: [] } } }),
    );
    const last = bodyRowsOf(container).at(-1);

    expect([last?.querySelector("th")?.textContent, last?.dataset["pinned"]]).toStrictEqual([
      "Account 01",
      "bottom",
    ]);
  });

  it("marks the cells of a column that fits its content data-fit", () => {
    const { container } = render(tabled({ columns: SELECTING }));

    expect(bodyRowsOf(container)[0]?.querySelector("td")?.dataset["fit"]).toBe("");
  });

  it("renders no cell of a hidden column", () => {
    render(tabled({ initialState: { columnVisibility: { region: false } } }));

    expect(screen.queryByRole("cell", { name: "North" })).toBeNull();
  });

  it("states no region on a row that is not pinned", () => {
    const { container } = render(tabled());

    expect(bodyRowsOf(container)[0]?.dataset["pinned"]).toBeUndefined();
  });

  it("renders a cell that spans rows with its rowSpan", () => {
    render(
      tabled({ columns: SPANNING, initialState: { sorting: [{ desc: true, id: "region" }] } }),
    );

    expect(screen.getByRole("cell", { name: "South" }).getAttribute("rowspan")).toBe("6");
  });

  it("renders a cell that spans columns with its colSpan and not the cell it covers", () => {
    const { container } = render(tabled({ columns: SPANNING }));
    const [first] = bodyRowsOf(container);

    expect([first?.children.length, first?.querySelector("th")?.colSpan]).toStrictEqual([2, 2]);
  });

  it("states no aria-selected while no column selects rows", () => {
    render(tabled());

    expect(screen.getByRole("row", { name: /Account 02/u }).hasAttribute("aria-selected")).toBe(
      false,
    );
  });

  it("marks the detail row under the last expanded row of a region data-region-end", () => {
    const { container } = render(
      tabled({
        columns: EXPANDING,
        initialState: {
          expanded: { "Account 05": true },
          rowPinning: { bottom: [], top: ["Account 05"] },
        },
      }),
    );

    expect(bodyRowsOf(container)[1]?.dataset["regionEnd"]).toBe("");
  });

  it("leaves data-region-end off an expanded row whose detail row follows it", () => {
    const { container } = render(
      tabled({
        columns: EXPANDING,
        initialState: {
          expanded: { "Account 05": true },
          rowPinning: { bottom: [], top: ["Account 05"] },
        },
      }),
    );

    expect(bodyRowsOf(container)[0]?.dataset["regionEnd"]).toBeUndefined();
  });

  it("renders the windowed body with its spacer while the table is windowed", () => {
    const { container } = render(tabled({}, { windowed: true }));

    expect(container.querySelector("tbody tr[aria-hidden=true]")).not.toBeNull();
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { NESTED, type Order, ORDERS, pivoted } from "#data-table/data-table.fixtures.tsx";
import { pivot } from "#data-table/pivot.tsx";

/**
 * Returns the text of each cell of a row group's rows, row by row.
 */
function textsOf(section: Element | null): string[][] {
  return [...(section?.querySelectorAll("tr") ?? [])].map((row) =>
    [...row.children].map((cell) => cell.textContent),
  );
}

/**
 * Returns the body of a rendered pivot.
 */
function bodyOf(container: HTMLElement): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every rendered table has a body
  return container.querySelector("tbody") as HTMLElement;
}

describe("pivot", () => {
  it("renders the row headers of each row with an outer value once for its group", () => {
    const { container } = render(pivoted());

    expect(
      within(bodyOf(container))
        .getAllByRole("rowheader")
        .map((header) => header.textContent),
    ).toStrictEqual(["a", "one", "two", "b", "two"]);
  });

  it("spans an outer dimension's cell over the rows of its group", () => {
    render(pivoted());

    expect(screen.getByRole("rowheader", { name: "a" }).getAttribute("rowspan")).toBe("2");
  });

  it("keeps scope row on a spanning row header", () => {
    render(pivoted());

    expect(screen.getByRole("rowheader", { name: "a" }).getAttribute("scope")).toBe("row");
  });

  it("marks an outer cell whose group ends the body data-span-end", () => {
    render(
      pivoted({}, [
        { amount: 1, group: "a", part: "one", period: "x" },
        { amount: 2, group: "b", part: "one", period: "x" },
        { amount: 3, group: "b", part: "two", period: "x" },
      ]),
    );

    expect(screen.getByRole("rowheader", { name: "b" }).dataset["spanEnd"]).toBe("");
  });

  it("spans no inner value across two adjacent groups", () => {
    render(pivoted());

    expect(
      screen
        .getAllByRole("rowheader", { name: "two" })
        .map((header) => header.hasAttribute("rowspan")),
    ).toStrictEqual([false, false]);
  });

  it("renders a column per value of the column dimension in the order it first appears", () => {
    render(pivoted());

    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toStrictEqual([
      "group",
      "part",
      "x",
      "y",
      "Total",
    ]);
  });

  it("renders each cell's figure and each row's total", () => {
    const { container } = render(pivoted());

    expect(textsOf(bodyOf(container))).toStrictEqual([
      ["a", "one", "4", "No value", "4"],
      ["two", "No value", "8", "8"],
      ["b", "two", "6", "No value", "6"],
    ]);
  });

  it("writes a measured cell's figure as a data element with its value", () => {
    const { container } = render(pivoted({}, ORDERS));

    expect(bodyOf(container).querySelectorAll("data")[1]?.getAttribute("value")).toBe("8910");
  });

  it("renders the words of an empty cell for assistive technology only", () => {
    const { container } = render(pivoted());

    expect(bodyOf(container).querySelector(".data-table__visually-hidden")?.textContent).toBe(
      "No value",
    );
  });

  it("renders the caller's words in an empty cell", () => {
    const { container } = render(pivoted({ missingLabel: "No orders" }));

    expect(bodyOf(container).querySelector(".data-table__visually-hidden")?.textContent).toBe(
      "No orders",
    );
  });

  it("aggregates a row's total from its records", () => {
    const { container } = render(pivoted({ aggregate: "average" }, ORDERS));

    expect(textsOf(bodyOf(container))[0]?.at(-1)).toBe("89.2");
  });

  it("renders the totals of the columns in the footer row", () => {
    const { container } = render(pivoted());

    expect(textsOf(container.querySelector("tfoot"))).toStrictEqual([
      ["Total", "", "10", "8", "18"],
    ]);
  });

  it("names the footer row in a row header", () => {
    render(pivoted());

    expect(screen.getByRole("rowheader", { name: "Total" }).closest("tfoot")).not.toBeNull();
  });

  it("renders the caller's words for the totals", () => {
    render(pivoted({ totalLabel: "Sum" }));

    expect(screen.getAllByText("Sum").map((cell) => cell.tagName)).toStrictEqual(["TH", "TH"]);
  });

  it("renders no totals column while totals is false", () => {
    render(pivoted({ totals: false }));

    expect(screen.queryByRole("columnheader", { name: "Total" })).toBeNull();
  });

  it("renders no footer row while totals is false", () => {
    const { container } = render(pivoted({ totals: false }));

    expect(container.querySelector("tfoot")).toBeNull();
  });

  it("renders no footer row for records that leave no row", () => {
    const { container } = render(pivoted({}, []));

    expect(container.querySelector("tfoot")).toBeNull();
  });

  it("renders a dimension's header from headers", () => {
    render(pivoted({ headers: { group: "Group" } }));

    expect(screen.getByRole("columnheader", { name: "Group" }).tagName).toBe("TH");
  });

  it("renders no sort button in a header", () => {
    render(pivoted());

    expect(screen.queryAllByRole("button")).toStrictEqual([]);
  });

  it("writes figures with the options of format", () => {
    const { container } = render(pivoted({ format: { minimumFractionDigits: 2 } }));

    expect(textsOf(bodyOf(container))[0]?.[2]).toBe("4.00");
  });

  it("counts the records of a cell with count", () => {
    const { container } = render(pivoted({ aggregate: "count" }, ORDERS));

    expect(textsOf(bodyOf(container))[0]?.[3]).toBe("99");
  });

  it("applies a caller's aggregate function to a cell's records", () => {
    const { container } = render(
      pivoted({ aggregate: (records: readonly Order[]) => records.length * 2 }, ORDERS),
    );

    expect(textsOf(bodyOf(container))[0]?.[3]).toBe("198");
  });

  it("returns the dimensions' fields as their columns' ids", () => {
    const { columns } = pivot(NESTED, { column: "period", rows: ["group", "part"] });

    expect(columns.map((column) => column.id)).toStrictEqual([
      "group",
      "part",
      "period:x",
      "period:y",
      "total",
    ]);
  });

  it("returns a row's path in JSON as its id", () => {
    const { data, getRowId } = pivot(NESTED, { column: "period", rows: ["group", "part"] });

    expect(data.map((row, index) => getRowId(row, index))).toStrictEqual([
      '["a","one"]',
      '["a","two"]',
      '["b","two"]',
    ]);
  });

  it("returns no accessibility violation for a pivot", async () => {
    await expect(accessibilityViolations(() => pivoted())).resolves.toStrictEqual([]);
  });
});

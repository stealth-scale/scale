import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { type Column } from "#table/columns.ts";
import { Simple, type SimpleProps } from "#table/simple.tsx";

/**
 * Describes one record every case draws.
 */
interface Account {
  /**
   * What the account came to.
   */
  amount: string;

  /**
   * The account's name.
   */
  name: string;
}

/**
 * The records every case draws.
 */
const ACCOUNTS: readonly Account[] = [
  { amount: "4,120.00", name: "Bridge Ledger" },
  { amount: "880.40", name: "Halden & Co" },
];

/**
 * The columns every case draws, unless it states its own.
 */
const COLUMNS: ReadonlyArray<Column<Account>> = [
  { key: "name", label: "Account", rowHeader: true },
  { key: "amount", label: "Amount", numeric: true },
];

/**
 * Draws a whole table, less whatever a case states itself.
 *
 * @param props - Whatever the case sets on the table.
 * @returns The table.
 */
function whole(props: Partial<SimpleProps<Account>> = {}): ReactElement {
  return (
    <Simple<Account>
      aria-label="Payouts"
      columns={COLUMNS}
      rows={ACCOUNTS}
      rowToKey={(row) => row.name}
      {...props}
    />
  );
}

describe("Simple", () => {
  it("draws one row per record", () => {
    render(whole());

    expect(screen.getAllByRole("row")).toHaveLength(ACCOUNTS.length + 1);
  });

  it("draws one name per column", () => {
    render(whole());

    expect(screen.getAllByRole("columnheader")).toHaveLength(COLUMNS.length);
  });

  it("reads a value off the key its column is named under", () => {
    render(whole());

    expect(screen.getByText("4,120.00")).toBeTruthy();
  });

  it("reads a value through the reader a column states", () => {
    render(
      whole({
        columns: [{ cell: (row): string => `${row.name}!`, key: "name", label: "Account" }],
      }),
    );

    expect(screen.getByText("Bridge Ledger!")).toBeTruthy();
  });

  it("draws the naming column's cells as the rows' own headers", () => {
    render(whole());

    expect(screen.getAllByRole("rowheader")).toHaveLength(ACCOUNTS.length);
  });

  it("marks a column of figures once for the whole column", () => {
    const { container } = render(whole());

    expect(container.querySelectorAll("[data-numeric]")).toHaveLength(ACCOUNTS.length + 1);
  });

  it("names the table from its caption", () => {
    render(whole({ caption: "Payouts this quarter" }));

    expect(screen.getByRole("table", { name: "Payouts this quarter" })).toBeTruthy();
  });

  it("draws no caption where a caller writes none", () => {
    const { container } = render(whole());

    expect(container.querySelector("caption")).toBeNull();
  });

  it("declares the columns only where one states a width", () => {
    const { container } = render(whole());

    expect(container.querySelector("colgroup")).toBeNull();
  });

  it("states a width once for the table rather than on every row", () => {
    const { container } = render(
      whole({
        columns: [
          { key: "name", label: "Account", width: "10rem" },
          { key: "amount", label: "Amount" },
        ],
      }),
    );

    expect(container.querySelector<HTMLElement>("col")?.style.inlineSize).toBe("10rem");
  });

  it("leaves a column with no width of its own to the layout", () => {
    const { container } = render(
      whole({
        columns: [
          { key: "name", label: "Account", width: "10rem" },
          { key: "amount", label: "Amount" },
        ],
      }),
    );

    expect([...container.querySelectorAll<HTMLElement>("col")][1]?.style.inlineSize).toBe("");
  });

  it("draws nothing in a cell whose record holds nothing under the key", () => {
    const { container } = render(
      whole({ columns: [{ key: "missing", label: "Missing" }], rows: [ACCOUNTS[0] as Account] }),
    );

    expect(slotElement(container, "table", "cell").textContent).toBe("");
  });

  it("draws a table of no columns at all without falling over", () => {
    render(whole({ columns: [] }));

    expect(screen.getByRole("table")).toBeTruthy();
  });

  it("draws a control that sorts a column a caller says sorts", () => {
    render(
      whole({
        columns: [{ key: "name", label: "Account", sortLabel: "Sort" }],
        onSort: vi.fn<(key: string) => void>(),
      }),
    );

    expect(screen.getByRole("button", { name: "Sort" })).toBeTruthy();
  });

  it("draws no control where nothing hears the press", () => {
    render(whole({ columns: [{ key: "name", label: "Account", sortLabel: "Sort" }] }));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("reports which column a reader pressed to sort by", async () => {
    const sorted = vi.fn<(key: string) => void>();

    render(
      whole({ columns: [{ key: "name", label: "Account", sortLabel: "Sort" }], onSort: sorted }),
    );
    await pressed(screen.getByRole("button", { name: "Sort" }));

    expect(sorted).toHaveBeenCalledWith("name");
  });

  it("says which way a sorted column runs", () => {
    render(whole({ columns: [{ key: "name", label: "Account", sorted: "ascending" }] }));

    expect(screen.getByRole("columnheader").getAttribute("aria-sort")).toBe("ascending");
  });

  it("draws no last row where a caller sums nothing", () => {
    const { container } = render(whole());

    expect(container.querySelector("tfoot")).toBeNull();
  });

  it("closes on a total read per column", () => {
    render(
      whole({
        columns: [
          { key: "name", label: "Account", rowHeader: true },
          { key: "state", label: "State" },
          { key: "amount", label: "Amount", numeric: true },
        ],
        total: (column) => (column.key === "name" ? "Total" : "5,000.40"),
      }),
    );

    expect(screen.getByText("Total")).toBeTruthy();
    expect(screen.getAllByText("5,000.40")).toHaveLength(2);
  });

  it("says which row and which column every cell belongs to", () => {
    const { container } = render(whole());

    expect(container.querySelectorAll('[data-row="Bridge Ledger"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-column="amount"]')).toHaveLength(3);
  });

  it("marks the names at the head of each column too, which is what a crosshair reads", () => {
    const { container } = render(whole());

    expect(container.querySelector('th[data-column="amount"]')?.textContent).toBe("Amount");
  });

  it("holds back the table's own props from the box it scrolls inside", () => {
    const { container } = render(whole({ groupBy: () => "held", rowToKey: (row) => row.name }));
    const box = slotElement(container, "table", "scroller");

    expect(box.hasAttribute("rowToKey")).toBe(false);
    expect(box.hasAttribute("groupBy")).toBe(false);
  });

  it("draws one section per heading where a caller says how to gather the records", () => {
    const { container } = render(
      whole({ groupBy: (row) => (row.name === "Bridge Ledger" ? "kept" : "owed") }),
    );

    expect(container.querySelectorAll("tbody")).toHaveLength(2);
  });

  it("heads each section with a name spanning the table", () => {
    render(whole({ groupBy: () => "Payments" }));

    expect(screen.getByRole("rowheader", { name: "Payments" }).getAttribute("colspan")).toBe("2");
  });

  it("names a heading with the words a caller reads off its key", () => {
    render(whole({ groupBy: () => "owed", groupLabel: (under) => `Group ${under}` }));

    expect(screen.getByRole("rowheader", { name: "Group owed" })).toBeTruthy();
  });

  it("says what a caller gives it to say about a table holding nothing", () => {
    render(whole({ empty: "No services to show", rows: [] }));

    expect(screen.getByText("No services to show")).toBeTruthy();
  });

  it("draws the words across the table's whole width", () => {
    render(whole({ empty: "No services to show", rows: [] }));

    expect(screen.getByRole("cell", { name: "No services to show" }).getAttribute("colspan")).toBe(
      "2",
    );
  });

  it("says nothing about an empty table while it holds records", () => {
    render(whole({ empty: "No services to show" }));

    expect(screen.queryByText("No services to show")).toBeNull();
  });

  it("takes every variant the scroller takes", () => {
    const { container } = render(whole({ variant: "surface" }));

    expect([...slotElement(container, "table", "scroller").classList].join(" ")).toContain(
      "surface",
    );
  });
});

describe("Simple, with a name spanning columns", () => {
  /**
   * The columns a spanning case draws.
   */
  const SPANNED: ReadonlyArray<Column<Account>> = [
    { key: "name", label: "Account", rowHeader: true },
    {
      columns: [
        { cell: (row) => row.amount, key: "jan", label: "Jan", numeric: true },
        { cell: (row) => row.amount, key: "feb", label: "Feb", numeric: true },
      ],
      label: "Q1",
    },
  ];

  it("draws a row of names per level of naming", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getAllByRole("row")).toHaveLength(ACCOUNTS.length + 2);
  });

  it("spans the name across the columns beneath it", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getByRole("columnheader", { name: "Q1" }).getAttribute("colspan")).toBe("2");
  });

  it("scopes a spanning name to the columns rather than to the cells under it", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getByRole("columnheader", { name: "Q1" }).getAttribute("scope")).toBe("colgroup");
  });

  it("takes a name with nothing under it down to the line the deepest name closes on", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getByRole("columnheader", { name: "Account" }).getAttribute("rowspan")).toBe("2");
  });
});

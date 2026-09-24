import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { type Column } from "#table/columns.ts";
import { Simple, type SimpleProps } from "#table/simple.tsx";

/**
 * Describes one record of the fixture.
 */
interface Account {
  /**
   * Amount of the account.
   */
  amount: string;

  /**
   * Name of the account.
   */
  name: string;
}

/**
 * Records of the fixture.
 */
const ACCOUNTS: readonly Account[] = [
  { amount: "4,120.00", name: "Bridge Ledger" },
  { amount: "880.40", name: "Halden & Co" },
];

/**
 * Columns of the fixture: a row-header column and a numeric column.
 */
const COLUMNS: ReadonlyArray<Column<Account>> = [
  { key: "name", label: "Account", rowHeader: true },
  { key: "amount", label: "Amount", numeric: true },
];

/**
 * Renders a table named Payouts over the fixture, with the props the case sets.
 *
 * @param props - The props the case sets.
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
  it("renders one body row per record", () => {
    render(whole());

    expect(screen.getAllByRole("row")).toHaveLength(ACCOUNTS.length + 1);
  });

  it("renders one column header per leaf", () => {
    render(whole());

    expect(screen.getAllByRole("columnheader")).toHaveLength(COLUMNS.length);
  });

  it("reads a value from the property named by the key", () => {
    render(whole());

    expect(screen.getByText("4,120.00")).toBeTruthy();
  });

  it("reads a value through the column's cell function", () => {
    render(
      whole({
        columns: [{ cell: (row): string => `${row.name}!`, key: "name", label: "Account" }],
      }),
    );

    expect(screen.getByText("Bridge Ledger!")).toBeTruthy();
  });

  it("renders a rowHeader column's cells as row headers", () => {
    render(whole());

    expect(screen.getAllByRole("rowheader")).toHaveLength(ACCOUNTS.length);
  });

  it("sets data-numeric on a numeric column's header and cells", () => {
    const { container } = render(whole());

    expect(container.querySelectorAll("[data-numeric]")).toHaveLength(ACCOUNTS.length + 1);
  });

  it("names the table from its caption", () => {
    render(whole({ caption: "Payouts this quarter" }));

    expect(screen.getByRole("table", { name: "Payouts this quarter" })).toBeTruthy();
  });

  it("renders no caption without the prop", () => {
    const { container } = render(whole());

    expect(container.querySelector("caption")).toBeNull();
  });

  it("renders no colgroup while no column states a width", () => {
    const { container } = render(whole());

    expect(container.querySelector("colgroup")).toBeNull();
  });

  it("sets a column's width on its col", () => {
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

  it("sets no width on the col of a column without one", () => {
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

  it("renders an empty cell for a missing property", () => {
    const { container } = render(
      whole({ columns: [{ key: "missing", label: "Missing" }], rows: [ACCOUNTS[0] as Account] }),
    );

    expect(slotElement(container, "table", "cell").textContent).toBe("");
  });

  it("renders a table with no columns", () => {
    render(whole({ columns: [] }));

    expect(screen.getByRole("table")).toBeTruthy();
  });

  it("renders a sort button for a column with sortLabel and onSort", () => {
    render(
      whole({
        columns: [{ key: "name", label: "Account", sortLabel: "Sort" }],
        onSort: vi.fn<(key: string) => void>(),
      }),
    );

    expect(screen.getByRole("button", { name: "Sort" })).toBeTruthy();
  });

  it("renders no sort button without onSort", () => {
    render(whole({ columns: [{ key: "name", label: "Account", sortLabel: "Sort" }] }));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("calls onSort with the column key on a press", async () => {
    const sorted = vi.fn<(key: string) => void>();

    render(
      whole({ columns: [{ key: "name", label: "Account", sortLabel: "Sort" }], onSort: sorted }),
    );
    await pressed(screen.getByRole("button", { name: "Sort" }));

    expect(sorted).toHaveBeenCalledWith("name");
  });

  it("sets aria-sort on a sorted column's header", () => {
    render(whole({ columns: [{ key: "name", label: "Account", sorted: "ascending" }] }));

    expect(screen.getByRole("columnheader").getAttribute("aria-sort")).toBe("ascending");
  });

  it("renders no footer without total", () => {
    const { container } = render(whole());

    expect(container.querySelector("tfoot")).toBeNull();
  });

  it("renders the total row from total per leaf column", () => {
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

  it("sets data-row on every cell of a record", () => {
    const { container } = render(whole());

    expect(container.querySelectorAll('[data-row="Bridge Ledger"]')).toHaveLength(3);
  });

  it("sets data-column on every cell of a column", () => {
    const { container } = render(whole());

    expect(container.querySelectorAll('[data-column="amount"]')).toHaveLength(3);
  });

  it("sets data-column on a column header", () => {
    const { container } = render(whole());

    expect(container.querySelector('th[data-column="amount"]')?.textContent).toBe("Amount");
  });

  it("passes no table prop to the scroller", () => {
    const { container } = render(whole({ groupBy: () => "held", rowToKey: (row) => row.name }));
    const box = slotElement(container, "table", "scroller");

    expect(box.hasAttribute("rowToKey")).toBe(false);
    expect(box.hasAttribute("groupBy")).toBe(false);
  });

  it("renders one tbody per groupBy key", () => {
    const { container } = render(
      whole({ groupBy: (row) => (row.name === "Bridge Ledger" ? "kept" : "owed") }),
    );

    expect(container.querySelectorAll("tbody")).toHaveLength(2);
  });

  it("heads each section with a full-width row header", () => {
    render(whole({ groupBy: () => "Payments" }));

    expect(screen.getByRole("rowheader", { name: "Payments" }).getAttribute("colspan")).toBe("2");
  });

  it("renders the section heading groupLabel returns", () => {
    render(whole({ groupBy: () => "owed", groupLabel: (under) => `Group ${under}` }));

    expect(screen.getByRole("rowheader", { name: "Group owed" })).toBeTruthy();
  });

  it("renders the empty content without rows", () => {
    render(whole({ empty: "No services to show", rows: [] }));

    expect(screen.getByText("No services to show")).toBeTruthy();
  });

  it("spans the empty cell across every column", () => {
    render(whole({ empty: "No services to show", rows: [] }));

    expect(screen.getByRole("cell", { name: "No services to show" }).getAttribute("colspan")).toBe(
      "2",
    );
  });

  it("renders no empty content while there are rows", () => {
    render(whole({ empty: "No services to show" }));

    expect(screen.queryByText("No services to show")).toBeNull();
  });

  it("applies the scroller's variant class", () => {
    const { container } = render(whole({ variant: "surface" }));

    expect([...slotElement(container, "table", "scroller").classList].join(" ")).toContain(
      "surface",
    );
  });
});

describe("Simple with a branch column", () => {
  /**
   * A row-header column beside a branch over two numeric columns.
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

  it("renders one header row per level", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getAllByRole("row")).toHaveLength(ACCOUNTS.length + 2);
  });

  it("spans the branch header across its leaves", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getByRole("columnheader", { name: "Q1" }).getAttribute("colspan")).toBe("2");
  });

  it("sets scope colgroup on the branch header", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getByRole("columnheader", { name: "Q1" }).getAttribute("scope")).toBe("colgroup");
  });

  it("spans a leaf header down every header row", () => {
    render(whole({ columns: SPANNED }));

    expect(screen.getByRole("columnheader", { name: "Account" }).getAttribute("rowspan")).toBe("2");
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createColumnHelper } from "#data-table/column-helper.ts";
import { BRANCHED, type Entry, SUMMED, tabled } from "#data-table/data-table.fixtures.tsx";
import { type DataTableOptions } from "#data-table/use-data-table.ts";

const column = createColumnHelper<Entry>();

const TEMPLATED = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("region", { header: "Region" }),
  column.accessor("amount", {
    aggregatedCell: ({ getValue }) => `Σ ${String(getValue())}`,
    aggregationFn: "sum",
    header: "Amount",
    meta: { numeric: true },
  }),
]);

/**
 * Returns the texts of the cells of the row with the record's id given.
 */
function textsOf(options: Partial<DataTableOptions<Entry>>, id: string): string[] {
  const { container } = render(tabled(options));
  const row = container.querySelector(`tr[data-key="record:${id}"]`);

  return [...(row?.children ?? [])].map((cell) => cell.textContent);
}

/**
 * Returns the element of the selector given inside the row with the record's id given.
 */
function partOf(options: Partial<DataTableOptions<Entry>>, id: string, selector: string): Element {
  const { container } = render(tabled(options));

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the part it reads
  return container.querySelector(`tr[data-key="record:${id}"] ${selector}`) as Element;
}

describe("cells", () => {
  it("renders the value and the number of records in a group row's grouped cell", () => {
    const grouped = { columns: SUMMED, initialState: { grouping: ["region"] } };

    expect(textsOf(grouped, "region:North")[0]).toBe("North(6)");
  });

  it("renders the sum of a group's records in its aggregated cell", () => {
    const grouped = { columns: SUMMED, initialState: { grouping: ["region"] } };

    expect(textsOf(grouped, "region:South")[2]).toBe("3600");
  });

  it("leaves a group row's cell empty for a column without an aggregation", () => {
    const grouped = { columns: SUMMED, initialState: { grouping: ["region"] } };

    expect(textsOf(grouped, "region:North")[1]).toBe("");
  });

  it("leaves a record's cell of the grouped column empty", () => {
    const grouped = {
      columns: SUMMED,
      initialState: { expanded: { "region:North": true }, grouping: ["region"] },
    };

    expect(textsOf(grouped, "Account 01")).toStrictEqual(["", "Account 01", "0"]);
  });

  it("renders the column's aggregatedCell in a group row", () => {
    const grouped = { columns: TEMPLATED, initialState: { grouping: ["region"] } };

    expect(textsOf(grouped, "region:North")[2]).toBe("Σ 3000");
  });

  it("indents a cell of the tree column by its row's depth", () => {
    const open = { ...BRANCHED, initialState: { expanded: { North: true, Oslo: true } } };
    const branch = partOf(open, "Oslo East", ".data-table__branch");

    expect(branch.getAttribute("style")).toBe("--row-depth: 2;");
  });

  it("indents by the depth below the grouping in a grouped table of sub-rows", () => {
    const open: Partial<DataTableOptions<Entry>> = {
      ...BRANCHED,
      initialState: { expanded: true, grouping: ["region"] },
    };
    const branch = partOf(open, "Oslo", ".data-table__branch");

    expect(branch.getAttribute("style")).toBe("--row-depth: 1;");
  });

  it("renders an empty box in place of a toggle in a row that opens nothing", () => {
    const open = { ...BRANCHED, initialState: { expanded: { North: true } } };

    expect(partOf(open, "Bergen", ".data-table__toggle").childElementCount).toBe(0);
  });

  it("renders a toggle in the tree cell of a row with sub-rows", () => {
    expect(partOf(BRANCHED, "South", ".data-table__toggle > button")).toBeInstanceOf(
      HTMLButtonElement,
    );
  });

  it("renders a cell of another column without a toggle", () => {
    expect(textsOf(BRANCHED, "Central")).toStrictEqual(["Central", "Central", "300"]);
  });
});

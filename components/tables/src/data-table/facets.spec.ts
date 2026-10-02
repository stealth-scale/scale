import { describe, expect, it } from "vitest";

import { ENTRIES, FILTERING, tableOf } from "#data-table/data-table.fixtures.tsx";
import { endsOf, extentOf, facetsOf, filterOf } from "#data-table/facets.ts";
import { type DataTableApi, type DataTableOptions } from "#data-table/use-data-table.ts";

/**
 * Returns a table over the filtering columns with the options given.
 */
function filteringOf(
  options: Partial<DataTableOptions<(typeof ENTRIES)[number]>> = {},
): DataTableApi {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the readers read records as RowData
  return tableOf({ columns: FILTERING, ...options }) as unknown as DataTableApi;
}

/**
 * Returns the faceted values of a column of a table with the options given.
 */
function facetsIn(
  id: string,
  options: Partial<DataTableOptions<(typeof ENTRIES)[number]>> = {},
): ReturnType<typeof facetsOf> {
  const table = filteringOf(options);
  const column = table.getColumn(id);

  return column === undefined ? [] : facetsOf(table, column);
}

describe("facets", () => {
  it("returns a column's filter value", () => {
    const table = filteringOf({
      initialState: { columnFilters: [{ id: "account", value: "11" }] },
    });

    expect(filterOf(table, "account")).toBe("11");
  });

  it("returns undefined for a column that does not filter", () => {
    expect(filterOf(filteringOf(), "account")).toBeUndefined();
  });

  it("counts each value of a column in the order of the values' words", () => {
    expect(facetsIn("region")).toStrictEqual([
      ["North", 6],
      ["South", 6],
    ]);
  });

  it("orders figures by their value", () => {
    expect(facetsIn("amount").slice(0, 3)).toStrictEqual([
      [0, 1],
      [100, 1],
      [200, 1],
    ]);
  });

  it("leaves out an empty value", () => {
    const data = [...ENTRIES, { account: "Account 13", amount: 0, region: "" }];

    expect(facetsIn("region", { data })).toHaveLength(2);
  });

  it("counts a chosen value no row has any more as zero", () => {
    const facets = facetsIn("region", {
      initialState: {
        columnFilters: [
          { id: "account", value: "Account 02" },
          { id: "region", value: ["North"] },
        ],
      },
    });

    expect(facets).toStrictEqual([
      ["North", 0],
      ["South", 1],
    ]);
  });

  it("returns the least and the greatest figures of a column", () => {
    const table = filteringOf();
    const amount = table.getColumn("amount");

    expect(amount === undefined ? undefined : extentOf(table, amount)).toStrictEqual([0, 1100]);
  });

  it.each([
    { value: undefined, want: [undefined, undefined] },
    { value: [200, 800], want: [200, 800] },
    { value: [undefined, 800], want: [undefined, 800] },
    { value: ["200", 800], want: [undefined, 800] },
    { value: [200, "800"], want: [200, undefined] },
  ])("returns $want as the ends of $value", ({ value, want }) => {
    expect(endsOf(value)).toStrictEqual(want);
  });
});

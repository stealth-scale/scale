import { isValidElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { createColumnHelper } from "#data-table/column-helper.ts";
import { type Entry, FOOTED, rebuiltTable, tableOf } from "#data-table/data-table.fixtures.tsx";
import { Rendered, type RenderedProps } from "#data-table/rendered.ts";
import {
  aggregatedContentOf,
  cellContentOf,
  footerContentOf,
  headerContentOf,
  renderedOf,
} from "#data-table/templates.tsx";

/**
 * Returns the table a template receives in the context of the rendered content.
 */
function receivedOf(content: unknown): unknown {
  return isValidElement<RenderedProps<{ readonly table: unknown }>>(content)
    ? content.props.context.table
    : undefined;
}

describe("templates", () => {
  it("returns a string template as written", () => {
    expect(renderedOf("Amount", {})).toBe("Amount");
  });

  it("returns null for no template", () => {
    expect(renderedOf(undefined, {})).toBeNull();
  });

  it("renders a function template through Rendered", () => {
    const content = renderedOf(() => "Amount", {});

    expect(isValidElement(content) && content.type === Rendered).toBe(true);
  });

  it("passes a cell's template the table the part renders with", () => {
    const table = tableOf();
    const cells = table.getRowModel().rows.flatMap((row) => row.getVisibleCells());

    expect(cells.map((cell) => receivedOf(cellContentOf(table, cell)))[0]).toBe(table);
  });

  it("passes a header's template the table the part renders with", () => {
    const column = createColumnHelper<Entry>();
    const table = tableOf({
      columns: column.columns([column.accessor("amount", { header: () => "Σ" })]),
    });

    expect(
      table.getFlatHeaders().map((header) => receivedOf(headerContentOf(table, header))),
    ).toStrictEqual([table]);
  });

  it("renders a group row's cell through the column's aggregatedCell", () => {
    const column = createColumnHelper<Entry>();
    const table = tableOf({
      columns: column.columns([
        column.accessor("region", { header: "Region" }),
        column.accessor("amount", { aggregatedCell: "Σ", aggregationFn: "sum", cell: "each" }),
      ]),
      initialState: { grouping: ["region"] },
    });
    const cell = table.getRow("region:North").getAllCellsByColumnId()["amount"];

    expect(cell === undefined ? undefined : aggregatedContentOf(table, cell)).toBe("Σ");
  });

  it("returns a footer's string template as written", () => {
    const table = tableOf({ columns: FOOTED });

    expect(table.getFlatHeaders().map((header) => footerContentOf(table, header))).toStrictEqual([
      "Total",
      null,
      "6,600",
    ]);
  });

  it("keeps a checkbox's element when the columns are written anew on every render", async () => {
    await drawn(rebuiltTable());
    const before = screen.getByRole("checkbox", { name: "Select Account 03" });

    await pressed(before);

    expect(screen.getByRole("checkbox", { name: "Select Account 03" })).toBe(before);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Entry, tabled } from "#data-table/data-table.fixtures.tsx";
import { expandColumn } from "#data-table/expand-column.tsx";

const COLUMN = expandColumn<Entry>({
  detail: (entry) => entry.region,
  label: (entry) => entry.account,
});

describe("expandColumn", () => {
  it("sets the id expand", () => {
    expect(COLUMN.id).toBe("expand");
  });

  it("sets the column's size to 72 pixels", () => {
    expect(COLUMN.size).toBe(72);
  });

  it("bounds the column's size at 72 pixels whatever the table's default column states", () => {
    expect([COLUMN.minSize, COLUMN.maxSize]).toStrictEqual([72, 72]);
  });

  it("fits the column to its content", () => {
    expect(COLUMN.meta?.fit).toBe(true);
  });

  it("names the column Details unless stated", () => {
    expect(COLUMN.meta?.label).toBe("Details");
  });

  it("names the column by header when stated", () => {
    const column = expandColumn<Entry>({
      detail: (entry) => entry.region,
      header: "More",
      label: (entry) => entry.account,
    });

    expect(column.meta?.label).toBe("More");
  });

  it.each([
    "enableCellSelection",
    "enableColumnFilter",
    "enableGlobalFilter",
    "enableGrouping",
    "enableHiding",
    "enableResizing",
    "enableSorting",
  ] as const)("turns %s off", (option) => {
    expect(COLUMN[option]).toBe(false);
  });

  it("renders its header only for assistive technology", () => {
    render(tabled({ columns: [COLUMN] }));

    expect(
      screen
        .getByRole("columnheader", { name: "Details" })
        .querySelector(".data-table__visually-hidden")?.textContent,
    ).toBe("Details");
  });
});

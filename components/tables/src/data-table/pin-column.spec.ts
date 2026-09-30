import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Entry, tabled } from "#data-table/data-table.fixtures.tsx";
import { pinColumn } from "#data-table/pin-column.tsx";

const COLUMN = pinColumn<Entry>({ label: (entry) => entry.account });

describe("pinColumn", () => {
  it("sets the id pin", () => {
    expect(COLUMN.id).toBe("pin");
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

  it("names the column Pin unless stated", () => {
    expect(COLUMN.meta?.label).toBe("Pin");
  });

  it("names the column by header when stated", () => {
    expect(pinColumn<Entry>({ header: "Keep", label: (entry) => entry.account }).meta?.label).toBe(
      "Keep",
    );
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
        .getByRole("columnheader", { name: "Pin" })
        .querySelector(".data-table__visually-hidden")?.textContent,
    ).toBe("Pin");
  });
});

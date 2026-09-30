import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tabled } from "#data-table/data-table.fixtures.tsx";

describe("Widths", () => {
  it("renders no column declarations for a table laid out by its content", () => {
    const { container } = render(tabled());

    expect(container.querySelector("colgroup")).toBeNull();
  });

  it("declares each column's size in the columns' visual order", () => {
    const { container } = render(
      tabled({
        enableColumnResizing: true,
        initialState: {
          columnPinning: { end: ["account"], start: [] },
          columnSizing: { amount: 90 },
        },
      }),
    );

    expect(
      [...container.querySelectorAll<HTMLElement>("col")].map((col) =>
        col.style.getPropertyValue("--column-size"),
      ),
    ).toStrictEqual(["150px", "90px", "150px"]);
  });

  it("declares no column that is hidden", () => {
    const { container } = render(
      tabled({ enableColumnResizing: true, initialState: { columnVisibility: { region: false } } }),
    );

    expect(container.querySelectorAll("col")).toHaveLength(2);
  });

  it("adds the data table's column class to each declaration", () => {
    const { container } = render(tabled({ enableColumnResizing: true }));

    expect(container.querySelector("col")?.className).toContain("data-table__column");
  });

  it("declares every column's width in a windowed table", () => {
    const { container } = render(tabled({}, { windowed: true }));

    expect(
      [...container.querySelectorAll<HTMLElement>("col")].map((column) =>
        column.style.getPropertyValue("--column-size"),
      ),
    ).toStrictEqual(["150px", "150px", "150px"]);
  });
});

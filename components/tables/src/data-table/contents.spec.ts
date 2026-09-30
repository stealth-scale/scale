import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BRANCHED, FOOTED, tabled } from "#data-table/data-table.fixtures.tsx";

describe("Contents", () => {
  it("renders the caption with the id the scroll region points at", () => {
    const { container } = render(tabled());

    expect(container.querySelector("caption")?.id).toBe(
      container.querySelector(".table__viewport")?.getAttribute("aria-labelledby"),
    );
  });

  it("states the number of rows of a windowed table in aria-rowcount", () => {
    render(tabled({}, { windowed: true }));

    expect(screen.getByRole("table").getAttribute("aria-rowcount")).toBe("13");
  });

  it("states no aria-rowcount on a table that renders every row", () => {
    render(tabled());

    expect(screen.getByRole("table").hasAttribute("aria-rowcount")).toBe(false);
  });

  it("states the footer row's index as the last row of a windowed table", () => {
    const { container } = render(tabled({ columns: FOOTED }, { windowed: true }));

    expect(container.querySelector("tfoot tr")?.getAttribute("aria-rowindex")).toBe("14");
  });

  it("declares the column widths of a windowed table", () => {
    const { container } = render(tabled({}, { windowed: true }));

    expect(container.querySelectorAll("colgroup col")).toHaveLength(3);
  });

  it("renders a grid table in the grid role", () => {
    render(tabled({}, { grid: true }));

    expect(screen.getByRole("grid").tagName).toBe("TABLE");
  });

  it("renders a grid table with levels in the treegrid role", () => {
    render(tabled(BRANCHED, { grid: true }));

    expect([screen.getByRole("treegrid").tagName, screen.queryByRole("grid")]).toStrictEqual([
      "TABLE",
      null,
    ]);
  });

  it("gives the cells of a grid table with levels no marks", () => {
    const { container } = render(tabled(BRANCHED, { grid: true }));

    expect(container.querySelector("[data-column]")).toBeNull();
  });
});

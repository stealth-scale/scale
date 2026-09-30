import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  BRANCHED,
  EXPANDING,
  SELECTING,
  SUMMED,
  tabled,
  tableOf,
} from "#data-table/data-table.fixtures.tsx";
import { shapeOf } from "#data-table/rowed.tsx";
import { untyped } from "#data-table/windowed.fixtures.ts";

describe("rowed", () => {
  it("returns the detail of a column that renders details", () => {
    expect(shapeOf(untyped(tableOf({ columns: EXPANDING })), "p").detail).toBeTypeOf("function");
  });

  it("returns no detail while no column renders details", () => {
    expect(shapeOf(untyped(tableOf()), "p").detail).toBeUndefined();
  });

  it("returns true for selects while a column selects rows", () => {
    expect(shapeOf(untyped(tableOf({ columns: SELECTING })), "p").selects).toBe(true);
  });

  it("counts the visible columns as the width", () => {
    const table = tableOf({ initialState: { columnVisibility: { region: false } } });

    expect(shapeOf(untyped(table), "p").width).toBe(2);
  });

  it("returns the prefix given", () => {
    expect(shapeOf(untyped(tableOf()), "p").prefix).toBe("p");
  });

  it("returns no levels for a table without levels", () => {
    expect(shapeOf(untyped(tableOf()), "p").levels).toBeUndefined();
  });

  it("returns the English words as the levels of a table of sub-rows unless given", () => {
    expect(shapeOf(untyped(tableOf(BRANCHED)), "p").levels?.branches.expandLabel).toBe("Expand");
  });

  it("renders a group row's grouped cell as its row header", () => {
    const { container } = render(
      tabled({ columns: SUMMED, initialState: { grouping: ["region"] } }),
    );

    expect(container.querySelector('tr[data-key="record:region:North"] th')?.textContent).toBe(
      "North(6)",
    );
  });

  it("renders the row-header column's cell of a group row as a data cell", () => {
    const { container } = render(
      tabled({ columns: SUMMED, initialState: { grouping: ["region"] } }),
    );

    expect(container.querySelector('tr[data-key="record:region:North"] td')?.textContent).toBe("");
  });

  it("states the level under its record on a detail row in a table with levels", () => {
    const { container } = render(
      tabled({
        ...BRANCHED,
        columns: EXPANDING,
        initialState: { expanded: { Central: true } },
      }),
    );

    expect(container.querySelector('tr[id$="-detail-Central"]')?.getAttribute("aria-level")).toBe(
      "2",
    );
  });

  it("states no level on a detail row in a table without levels", () => {
    const { container } = render(
      tabled({ columns: EXPANDING, initialState: { expanded: { "Account 02": true } } }),
    );

    expect(
      container.querySelector('tr[id$="-detail-Account%2002"]')?.hasAttribute("aria-level"),
    ).toBe(false);
  });

  it("renders the loading words under a row that waits for its sub-rows", () => {
    const { container } = render(
      tabled(
        { ...BRANCHED, getRowCanExpand: () => true, initialState: { expanded: { Central: true } } },
        { loadingLabel: "Fetching branches" },
      ),
    );

    expect(container.querySelector('tr[id$="-detail-Central"]')?.textContent).toBe(
      "Fetching branches",
    );
  });
});

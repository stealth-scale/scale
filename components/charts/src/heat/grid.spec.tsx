import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ColumnHeading, Corner, Frame, Grid, litOf, RowHeading } from "#heat/grid.ts";
import { LIT } from "#heat/recipe.ts";

/**
 * Renders a grid with a corner, a column heading and a row heading.
 */
function headed(): void {
  render(
    <Frame>
      <Grid aria-label="Orders">
        <thead>
          <tr>
            <Corner />
            <ColumnHeading>10:00</ColumnHeading>
          </tr>
        </thead>
        <tbody>
          <tr>
            <RowHeading>Tue</RowHeading>
            <td>508</td>
          </tr>
        </tbody>
      </Grid>
    </Frame>,
  );
}

describe("grid", () => {
  it("renders the table in the grid role", () => {
    headed();

    expect(screen.getByRole("grid", { name: "Orders" }).tagName).toBe("TABLE");
  });

  it("scopes a column heading to its column", () => {
    headed();

    expect(screen.getByRole("columnheader", { name: "10:00" }).getAttribute("scope")).toBe("col");
  });

  it("scopes a row heading to its row", () => {
    headed();

    expect(screen.getByRole("rowheader", { name: "Tue" }).getAttribute("scope")).toBe("row");
  });

  it("renders the corner as a cell styled as a heading", () => {
    headed();

    expect(screen.getByRole("columnheader").previousElementSibling?.className).toContain(
      "heat__column-heading",
    );
  });

  it("returns the lit attribute for a heading of the shown cell", () => {
    expect(litOf(true)).toStrictEqual({ [LIT]: "" });
  });

  it("returns no attribute for any other heading", () => {
    expect(litOf(false)).toStrictEqual({});
  });
});

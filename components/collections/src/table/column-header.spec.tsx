import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnHeader } from "#table/column-header.ts";
import { recipe } from "#table/recipe.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, rowed } from "#table/table.fixtures.tsx";

describe("ColumnHeader", () => {
  it("draws a th inside the table it needs above it", () => {
    const { container } = render(rowed(<ColumnHeader>Client</ColumnHeader>));

    expect(slotElement(container, "table", "columnHeader").tagName).toBe("TH");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "columnHeader",
      }),
    ).toStrictEqual([]);
  });

  it("names the cells under it rather than leaving a screen reader to guess", () => {
    const { container } = render(rowed(<ColumnHeader>Client</ColumnHeader>));

    expect(slotElement(container, "table", "columnHeader").getAttribute("scope")).toBe("col");
  });

  it("is read as a column header", () => {
    render(rowed(<ColumnHeader>Client</ColumnHeader>));

    expect(screen.getByRole("columnheader", { name: "Client" })).toBeDefined();
  });

  it("says which way a column a reader sorted by runs", () => {
    render(rowed(<ColumnHeader aria-sort="ascending">Total</ColumnHeader>));

    expect(screen.getByRole("columnheader", { name: "Total" }).getAttribute("aria-sort")).toBe(
      "ascending",
    );
  });
});

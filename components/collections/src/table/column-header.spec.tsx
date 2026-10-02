import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnHeader } from "#table/column-header.ts";
import { recipe } from "#table/recipe.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, rowed } from "#table/table.fixtures.tsx";

describe("ColumnHeader", () => {
  it("renders a th", () => {
    const { container } = render(rowed(<ColumnHeader>Client</ColumnHeader>));

    expect(slotElement(container, "table", "columnHeader").tagName).toBe("TH");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "columnHeader",
      }),
    ).toStrictEqual([]);
  });

  it("sets scope to col", () => {
    const { container } = render(rowed(<ColumnHeader>Client</ColumnHeader>));

    expect(slotElement(container, "table", "columnHeader").getAttribute("scope")).toBe("col");
  });

  it("renders the element with the columnheader role", () => {
    render(rowed(<ColumnHeader>Client</ColumnHeader>));

    expect(screen.getByRole("columnheader", { name: "Client" })).toBeDefined();
  });

  it("passes aria-sort to the element", () => {
    render(rowed(<ColumnHeader aria-sort="ascending">Total</ColumnHeader>));

    expect(screen.getByRole("columnheader", { name: "Total" }).getAttribute("aria-sort")).toBe(
      "ascending",
    );
  });
});

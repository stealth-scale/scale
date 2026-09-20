import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#table/recipe.ts";
import { RowHeader } from "#table/row-header.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, rowed } from "#table/table.fixtures.tsx";

describe("RowHeader", () => {
  it("draws a th inside the table it needs above it", () => {
    const { container } = render(rowed(<RowHeader>Fathom</RowHeader>));

    expect(slotElement(container, "table", "rowHeader").tagName).toBe("TH");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "rowHeader",
      }),
    ).toStrictEqual([]);
  });

  it("names the cells across it rather than the ones under it", () => {
    const { container } = render(rowed(<RowHeader>Fathom</RowHeader>));

    expect(slotElement(container, "table", "rowHeader").getAttribute("scope")).toBe("row");
  });

  it("is read as a row header", () => {
    render(rowed(<RowHeader>Fathom</RowHeader>));

    expect(screen.getByRole("rowheader", { name: "Fathom" })).toBeDefined();
  });
});

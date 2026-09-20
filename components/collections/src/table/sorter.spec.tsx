import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnHeader } from "#table/column-header.ts";
import { recipe } from "#table/recipe.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { Sorter } from "#table/sorter.ts";
import { composed, rowed } from "#table/table.fixtures.tsx";

describe("Sorter", () => {
  it("draws a button inside the header it sorts", () => {
    const { container } = render(
      rowed(
        <ColumnHeader>
          <Sorter>Total</Sorter>
        </ColumnHeader>,
      ),
    );

    expect(slotElement(container, "table", "sorter").tagName).toBe("BUTTON");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "sorter",
      }),
    ).toStrictEqual([]);
  });

  it("is reachable and named by its own words", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Total" })).toBeDefined();
  });

  it("reports the press, leaving the sort to the page", () => {
    const heard = vi.fn<() => void>();

    render(
      rowed(
        <ColumnHeader>
          <Sorter onClick={heard}>Total</Sorter>
        </ColumnHeader>,
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Total" }));

    expect(heard).toHaveBeenCalledOnce();
  });

  it("draws a button rather than a submit", () => {
    const { container } = render(
      rowed(
        <ColumnHeader>
          <Sorter>Total</Sorter>
        </ColumnHeader>,
      ),
    );

    expect(slotElement(container, "table", "sorter").getAttribute("type")).toBe("button");
  });
});

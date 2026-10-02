import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnHeader } from "#table/column-header.ts";
import { recipe } from "#table/recipe.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { Sorter } from "#table/sorter.ts";
import { composed, rowed } from "#table/table.fixtures.tsx";

describe("Sorter", () => {
  it("renders a button", () => {
    const { container } = render(
      rowed(
        <ColumnHeader>
          <Sorter>Total</Sorter>
        </ColumnHeader>,
      ),
    );

    expect(slotElement(container, "table", "sorter").tagName).toBe("BUTTON");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "sorter",
      }),
    ).toStrictEqual([]);
  });

  it("names the button from its text", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Total" })).toBeDefined();
  });

  it("calls onClick on a press", () => {
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

  it("sets type button", () => {
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

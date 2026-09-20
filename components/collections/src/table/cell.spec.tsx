import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Cell } from "#table/cell.ts";
import { recipe } from "#table/recipe.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, rowed } from "#table/table.fixtures.tsx";

describe("Cell", () => {
  it("draws a td inside the table it needs above it", () => {
    const { container } = render(rowed(<Cell>1,024.00</Cell>));

    expect(slotElement(container, "table", "cell").tagName).toBe("TD");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "cell",
      }),
    ).toStrictEqual([]);
  });

  it("is read as a cell", () => {
    render(rowed(<Cell>1,024.00</Cell>));

    expect(screen.getByRole("cell", { name: "1,024.00" })).toBeDefined();
  });

  it("carries the attribute that sets a column of figures against its end", () => {
    const { container } = render(rowed(<Cell data-numeric>1,024.00</Cell>));

    expect(slotElement(container, "table", "cell").dataset["numeric"]).toBe("true");
  });
});

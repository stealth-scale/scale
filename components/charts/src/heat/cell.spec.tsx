import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Cell, type CellProps } from "#heat/cell.tsx";
import { rowed } from "#heat/heat.fixtures.tsx";
import { FILL } from "#heat/recipe.ts";

/**
 * Returns a measured cell's props, the walk giving it the key "a" and the tab stop.
 */
function propsOf(changes: Partial<CellProps> = {}): CellProps {
  return {
    fill: "var(--colors-series-1)",
    lead: undefined,
    printed: false,
    text: "405",
    walked: { "data-cell": "a", tabIndex: 0 },
    ...changes,
  };
}

/**
 * Renders one cell in a grid and returns its element.
 */
function rendered(changes: Partial<CellProps> = {}): HTMLElement {
  const { container } = render(rowed(<Cell {...propsOf(changes)} />));

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the row renders the one cell
  return container.querySelector("td") as HTMLElement;
}

describe("Cell", () => {
  it("fills a cell with a value through its custom property", () => {
    expect(rendered().style.getPropertyValue(FILL)).toBe("var(--colors-series-1)");
  });

  it("states a cell with a value as measured", () => {
    expect(rendered().dataset["state"]).toBe("measured");
  });

  it("leaves a cell without a value unfilled", () => {
    expect(rendered({ fill: undefined }).style.getPropertyValue(FILL)).toBe("");
  });

  it("states a cell without a value as missing", () => {
    expect(rendered({ fill: undefined }).dataset["state"]).toBe("missing");
  });

  it("hides the words from sight while the cell does not print them", () => {
    expect(rendered().querySelector("span")?.className).toContain("heat__name");
  });

  it("prints the words while the cell prints them", () => {
    expect(rendered({ printed: true }).querySelector("span")?.className).toContain("heat__value");
  });

  it("never prints the words of a cell without a value", () => {
    expect(rendered({ fill: undefined, printed: true }).querySelector("span")?.className).toContain(
      "heat__name",
    );
  });

  it("reads its words", () => {
    render(rowed(<Cell {...propsOf({ text: "Not counted" })} />));

    expect(screen.getByText("Not counted")).toBeDefined();
  });

  it("reads the words that name the reading before its value", () => {
    expect(rendered({ lead: "Tuesday, " }).textContent).toBe("Tuesday, 405");
  });

  it("hides the words that name the reading from sight while it prints its value", () => {
    expect(
      rendered({ lead: "Tuesday, ", printed: true }).querySelector(".heat__name")?.textContent,
    ).toBe("Tuesday, ");
  });

  it("renders the cell's class", () => {
    expect(rendered().className).toContain("heat__cell");
  });

  it("takes the walk's key", () => {
    expect(rendered().dataset["cell"]).toBe("a");
  });

  it("takes the walk's tab stop", () => {
    expect(rendered({ walked: { "data-cell": "a", tabIndex: -1 } }).tabIndex).toBe(-1);
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeClasses } from "@stealthscale/testing-theme";

import { recipe } from "#tile/recipe.ts";
import { Tile } from "#tile/tile.ts";

describe("Tile", () => {
  it("conforms as a div element", () => {
    expect(violations(Tile, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Tile, { props: { children: "Draft" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Tile {...props}>Draft</Tile>).container),
    ).toStrictEqual([]);
  });

  it("holds what it is given", () => {
    const { container } = render(<Tile>Draft</Tile>);

    expect(container.textContent).toBe("Draft");
    expect(recipeClasses(container, "tile")).toContain("tile");
  });
});

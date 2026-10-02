import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#kbd/recipe.ts";
import { Root } from "#kbd/root.ts";

describe("Root", () => {
  it("passes the component conformance checks as a kbd element", () => {
    expect(violations(Root, { as: true, children: true, element: "KBD" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Root, { props: { children: "Esc" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props}>Esc</Root>).container),
    ).toStrictEqual([]);
  });

  it("renders a span when as is span", () => {
    const { container } = render(<Root as="span">Esc</Root>);

    expect(recipeElement(container, "kbd").tagName).toBe("SPAN");
  });
});

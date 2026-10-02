import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#text/recipe.ts";
import { Text } from "#text/text.ts";

describe("Text", () => {
  it("passes the component conformance checks as a p element", () => {
    expect(violations(Text, { as: true, children: true, element: "P" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Text, { props: { children: "Words" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Text {...props}>Words</Text>).container),
    ).toStrictEqual([]);
  });

  it("renders a span when as is span", () => {
    const { container } = render(<Text as="span">Words</Text>);

    expect(recipeElement(container, "text").tagName).toBe("SPAN");
  });
});

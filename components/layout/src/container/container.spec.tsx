import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Container } from "#container/container.ts";
import { recipe } from "#container/recipe.ts";

describe("Container", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Container, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with a paragraph", async () => {
    await expect(
      accessibilityViolations(Container, { props: { children: <p>One</p> } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Container {...props}>One</Container>).container),
    ).toStrictEqual([]);
  });

  it("renders a main element when as is main", () => {
    const { container } = render(<Container as="main">One</Container>);

    expect(recipeElement(container, "container").tagName).toBe("MAIN");
  });
});

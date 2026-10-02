import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Heading } from "#heading/heading.ts";
import { recipe } from "#heading/recipe.ts";

describe("Heading", () => {
  it("passes the component conformance checks as an h2 element", () => {
    expect(violations(Heading, { as: true, children: true, element: "H2" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Heading, { props: { children: "Title" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Heading {...props}>Title</Heading>).container),
    ).toStrictEqual([]);
  });

  it("renders an h1 when as is h1", () => {
    const { container } = render(<Heading as="h1">Title</Heading>);

    expect(recipeElement(container, "heading").tagName).toBe("H1");
  });
});

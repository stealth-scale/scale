import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { recipe } from "#span/recipe.ts";
import { Span } from "#span/span.ts";

describe("Span", () => {
  it("passes the component conformance checks as a span element", () => {
    expect(violations(Span, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Span, { props: { children: "a run" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Span {...props}>a run</Span>).container),
    ).toStrictEqual([]);
  });

  it("applies only the span class when no variant is set", () => {
    const { container } = render(<Span>a run</Span>);

    expect([...recipeElement(container, "span").classList]).toStrictEqual(["span"]);
  });

  it("applies the truncate class when truncate is true", () => {
    const { container } = render(<Span truncate>a long run</Span>);

    expect([...recipeElement(container, "span").classList]).toContain(
      variantClass("span", "truncate", "true"),
    );
  });

  it("renders an i element when as is i", () => {
    const { container } = render(<Span as="i">a run</Span>);

    expect(recipeElement(container, "span").tagName).toBe("I");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#strong/recipe.ts";
import { Strong } from "#strong/strong.ts";

describe("Strong", () => {
  it("passes the component conformance checks as a strong element", () => {
    expect(violations(Strong, { as: true, children: true, element: "STRONG" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Strong, { props: { children: "important" } }),
    ).resolves.toStrictEqual([]);
  });

  it("exposes the strong role", () => {
    render(<Strong>important</Strong>);

    expect(screen.getByRole("strong").textContent).toBe("important");
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Strong {...props}>important</Strong>).container),
    ).toStrictEqual([]);
  });

  it("renders a b element when as is b", () => {
    const { container } = render(<Strong as="b">Widget</Strong>);

    expect(recipeElement(container, "strong").tagName).toBe("B");
  });
});

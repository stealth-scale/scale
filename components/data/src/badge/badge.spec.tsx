import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Badge } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

describe("Badge", () => {
  it("conforms as a span element", () => {
    expect(violations(Badge, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when it holds text", async () => {
    await expect(
      accessibilityViolations(Badge, { props: { children: "New" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Badge {...props}>New</Badge>).container),
    ).toStrictEqual([]);
  });

  it("sets no role", () => {
    const { container } = render(<Badge>New</Badge>);

    expect(recipeElement(container, "badge").hasAttribute("role")).toBe(false);
  });

  it("forwards aria-label to the span", () => {
    const { container } = render(<Badge aria-label="3 failed">3</Badge>);

    expect(recipeElement(container, "badge").getAttribute("aria-label")).toBe("3 failed");
  });

  it("renders the element passed as as", () => {
    const { container } = render(<Badge as="output">3</Badge>);

    expect(recipeElement(container, "badge").tagName).toBe("OUTPUT");
  });
});

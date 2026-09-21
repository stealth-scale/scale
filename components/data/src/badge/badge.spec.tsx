import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Badge } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

describe("Badge", () => {
  it("returns no conformance violation for its SPAN root", () => {
    expect(violations(Badge, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when it renders a text child", async () => {
    await expect(
      accessibilityViolations(Badge, { props: { children: "New" } }),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<Badge {...props}>New</Badge>).container),
    ).toStrictEqual([]);
  });

  it("renders no role attribute of its own", () => {
    const { container } = render(<Badge>New</Badge>);

    expect(recipeElement(container, "badge").hasAttribute("role")).toBe(false);
  });

  it("forwards an aria-label the caller passes", () => {
    const { container } = render(<Badge aria-label="3 failed">3</Badge>);

    expect(recipeElement(container, "badge").getAttribute("aria-label")).toBe("3 failed");
  });

  it("renders an OUTPUT element when as is set to output", () => {
    const { container } = render(<Badge as="output">3</Badge>);

    expect(recipeElement(container, "badge").tagName).toBe("OUTPUT");
  });
});

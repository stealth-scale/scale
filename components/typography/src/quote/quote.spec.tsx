import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Quote } from "#quote/quote.ts";
import { recipe } from "#quote/recipe.ts";

describe("Quote", () => {
  it("passes the component conformance checks as a q element", () => {
    expect(violations(Quote, { as: true, children: true, element: "Q" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Quote, { props: { children: "quoted" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Quote {...props}>quoted</Quote>).container),
    ).toStrictEqual([]);
  });

  it("renders the cite attribute passed as cite", () => {
    const { container } = render(<Quote cite="https://example.org/paper">quoted</Quote>);

    expect(recipeElement(container, "quote").getAttribute("cite")).toBe(
      "https://example.org/paper",
    );
  });

  it("renders a span when as is span", () => {
    const { container } = render(<Quote as="span">quoted</Quote>);

    expect(recipeElement(container, "quote").tagName).toBe("SPAN");
  });
});

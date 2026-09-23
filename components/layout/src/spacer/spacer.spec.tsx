import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#spacer/recipe.ts";
import { Spacer } from "#spacer/spacer.ts";

describe("Spacer", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Spacer, { as: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(Spacer)).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Spacer {...props} />).container),
    ).toStrictEqual([]);
  });

  it("sets aria-hidden to true", () => {
    const { container } = render(<Spacer />);

    expect(recipeElement(container, "spacer").getAttribute("aria-hidden")).toBe("true");
  });
});

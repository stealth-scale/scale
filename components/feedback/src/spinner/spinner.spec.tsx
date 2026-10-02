import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#spinner/recipe.ts";
import { Spinner } from "#spinner/spinner.ts";

describe("Spinner", () => {
  it("returns no conformance violation for its SPAN root", () => {
    expect(violations(Spinner, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when it renders on its own", async () => {
    await expect(accessibilityViolations(Spinner)).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<Spinner {...props} />).container),
    ).toStrictEqual([]);
  });

  it("sets no role attribute when the caller passes none", () => {
    const { container } = render(<Spinner />);

    expect(recipeElement(container, "spinner").getAttribute("role")).toBeNull();
  });

  it("renders no text content when the caller passes no children", () => {
    const { container } = render(<Spinner />);

    expect(recipeElement(container, "spinner").textContent).toBe("");
  });

  it("renders a DIV element when as is set to div", () => {
    const { container } = render(<Spinner as="div" />);

    expect(recipeElement(container, "spinner").tagName).toBe("DIV");
  });
});

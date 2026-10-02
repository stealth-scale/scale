import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Input } from "#input/input.ts";
import { recipe } from "#input/recipe.ts";

describe("Input", () => {
  it("renders a conforming input element", () => {
    expect(violations(Input, { as: true, element: "INPUT" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when named with aria-label", async () => {
    await expect(
      accessibilityViolations(Input, { props: { "aria-label": "Search invoices" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Input {...props} />).container),
    ).toStrictEqual([]);
  });

  it("passes type through to the element", () => {
    const { container } = render(<Input type="email" />);

    expect(recipeElement(container, "input").getAttribute("type")).toBe("email");
  });

  it("sets disabled on the element when disabled is passed", () => {
    const { container } = render(<Input disabled />);

    expect(recipeElement(container, "input").hasAttribute("disabled")).toBe(true);
  });

  it("passes aria-invalid through to the element", () => {
    const { container } = render(<Input aria-invalid />);

    expect(recipeElement(container, "input").getAttribute("aria-invalid")).toBe("true");
  });

  it("renders the element that as names", () => {
    const { container } = render(<Input as="textarea" />);

    expect(recipeElement(container, "input").tagName).toBe("TEXTAREA");
  });
});

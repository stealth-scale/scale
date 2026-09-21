import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Button } from "#button/button.ts";
import { recipe } from "#button/recipe.ts";

describe("Button", () => {
  it("returns no conformance violation for its BUTTON root", () => {
    expect(violations(Button, { as: true, children: true, element: "BUTTON" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when it renders a text label", async () => {
    await expect(
      accessibilityViolations(Button, { props: { children: "Save" } }),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<Button {...props}>Save</Button>).container),
    ).toStrictEqual([]);
  });

  it("sets type to button when the caller passes none", () => {
    const { container } = render(<Button>Save</Button>);

    expect(recipeElement(container, "button").getAttribute("type")).toBe("button");
  });

  it("renders type submit when the caller sets it", () => {
    const { container } = render(<Button type="submit">Save</Button>);

    expect(recipeElement(container, "button").getAttribute("type")).toBe("submit");
  });

  it("marks the element disabled when the disabled prop is set", () => {
    const { container } = render(<Button disabled>Save</Button>);

    expect(recipeElement(container, "button").hasAttribute("disabled")).toBe(true);
  });

  it("renders an A element when as is set to a", () => {
    const { container } = render(<Button as="a">Save</Button>);

    expect(recipeElement(container, "button").tagName).toBe("A");
  });
});

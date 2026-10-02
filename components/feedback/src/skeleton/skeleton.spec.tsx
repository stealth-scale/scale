import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton/recipe.ts";
import { Skeleton } from "#skeleton/skeleton.ts";

describe("Skeleton", () => {
  it("conforms as a div element", () => {
    expect(violations(Skeleton, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(Skeleton)).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Skeleton {...props} />).container),
    ).toStrictEqual([]);
  });

  it("sets no role", () => {
    const { container } = render(<Skeleton />);

    expect(recipeElement(container, "skeleton").hasAttribute("role")).toBe(false);
  });

  it("renders its children inside the element", () => {
    const { container } = render(
      <Skeleton>
        <p>Words that have not arrived</p>
      </Skeleton>,
    );

    expect(recipeElement(container, "skeleton").textContent).toBe("Words that have not arrived");
  });

  it("renders the element passed as as", () => {
    const { container } = render(<Skeleton as="span" />);

    expect(recipeElement(container, "skeleton").tagName).toBe("SPAN");
  });
});

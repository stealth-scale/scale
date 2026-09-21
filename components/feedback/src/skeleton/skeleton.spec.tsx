import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton/recipe.ts";
import { Skeleton } from "#skeleton/skeleton.ts";

describe("Skeleton", () => {
  it("meets the component contract as a div element", () => {
    expect(violations(Skeleton, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("reports no axe violation on its own", async () => {
    await expect(accessibilityViolations(Skeleton)).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<Skeleton {...props} />).container),
    ).toStrictEqual([]);
  });

  it("sets no role attribute on the element it renders", () => {
    const { container } = render(<Skeleton />);

    expect(recipeElement(container, "skeleton").hasAttribute("role")).toBe(false);
  });

  it("keeps the content it wraps inside its own element", () => {
    const { container } = render(
      <Skeleton>
        <p>Words that have not arrived</p>
      </Skeleton>,
    );

    expect(recipeElement(container, "skeleton").textContent).toBe("Words that have not arrived");
  });

  it("renders the element named by as instead of a div", () => {
    const { container } = render(<Skeleton as="span" />);

    expect(recipeElement(container, "skeleton").tagName).toBe("SPAN");
  });
});

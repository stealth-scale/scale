import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#visually-hidden/recipe.ts";
import { VisuallyHidden } from "#visually-hidden/visually-hidden.ts";

describe("VisuallyHidden", () => {
  it("satisfies the component contract with span as its default element", () => {
    expect(violations(VisuallyHidden, { as: true, children: true, element: "SPAN" })).toStrictEqual(
      [],
    );
  });

  it("reports no axe violation when it renders text", async () => {
    await expect(
      accessibilityViolations(VisuallyHidden, { props: { children: "Loading" } }),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(
        recipe,
        (props) => render(<VisuallyHidden {...props}>Loading</VisuallyHidden>).container,
      ),
    ).toStrictEqual([]);
  });

  it("leaves aria-hidden unset on the element holding its children", () => {
    const { getByText } = render(<VisuallyHidden>Loading</VisuallyHidden>);

    expect(getByText("Loading").getAttribute("aria-hidden")).toBeNull();
  });

  it("renders the recipe element as h2 when as is h2", () => {
    const { container } = render(<VisuallyHidden as="h2">Sections</VisuallyHidden>);

    expect(recipeElement(container, "visually-hidden").tagName).toBe("H2");
  });
});

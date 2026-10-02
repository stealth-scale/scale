import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#visually-hidden/recipe.ts";
import { VisuallyHidden } from "#visually-hidden/visually-hidden.ts";

describe("VisuallyHidden", () => {
  it("passes the component conformance checks as a span element", () => {
    expect(violations(VisuallyHidden, { as: true, children: true, element: "SPAN" })).toStrictEqual(
      [],
    );
  });

  it("returns no accessibility violation with text", async () => {
    await expect(
      accessibilityViolations(VisuallyHidden, { props: { children: "Loading" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(
        recipe,
        (props) => render(<VisuallyHidden {...props}>Loading</VisuallyHidden>).container,
      ),
    ).toStrictEqual([]);
  });

  it("leaves aria-hidden unset on the element with the text", () => {
    const { getByText } = render(<VisuallyHidden>Loading</VisuallyHidden>);

    expect(getByText("Loading").getAttribute("aria-hidden")).toBeNull();
  });

  it("renders an h2 when as is h2", () => {
    const { container } = render(<VisuallyHidden as="h2">Sections</VisuallyHidden>);

    expect(recipeElement(container, "visually-hidden").tagName).toBe("H2");
  });
});

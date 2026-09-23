import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Frame } from "#frame/frame.ts";
import { recipe } from "#frame/recipe.ts";

describe("Frame", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Frame, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with a named picture", async () => {
    await expect(
      accessibilityViolations(Frame, {
        props: { children: <img alt="A hillside" src="/hill.avif" /> },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Frame {...props} />).container),
    ).toStrictEqual([]);
  });

  it("renders a figure when as is figure", () => {
    const { container } = render(<Frame as="figure" />);

    expect(recipeElement(container, "frame").tagName).toBe("FIGURE");
  });
});

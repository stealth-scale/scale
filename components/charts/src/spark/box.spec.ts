import { type ComponentProps, createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Box } from "#spark/box.ts";
import { recipe } from "#spark/recipe.ts";

describe("Box", () => {
  it("returns no conformance violation for its DIV root", () => {
    expect(violations(Box, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("renders a DIV bound to the recipe", () => {
    const { container } = render(createElement(Box));

    expect(recipeElement(container, "spark").tagName).toBe("DIV");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(
        recipe,
        (props: ComponentProps<typeof Box>) => render(createElement(Box, props)).container,
      ),
    ).toStrictEqual([]);
  });
});

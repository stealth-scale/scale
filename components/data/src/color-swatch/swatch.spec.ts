import { type ComponentProps, createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#color-swatch/recipe.ts";
import { Swatch } from "#color-swatch/swatch.ts";

describe("Swatch", () => {
  it("returns no conformance violation for its SPAN root", () => {
    expect(violations(Swatch, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("renders a SPAN bound to the recipe", () => {
    const { container } = render(createElement(Swatch));

    expect(recipeElement(container, "color-swatch").tagName).toBe("SPAN");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(
        recipe,
        (props: ComponentProps<typeof Swatch>) => render(createElement(Swatch, props)).container,
      ),
    ).toStrictEqual([]);
  });
});

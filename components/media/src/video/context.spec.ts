import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeElement } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#video/context.ts";

describe("context", () => {
  it("applies the recipe's class to a bound element", () => {
    const Drawn = withContext("video");
    const { container } = render(createElement(Drawn));

    expect(recipeElement(container, "video").className).toContain("video");
  });

  it("passes a provider's variants to a bound element below it", () => {
    const Drawn = withContext("video");
    const { container } = render(
      createElement(PropsProvider, { value: { ratio: "square" } }, createElement(Drawn)),
    );

    expect(recipeElement(container, "video").className).toContain("video--square");
  });
});

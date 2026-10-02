import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#heat/context.ts";

describe("context", () => {
  it("applies the frame class to the element the provider binds", () => {
    const Probe = withProvider("div", "frame");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "heat")).toContain("heat__frame");
  });

  it("applies the middle size's class to a cell without a size", () => {
    const Frame = withProvider("div", "frame");
    const Part = withContext("span", "cell");
    const { container } = render(createElement(Frame, null, createElement(Part)));

    expect(container.querySelector("span")?.className).toContain(
      variantClass("heat__cell", "size", "md"),
    );
  });

  it("applies a part's class to an element bound under the provider", () => {
    const Frame = withProvider("div", "frame");
    const Part = withContext("span", "cell");
    const { container } = render(createElement(Frame, null, createElement(Part)));

    expect(container.querySelector("span")?.className).toContain("heat__cell");
  });
});

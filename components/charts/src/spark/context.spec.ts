import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext } from "#spark/context.ts";

describe("context", () => {
  it("applies the recipe class to an element bound with withContext", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "spark")).toContain("spark");
  });

  it("applies the middle size's class when the caller passes no size", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "spark")).toContain(variantClass("spark", "size", "md"));
  });
});

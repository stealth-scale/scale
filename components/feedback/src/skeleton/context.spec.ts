import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#skeleton/context.ts";

describe("context", () => {
  it("applies the recipe class to an element bound with withContext", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "skeleton")).toContain("skeleton");
  });

  it("applies a motion set on PropsProvider to a descendant", () => {
    const Probe = withContext("div");
    const { container } = render(
      createElement(PropsProvider, { value: { motion: "shimmer" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "skeleton")).toContain(
      variantClass("skeleton", "motion", "shimmer"),
    );
  });
});

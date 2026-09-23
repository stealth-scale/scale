import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext, withGroupContext } from "#kbd/context.ts";

describe("context", () => {
  it("applies the kbd class to a bound element", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "Esc"));

    expect(recipeClasses(container, "kbd")).toContain("kbd");
  });

  it("applies the size set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(PropsProvider, { value: { size: "sm" } }, createElement(Probe, null, "Esc")),
    );

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "size", "sm"));
  });

  it("applies the kbd-group class to an element bound to the group recipe", () => {
    const Probe = withGroupContext("span");
    const { container } = render(createElement(Probe, null, "Esc"));

    expect(recipeClasses(container, "kbd-group")).toContain("kbd-group");
  });
});

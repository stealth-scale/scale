import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#container/context.ts";

describe("context", () => {
  it("applies the container class to a bound element", () => {
    const Probe = withContext("section");
    const { container } = render(createElement(Probe, null, "One"));

    expect(recipeClasses(container, "container")).toContain("container");
  });

  it("applies the size set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("section");
    const { container } = render(
      createElement(PropsProvider, { value: { size: "prose" } }, createElement(Probe, null, "One")),
    );

    expect(recipeClasses(container, "container")).toContain(
      variantClass("container", "size", "prose"),
    );
  });
});

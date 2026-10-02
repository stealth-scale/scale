import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#divider/context.ts";

describe("context", () => {
  it("applies the divider class to a bound element", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "divider")).toContain("divider");
  });

  it("applies the orientation set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("div");
    const { container } = render(
      createElement(PropsProvider, { value: { orientation: "vertical" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "divider")).toContain(
      variantClass("divider", "orientation", "vertical"),
    );
  });
});

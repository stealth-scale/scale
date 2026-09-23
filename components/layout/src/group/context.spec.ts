import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#group/context.ts";

describe("context", () => {
  it("applies the group class to a bound element", () => {
    const Probe = withContext("section");
    const { container } = render(createElement(Probe, null, "One"));

    expect(recipeClasses(container, "group")).toContain("group");
  });

  it("applies the orientation set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("section");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { orientation: "vertical" } },
        createElement(Probe, null, "One"),
      ),
    );

    expect(recipeClasses(container, "group")).toContain(
      variantClass("group", "orientation", "vertical"),
    );
  });
});

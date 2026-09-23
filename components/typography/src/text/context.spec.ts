import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#text/context.ts";

describe("context", () => {
  it("applies the text class to a bound element", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "Words"));

    expect(recipeClasses(container, "text")).toContain("text");
  });

  it("applies the size set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(PropsProvider, { value: { size: "lg" } }, createElement(Probe, null, "Words")),
    );

    expect(recipeClasses(container, "text")).toContain(variantClass("text", "size", "lg"));
  });
});

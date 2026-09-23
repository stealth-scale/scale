import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#input/context.ts";

describe("context", () => {
  it("applies the recipe class to an element it binds", () => {
    const Probe = withContext("input");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "input")).toContain("input");
  });

  it("applies a provider's variant to an element inside it", () => {
    const Probe = withContext("input");
    const { container } = render(
      createElement(PropsProvider, { value: { variant: "subtle" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "input")).toContain(variantClass("input", "variant", "subtle"));
  });
});

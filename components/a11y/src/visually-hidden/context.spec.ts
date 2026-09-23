import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#visually-hidden/context.ts";

describe("context", () => {
  it("applies the visually-hidden class to a bound element", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe, null, "Loading"));

    expect(recipeClasses(container, "visually-hidden")).toContain("visually-hidden");
  });

  it("applies the focusable class set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("div");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { focusable: true } },
        createElement(Probe, null, "Skip"),
      ),
    );

    expect(recipeClasses(container, "visually-hidden")).toContain(
      variantClass("visually-hidden", "focusable", true),
    );
  });
});

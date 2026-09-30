import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#screen/context.ts";

describe("context", () => {
  it("applies the screen class to a bound element", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "screen")).toContain("screen");
  });

  it("applies the screen class to a bound element below PropsProvider", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(PropsProvider, { value: {} }, createElement(Probe)));

    expect(recipeClasses(container, "screen")).toContain("screen");
  });
});

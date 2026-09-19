import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#tile/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "tile")).toContain("tile");
  });

  it("draws the recipe's class on an element below a provider", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(PropsProvider, { value: {} }, createElement(Probe)));

    expect(recipeClasses(container, "tile")).toContain("tile");
  });
});

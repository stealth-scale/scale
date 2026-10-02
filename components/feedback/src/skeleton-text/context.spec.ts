import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#skeleton-text/context.ts";

describe("context", () => {
  it("applies the recipe class to an element bound with withContext", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });

  it("applies the recipe class inside an empty PropsProvider", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(PropsProvider, { value: {} }, createElement(Probe)));

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });
});

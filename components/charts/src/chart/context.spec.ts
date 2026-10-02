import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#chart/context.ts";

describe("context", () => {
  it("applies the root class to the element the provider binds", () => {
    const Probe = withProvider("figure", "root");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "chart")).toContain("chart__root");
  });

  it("applies a part's class to an element bound under the provider", () => {
    const Root = withProvider("figure", "root");
    const Part = withContext("figcaption", "caption");
    const { container } = render(createElement(Root, null, createElement(Part)));

    expect(container.querySelector("figcaption")?.className).toContain("chart__caption");
  });
});

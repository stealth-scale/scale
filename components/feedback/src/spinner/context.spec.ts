import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext } from "#spinner/context.ts";

describe("context", () => {
  it("applies the recipe class to an element bound with withContext", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "spinner")).toContain("spinner");
  });

  it("applies the default size class when the caller passes no size", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "spinner")).toContain(variantClass("spinner", "size", "md"));
  });
});

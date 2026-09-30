import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#password-input/context.ts";

describe("context", () => {
  it("applies the recipe class to an element it binds", () => {
    const Probe = withContext("button");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "password-input")).toContain("password-input");
  });

  it("applies the size a provider above passes", () => {
    const Probe = withContext("button");
    const { container } = render(
      createElement(PropsProvider, { value: { size: "sm" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "password-input")).toContain(
      variantClass("password-input", "size", "sm"),
    );
  });
});

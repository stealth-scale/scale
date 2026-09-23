import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#link/context.ts";

describe("context", () => {
  it("applies the recipe class to a bound element", () => {
    const Probe = withContext("a");
    const { container } = render(createElement(Probe, { href: "#" }, "Read on"));

    expect(recipeClasses(container, "link")).toContain("link");
  });

  it("applies a variant set on PropsProvider to a descendant", () => {
    const Probe = withContext("a");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { variant: "underline" } },
        createElement(Probe, { href: "#" }, "Read on"),
      ),
    );

    expect(recipeClasses(container, "link")).toContain(
      variantClass("link", "variant", "underline"),
    );
  });
});

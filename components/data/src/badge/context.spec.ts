import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#badge/context.ts";

describe("context", () => {
  it("applies the recipe class to an element bound with withContext", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "New"));

    expect(recipeClasses(container, "badge")).toContain("badge");
  });

  it("applies a variant set on PropsProvider to a descendant", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { variant: "outline" } },
        createElement(Probe, null, "New"),
      ),
    );

    expect(recipeClasses(container, "badge")).toContain(
      variantClass("badge", "variant", "outline"),
    );
  });
});

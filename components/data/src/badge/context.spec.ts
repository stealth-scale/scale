import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#badge/context.ts";

describe("context", () => {
  it("puts the recipe's base class on the element it wraps", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "New"));

    expect(recipeClasses(container, "badge")).toContain("badge");
  });

  it("applies the variant class an ancestor provider supplies", () => {
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

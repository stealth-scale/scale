import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#mark/context.ts";

describe("context", () => {
  it("applies the mark class to a bound element", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "hit"));

    expect(recipeClasses(container, "mark")).toContain("mark");
  });

  it("applies the variant set by PropsProvider to a bound element below it", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { variant: "solid" } },
        createElement(Probe, null, "hit"),
      ),
    );

    expect(recipeClasses(container, "mark")).toContain(variantClass("mark", "variant", "solid"));
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { withContext } from "#floated/context.ts";

describe("context", () => {
  it("applies the floated class to a bound element", () => {
    const Box = withContext("div");
    const { container } = render(createElement(Box));

    expect(recipeClasses(container, "floated")).toContain("floated");
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { withContext } from "#span/context.ts";

describe("context", () => {
  it("applies the span class to a bound element", () => {
    const Probe = withContext("i");
    const { container } = render(createElement(Probe, null, "a run"));

    expect(recipeClasses(container, "span")).toContain("span");
  });
});

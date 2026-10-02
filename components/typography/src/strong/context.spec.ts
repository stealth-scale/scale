import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { withContext } from "#strong/context.ts";

describe("context", () => {
  it("applies the strong class to a bound element", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "important"));

    expect(recipeClasses(container, "strong")).toContain("strong");
  });
});

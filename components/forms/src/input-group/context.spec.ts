import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#input-group/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Box = withProvider("div", "root");
    const Mark = withContext("span", "mark");
    const { container } = render(createElement(Box, null, createElement(Mark, null, "€")));

    expect(slotClasses(container, "input-group", "mark")).toContain("input-group__mark");
  });

  it("applies the root's variant to a part inside it", () => {
    const Box = withProvider("div", "root");
    const Mark = withContext("span", "mark");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Mark, null, "€")),
    );

    expect(slotClasses(container, "input-group", "mark")).toContain(
      variantClass("input-group__mark", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#progress-circle/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grid = withProvider("div", "root");
    const Figure = withContext("span", "valueText");
    const { container } = render(createElement(Grid, null, createElement(Figure)));

    expect(slotClasses(container, "progress-circle", "valueText")).toContain(
      slotClass("progress-circle", "valueText"),
    );
  });

  it("applies the root's size to the value text inside it", () => {
    const Grid = withProvider("div", "root");
    const Figure = withContext("span", "valueText");
    const { container } = render(createElement(Grid, { size: "xl" }, createElement(Figure)));

    expect(slotClasses(container, "progress-circle", "valueText")).toContain(
      variantClass(slotClass("progress-circle", "valueText"), "size", "xl"),
    );
  });
});

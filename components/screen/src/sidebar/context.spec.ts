import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#sidebar/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Columned = withProvider("div", "root");
    const Band = withContext("div", "header");
    const { container } = render(createElement(Columned, null, createElement(Band)));

    expect(slotClasses(container, "sidebar", "header")).toContain(slotClass("sidebar", "header"));
  });

  it("applies the root's size to a part below it", () => {
    const Columned = withProvider("div", "root");
    const Band = withContext("div", "footer");
    const { container } = render(createElement(Columned, { size: "lg" }, createElement(Band)));

    expect(slotClasses(container, "sidebar", "footer")).toContain(
      variantClass(slotClass("sidebar", "footer"), "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#loader/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("span", "root");
    const Indicator = withContext("span", "indicator");
    const { container } = render(createElement(Root, null, createElement(Indicator)));

    expect(slotClasses(container, "loader", "indicator")).toContain("loader__indicator");
  });

  it("applies the default scrim class to the overlay slot", () => {
    const Overlay = withProvider("div", "overlay");
    const { container } = render(createElement(Overlay));

    expect(slotClasses(container, "loader", "overlay")).toContain(
      variantClass("loader__overlay", "scrim", "veil"),
    );
  });
});

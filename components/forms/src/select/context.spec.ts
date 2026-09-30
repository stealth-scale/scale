import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#select/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Indicator = withContext("span", "indicator");
    const { container } = render(createElement(Root, null, createElement(Indicator)));

    expect(slotClasses(container, "select", "indicator")).toContain("select__indicator");
  });

  it("applies the size class to the trigger slot", () => {
    const Root = withProvider("div", "root");
    const Pressed = withContext("button", "trigger");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Pressed)));

    expect(slotClasses(container, "select", "trigger")).toContain(
      variantClass("select__trigger", "size", "lg"),
    );
  });
});

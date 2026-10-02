import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#angle-slider/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Dial = withProvider("div", "root");
    const Knob = withContext("div", "thumb");
    const { container } = render(createElement(Dial, null, createElement(Knob)));

    expect(slotClasses(container, "angle-slider", "thumb")).toContain(
      slotClass("angle-slider", "thumb"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Dial = withProvider("div", "root");
    const Knob = withContext("div", "thumb");
    const { container } = render(createElement(Dial, { variant: "subtle" }, createElement(Knob)));

    expect(slotClasses(container, "angle-slider", "thumb")).toContain(
      variantClass(slotClass("angle-slider", "thumb"), "variant", "subtle"),
    );
  });
});

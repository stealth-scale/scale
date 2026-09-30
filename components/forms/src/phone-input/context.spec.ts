import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#phone-input/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Picker = withProvider("div", "picker");
    const Dial = withContext("span", "dial");
    const { container } = render(createElement(Picker, null, createElement(Dial)));

    expect(slotClasses(container, "phone-input", "dial")).toContain("phone-input__dial");
  });

  it("applies the size class to the trigger slot", () => {
    const Picker = withProvider("div", "picker");
    const Pressed = withContext("button", "trigger");
    const { container } = render(createElement(Picker, { size: "lg" }, createElement(Pressed)));

    expect(slotClasses(container, "phone-input", "trigger")).toContain(
      variantClass("phone-input__trigger", "size", "lg"),
    );
  });
});

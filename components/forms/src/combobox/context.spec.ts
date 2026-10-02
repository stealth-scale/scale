import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#combobox/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Pressed = withContext("button", "trigger");
    const { container } = render(createElement(Root, null, createElement(Pressed)));

    expect(slotClasses(container, "combobox", "trigger")).toContain("combobox__trigger");
  });

  it("applies the size class to the input slot", () => {
    const Root = withProvider("div", "root");
    const Typed = withContext("input", "input");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Typed)));

    expect(slotClasses(container, "combobox", "input")).toContain(
      variantClass("combobox__input", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#color-picker/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Pressed = withContext("button", "trigger");
    const { container } = render(createElement(Root, null, createElement(Pressed)));

    expect(slotClasses(container, "color-picker", "trigger")).toContain("color-picker__trigger");
  });

  it("applies the size class to the channel input slot", () => {
    const Root = withProvider("div", "root");
    const Typed = withContext("input", "channelInput");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Typed)));

    expect(slotClasses(container, "color-picker", "channelInput")).toContain(
      variantClass("color-picker__channel-input", "size", "lg"),
    );
  });
});

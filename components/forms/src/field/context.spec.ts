import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#field/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Box = withProvider("div", "root");
    const Words = withContext("p", "helperText");
    const { container } = render(createElement(Box, null, createElement(Words, null, "A format")));

    expect(slotClasses(container, "field", "helperText")).toContain(
      slotClass("field", "helperText"),
    );
  });

  it("writes a slot's name in kebab case in its class", () => {
    expect(slotClass("field", "helperText")).toBe("field__helper-text");
  });

  it("applies the root's variant to a part inside it", () => {
    const Box = withProvider("div", "root");
    const Words = withContext("p", "helperText");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Words, null, "A format")),
    );

    expect(slotClasses(container, "field", "helperText")).toContain(
      variantClass(slotClass("field", "helperText"), "size", "lg"),
    );
  });
});

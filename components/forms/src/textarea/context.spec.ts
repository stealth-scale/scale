import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#textarea/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Box = withProvider("div", "root");
    const Typed = withContext("textarea", "control");
    const { container } = render(createElement(Box, null, createElement(Typed)));

    expect(slotClasses(container, "textarea", "control")).toContain(
      slotClass("textarea", "control"),
    );
  });

  it("applies the root's variant to the control inside it", () => {
    const Box = withProvider("div", "root");
    const Typed = withContext("textarea", "control");
    const { container } = render(createElement(Box, { grip: "none" }, createElement(Typed)));

    expect(slotClasses(container, "textarea", "control")).toContain(
      variantClass(slotClass("textarea", "control"), "grip", "none"),
    );
  });
});

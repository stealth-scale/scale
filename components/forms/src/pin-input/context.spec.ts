import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#pin-input/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grouped = withProvider("fieldset", "root");
    const Box = withContext("input", "input");
    const { container } = render(createElement(Grouped, null, createElement(Box)));

    expect(slotClasses(container, "pin-input", "input")).toContain(slotClass("pin-input", "input"));
  });

  it("applies the root's variant to a part inside it", () => {
    const Grouped = withProvider("fieldset", "root");
    const Box = withContext("input", "input");
    const { container } = render(createElement(Grouped, { variant: "subtle" }, createElement(Box)));

    expect(slotClasses(container, "pin-input", "input")).toContain(
      variantClass(slotClass("pin-input", "input"), "variant", "subtle"),
    );
  });
});

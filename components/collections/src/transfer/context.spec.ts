import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#transfer/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Framed = withProvider("div", "root");
    const Between = withContext("div", "controls");
    const { container } = render(createElement(Framed, null, createElement(Between)));

    expect(slotClasses(container, "transfer", "controls")).toContain(
      slotClass("transfer", "controls"),
    );
  });

  it("passes the root's size to a control below it", () => {
    const Framed = withProvider("div", "root");
    const Pressed = withContext("button", "control");
    const { container } = render(createElement(Framed, { size: "lg" }, createElement(Pressed)));

    expect(slotClasses(container, "transfer", "control")).toContain(
      variantClass(slotClass("transfer", "control"), "size", "lg"),
    );
  });
});

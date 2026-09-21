import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#checkbox/context.ts";

describe("context", () => {
  it("applies the control slot class to a component built with withContext", () => {
    const Row = withProvider("label", "root");
    const Boxed = withContext("div", "control");
    const { container } = render(createElement(Row, null, createElement(Boxed)));

    expect(slotClasses(container, "checkbox", "control")).toContain(
      slotClass("checkbox", "control"),
    );
  });

  it("hands the root's variants to the box below it", () => {
    const Row = withProvider("label", "root");
    const Boxed = withContext("div", "control");
    const { container } = render(createElement(Row, { radius: "full" }, createElement(Boxed)));

    expect(slotClasses(container, "checkbox", "control")).toContain(
      variantClass(slotClass("checkbox", "control"), "radius", "full"),
    );
  });
});

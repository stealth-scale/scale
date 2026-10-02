import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#switch/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Row = withProvider("label", "root");
    const Tracked = withContext("span", "control");
    const { container } = render(createElement(Row, null, createElement(Tracked)));

    expect(slotClasses(container, "switch", "control")).toContain(slotClass("switch", "control"));
  });

  it("applies the root's variant class to a part inside it", () => {
    const Row = withProvider("label", "root");
    const Tracked = withContext("span", "control");
    const { container } = render(createElement(Row, { radius: "l1" }, createElement(Tracked)));

    expect(slotClasses(container, "switch", "control")).toContain(
      variantClass(slotClass("switch", "control"), "radius", "l1"),
    );
  });
});

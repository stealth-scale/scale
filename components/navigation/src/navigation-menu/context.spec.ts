import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#navigation-menu/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Nav = withProvider("nav", "root");
    const Bar = withContext("ul", "list");
    const { container } = render(createElement(Nav, null, createElement(Bar)));

    expect(slotClasses(container, "navigation-menu", "list")).toContain(
      slotClass("navigation-menu", "list"),
    );
  });

  it("applies a size the root sets to a part below it", () => {
    const Nav = withProvider("nav", "root");
    const Pressed = withContext("button", "trigger");
    const { container } = render(createElement(Nav, { size: "lg" }, createElement(Pressed)));

    expect(slotClasses(container, "navigation-menu", "trigger")).toContain(
      variantClass(slotClass("navigation-menu", "trigger"), "size", "lg"),
    );
  });
});

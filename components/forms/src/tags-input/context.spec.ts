import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#tags-input/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Stacked = withProvider("div", "root");
    const Box = withContext("div", "control");
    const { container } = render(createElement(Stacked, null, createElement(Box)));

    expect(slotClasses(container, "tags-input", "control")).toContain(
      slotClass("tags-input", "control"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Stacked = withProvider("div", "root");
    const Box = withContext("div", "control");
    const { container } = render(createElement(Stacked, { variant: "subtle" }, createElement(Box)));

    expect(slotClasses(container, "tags-input", "control")).toContain(
      variantClass(slotClass("tags-input", "control"), "variant", "subtle"),
    );
  });
});

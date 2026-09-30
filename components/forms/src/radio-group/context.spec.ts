import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#radio-group/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grouped = withProvider("div", "root");
    const Row = withContext("label", "item");
    const { container } = render(createElement(Grouped, null, createElement(Row)));

    expect(slotClasses(container, "radio-group", "item")).toContain(
      slotClass("radio-group", "item"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Grouped = withProvider("div", "root");
    const Row = withContext("label", "item");
    const { container } = render(createElement(Grouped, { align: "start" }, createElement(Row)));

    expect(slotClasses(container, "radio-group", "item")).toContain(
      variantClass(slotClass("radio-group", "item"), "align", "start"),
    );
  });
});

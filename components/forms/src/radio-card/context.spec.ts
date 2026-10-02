import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#radio-card/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grouped = withProvider("div", "root");
    const Card = withContext("label", "item");
    const { container } = render(createElement(Grouped, null, createElement(Card)));

    expect(slotClasses(container, "radio-card", "item")).toContain(slotClass("radio-card", "item"));
  });

  it("applies the root's variant to a part inside it", () => {
    const Grouped = withProvider("div", "root");
    const Card = withContext("label", "item");
    const { container } = render(createElement(Grouped, { variant: "solid" }, createElement(Card)));

    expect(slotClasses(container, "radio-card", "item")).toContain(
      variantClass(slotClass("radio-card", "item"), "variant", "solid"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#rating-group/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Group = withProvider("div", "root");
    const Radio = withContext("span", "item");
    const { container } = render(createElement(Group, null, createElement(Radio)));

    expect(slotClasses(container, "rating-group", "item")).toContain(
      slotClass("rating-group", "item"),
    );
  });

  it("applies the root's variant to the root", () => {
    const Group = withProvider("div", "root");
    const { container } = render(createElement(Group, { size: "lg" }));

    expect(slotClasses(container, "rating-group", "root")).toContain(
      variantClass(slotClass("rating-group", "root"), "size", "lg"),
    );
  });
});

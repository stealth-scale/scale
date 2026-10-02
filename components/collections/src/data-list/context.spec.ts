import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#data-list/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("dl", "root");
    const Label = withContext("dt", "itemLabel");
    const { container } = render(createElement(Root, null, createElement(Label, null, "Raised")));

    expect(slotClasses(container, "data-list", "itemLabel")).toContain("data-list__item-label");
  });

  it("applies the size class to the item slot", () => {
    const Root = withProvider("dl", "root");
    const Item = withContext("div", "item");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Item)));

    expect(slotClasses(container, "data-list", "item")).toContain(
      variantClass("data-list__item", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#roving-focus/context.ts";

describe("context", () => {
  it("applies the root slot class to an element bound with withProvider", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "roving-focus", "root")).toContain("roving-focus__root");
  });

  it("applies the orientation variant class to the root slot", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(
      createElement(Root, { orientation: "vertical" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "roving-focus", "root")).toContain(
      slotVariantClass("roving-focus", "root", "orientation", "vertical"),
    );
  });

  it("applies the item slot class without a variant class to an item", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(
      createElement(Root, { orientation: "vertical" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "roving-focus", "item")).toStrictEqual(["roving-focus__item"]);
  });
});

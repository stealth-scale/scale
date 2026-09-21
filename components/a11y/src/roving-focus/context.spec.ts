import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#roving-focus/context.ts";

describe("context", () => {
  it("applies the root slot class to the element withProvider wraps", () => {
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

  it("applies the bare slot class to an item because the item slot declares no variant", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(
      createElement(Root, { orientation: "vertical" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "roving-focus", "item")).toStrictEqual(["roving-focus__item"]);
  });
});

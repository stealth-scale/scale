import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#grid/context.ts";

describe("context", () => {
  it("applies the root slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "grid", "root")).toContain("grid__root");
  });

  it("applies the span set on the root to an item below it", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(
      createElement(Root, { span: "2" }, createElement(Item, null, "One")),
    );

    expect(slotClasses(container, "grid", "item")).toContain(
      slotVariantClass("grid", "item", "span", "2"),
    );
  });
});

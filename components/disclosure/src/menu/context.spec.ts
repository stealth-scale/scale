import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#menu/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "menu", "root")).toContain("menu__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Item)));

    expect(slotClasses(container, "menu", "item")).toContain(
      slotVariantClass("menu", "item", "size", "lg"),
    );
  });

  it("applies no variant class to a part the value does not style", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, { size: "lg" }));

    expect(slotClasses(container, "menu", "root")).not.toContain(
      slotVariantClass("menu", "root", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#carousel/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "carousel", "root")).toContain("carousel__root");
  });

  it("passes the root's radius to a slide below it", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(createElement(Root, { radius: "l1" }, createElement(Item)));

    expect(slotClasses(container, "carousel", "item")).toContain(
      slotVariantClass("carousel", "item", "radius", "l1"),
    );
  });
});

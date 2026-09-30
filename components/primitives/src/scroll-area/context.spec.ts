import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#scroll-area/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "scroll-area", "root")).toContain("scroll-area__root");
  });

  it("passes the root's height to a viewport below it", () => {
    const Root = withProvider("div", "root");
    const Viewport = withContext("div", "viewport");
    const { container } = render(createElement(Root, { maxHeight: "sm" }, createElement(Viewport)));

    expect(slotClasses(container, "scroll-area", "viewport")).toContain(
      slotVariantClass("scroll-area", "viewport", "maxHeight", "sm"),
    );
  });
});

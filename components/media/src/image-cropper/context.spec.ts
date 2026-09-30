import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#image-cropper/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "image-cropper", "root")).toContain("image-cropper__root");
  });

  it("passes the root's radius to the viewport below it", () => {
    const Root = withProvider("div", "root");
    const Viewport = withContext("div", "viewport");
    const { container } = render(createElement(Root, { radius: "l1" }, createElement(Viewport)));

    expect(slotClasses(container, "image-cropper", "viewport")).toContain(
      slotVariantClass("image-cropper", "viewport", "radius", "l1"),
    );
  });
});

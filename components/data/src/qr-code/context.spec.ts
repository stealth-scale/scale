import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#qr-code/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "qr-code", "root")).toContain("qr-code__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Overlay = withContext("div", "overlay");
    const { container } = render(createElement(Root, { palette: "info" }, createElement(Overlay)));

    expect(slotClasses(container, "qr-code", "overlay")).toContain(
      slotVariantClass("qr-code", "overlay", "palette", "info"),
    );
  });
});

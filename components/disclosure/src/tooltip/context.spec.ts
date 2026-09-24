import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#tooltip/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "tooltip", "root")).toContain("tooltip__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Tip = withContext("div", "arrowTip");
    const { container } = render(createElement(Root, { variant: "surface" }, createElement(Tip)));

    expect(slotClasses(container, "tooltip", "arrowTip")).toContain(
      slotVariantClass("tooltip", "arrowTip", "variant", "surface"),
    );
  });

  it("applies no variant class to a part the value does not style", () => {
    const Root = withProvider("div", "root");
    const Arrow = withContext("div", "arrow");
    const { container } = render(createElement(Root, { variant: "surface" }, createElement(Arrow)));

    expect(slotClasses(container, "tooltip", "arrow")).not.toContain(
      slotVariantClass("tooltip", "arrow", "variant", "surface"),
    );
  });
});

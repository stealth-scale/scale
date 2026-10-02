import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#action-bar/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "action-bar", "root")).toContain("action-bar__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Positioner = withContext("div", "positioner");
    const { container } = render(
      createElement(Root, { placement: "bottom-end" }, createElement(Positioner)),
    );

    expect(slotClasses(container, "action-bar", "positioner")).toContain(
      slotVariantClass("action-bar", "positioner", "placement", "bottom-end"),
    );
  });
});

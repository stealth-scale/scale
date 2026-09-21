import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#clipboard/context.ts";

describe("context", () => {
  it("puts the root slot's class on the element withProvider wraps", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "clipboard", "root")).toContain("clipboard__root");
  });

  it("applies the root's size variant to the label slot below it", () => {
    const Root = withProvider("div", "root");
    const Label = withContext("label", "label");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Label)));

    expect(slotClasses(container, "clipboard", "label")).toContain(
      slotVariantClass("clipboard", "label", "size", "lg"),
    );
  });
});

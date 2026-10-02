import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#clipboard/context.ts";

describe("context", () => {
  it("applies the root slot class to the element withProvider binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "clipboard", "root")).toContain("clipboard__root");
  });

  it("applies the size variant of the root to the label slot", () => {
    const Root = withProvider("div", "root");
    const Label = withContext("label", "label");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Label)));

    expect(slotClasses(container, "clipboard", "label")).toContain(
      slotVariantClass("clipboard", "label", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#clipboard/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "clipboard", "root")).toContain("clipboard__root");
  });

  it("hands the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Label = withContext("label", "label");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Label)));

    expect(slotClasses(container, "clipboard", "label")).toContain(
      slotVariantClass("clipboard", "label", "size", "lg"),
    );
  });
});

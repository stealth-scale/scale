import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#stat/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("dl", "root");
    const Label = withContext("dt", "label");
    const { container } = render(createElement(Root, null, createElement(Label, null, "Raised")));

    expect(slotClasses(container, "stat", "label")).toContain("stat__label");
  });

  it("applies the size class to the figure slot", () => {
    const Root = withProvider("dl", "root");
    const Value = withContext("dd", "valueText");
    const { container } = render(
      createElement(Root, { size: "lg" }, createElement(Value, null, "240")),
    );

    expect(slotClasses(container, "stat", "valueText")).toContain(
      variantClass("stat__value-text", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#native-select/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Indicator = withContext("span", "indicator");
    const { container } = render(createElement(Root, null, createElement(Indicator)));

    expect(slotClasses(container, "native-select", "indicator")).toContain(
      "native-select__indicator",
    );
  });

  it("applies the size class to the field slot", () => {
    const Root = withProvider("div", "root");
    const Selected = withContext("select", "field");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Selected)));

    expect(slotClasses(container, "native-select", "field")).toContain(
      variantClass("native-select__field", "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#date-input/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Edited = withContext("span", "segment");
    const { container } = render(createElement(Root, null, createElement(Edited)));

    expect(slotClasses(container, "date-input", "segment")).toContain("date-input__segment");
  });

  it("applies the size class to the segment group slot", () => {
    const Root = withProvider("div", "root");
    const Grouped = withContext("div", "segmentGroup");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Grouped)));

    expect(slotClasses(container, "date-input", "segmentGroup")).toContain(
      variantClass("date-input__segment-group", "size", "lg"),
    );
  });
});

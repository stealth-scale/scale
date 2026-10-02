import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#date-picker/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("div", "root");
    const Pressed = withContext("button", "trigger");
    const { container } = render(createElement(Root, null, createElement(Pressed)));

    expect(slotClasses(container, "date-picker", "trigger")).toContain("date-picker__trigger");
  });

  it("applies the size class to the table cell trigger slot", () => {
    const Root = withProvider("div", "root");
    const Picked = withContext("div", "tableCellTrigger");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Picked)));

    expect(slotClasses(container, "date-picker", "tableCellTrigger")).toContain(
      variantClass("date-picker__table-cell-trigger", "size", "lg"),
    );
  });

  it("applies the palette class to the content slot", () => {
    const Root = withProvider("div", "root");
    const Panel = withContext("div", "content");
    const { container } = render(createElement(Root, { palette: "accent" }, createElement(Panel)));

    expect(slotClasses(container, "date-picker", "content")).toContain(
      variantClass("date-picker__content", "palette", "accent"),
    );
  });
});

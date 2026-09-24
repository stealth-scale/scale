import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#table/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Box = withProvider("div", "scroller");
    const Table = withContext("table", "root");
    const { container } = render(createElement(Box, null, createElement(Table)));

    expect(slotClasses(container, "table", "root")).toContain("table__root");
  });

  it("applies the scroller's variant class to a part inside it", () => {
    const Box = withProvider("div", "scroller");
    const Table = withContext("table", "root");
    const { container } = render(createElement(Box, { size: "lg" }, createElement(Table)));

    expect(slotClasses(container, "table", "root")).toContain(
      variantClass("table__root", "size", "lg"),
    );
  });
});

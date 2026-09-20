import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#matrix/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "matrix", "root")).toContain("matrix__root");
  });

  it("hands the count across to the grid below the root", () => {
    const Root = withProvider("div", "root");
    const Grid = withContext("div", "grid");
    const { container } = render(
      createElement(Root, { across: "3" }, createElement(Grid, null, "One")),
    );

    expect(slotClasses(container, "matrix", "grid")).toContain(
      slotVariantClass("matrix", "grid", "across", "3"),
    );
  });
});

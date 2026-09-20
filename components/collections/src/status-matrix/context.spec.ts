import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#status-matrix/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Framed = withProvider("div", "root");
    const Listed = withContext("ul", "legend");
    const { container } = render(createElement(Framed, null, createElement(Listed)));

    expect(slotClasses(container, "status-matrix", "legend")).toContain(
      slotClass("status-matrix", "legend"),
    );
  });

  it("hands the root's variants to a mark below it", () => {
    const Framed = withProvider("div", "root");
    const Marked = withContext("span", "mark");
    const { container } = render(createElement(Framed, { size: "lg" }, createElement(Marked)));

    expect(slotClasses(container, "status-matrix", "mark")).toContain(
      variantClass(slotClass("status-matrix", "mark"), "size", "lg"),
    );
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#status-matrix/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Framed = withProvider("div", "root");
    const Listed = withContext("ul", "legend");
    const { container } = render(createElement(Framed, null, createElement(Listed)));

    expect(slotClasses(container, "status-matrix", "legend")).toContain(
      slotClass("status-matrix", "legend"),
    );
  });

  it("passes the root's size to a part below it", () => {
    const Framed = withProvider("div", "root");
    const Marked = withContext("span", "mark");
    const { container } = render(createElement(Framed, { size: "lg" }, createElement(Marked)));

    expect(slotClasses(container, "status-matrix", "mark")).toContain(
      variantClass(slotClass("status-matrix", "mark"), "size", "lg"),
    );
  });
});

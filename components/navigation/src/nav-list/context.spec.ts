import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#nav-list/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const List = withProvider("ul", "root");
    const Row = withContext("a", "link");
    const { container } = render(createElement(List, null, createElement(Row)));

    expect(slotClasses(container, "nav-list", "link")).toContain(slotClass("nav-list", "link"));
  });

  it("applies a variant the root sets to a part below it", () => {
    const List = withProvider("ul", "root");
    const Row = withContext("a", "link");
    const { container } = render(createElement(List, { highlight: "bar" }, createElement(Row)));

    expect(slotClasses(container, "nav-list", "link")).toContain(
      variantClass(slotClass("nav-list", "link"), "highlight", "bar"),
    );
  });
});

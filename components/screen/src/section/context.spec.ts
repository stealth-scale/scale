import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#section/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Block = withProvider("section", "root");
    const Band = withContext("header", "header");
    const { container } = render(createElement(Block, null, createElement(Band)));

    expect(slotClasses(container, "section", "header")).toContain(slotClass("section", "header"));
  });

  it("passes the root's variants to a part below it", () => {
    const Block = withProvider("section", "root");
    const Named = withContext("h2", "title");
    const { container } = render(createElement(Block, { size: "lg" }, createElement(Named)));

    expect(slotClasses(container, "section", "title")).toContain(
      variantClass(slotClass("section", "title"), "size", "lg"),
    );
  });
});

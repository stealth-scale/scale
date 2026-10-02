import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#form/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Box = withProvider("form", "root");
    const Heading = withContext("h2", "heading");
    const { container } = render(createElement(Box, null, createElement(Heading, null, "About")));

    expect(slotClasses(container, "form", "heading")).toContain(slotClass("form", "heading"));
  });

  it("applies the root's variant to a part inside it", () => {
    const Box = withProvider("form", "root");
    const Heading = withContext("h2", "heading");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Heading, null, "About")),
    );

    expect(slotClasses(container, "form", "heading")).toContain(
      variantClass(slotClass("form", "heading"), "size", "lg"),
    );
  });
});

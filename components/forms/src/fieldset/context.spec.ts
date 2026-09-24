import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#fieldset/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Box = withProvider("fieldset", "root");
    const Words = withContext("legend", "legend");
    const { container } = render(createElement(Box, null, createElement(Words, null, "Delivery")));

    expect(slotClasses(container, "fieldset", "legend")).toContain(slotClass("fieldset", "legend"));
  });

  it("applies the root's variant to a part inside it", () => {
    const Box = withProvider("fieldset", "root");
    const Words = withContext("legend", "legend");
    const { container } = render(
      createElement(Box, { size: "lg" }, createElement(Words, null, "Delivery")),
    );

    expect(slotClasses(container, "fieldset", "legend")).toContain(
      variantClass(slotClass("fieldset", "legend"), "size", "lg"),
    );
  });
});

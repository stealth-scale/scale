import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#details/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Opened = withProvider("details", "root");
    const Named = withContext("summary", "summary");
    const { container } = render(createElement(Opened, null, createElement(Named)));

    expect(slotClasses(container, "details", "summary")).toContain(slotClass("details", "summary"));
  });

  it("applies the root's variant to a part inside it", () => {
    const Opened = withProvider("details", "root");
    const Named = withContext("summary", "summary");
    const { container } = render(createElement(Opened, { size: "lg" }, createElement(Named)));

    expect(slotClasses(container, "details", "summary")).toContain(
      variantClass(slotClass("details", "summary"), "size", "lg"),
    );
  });
});

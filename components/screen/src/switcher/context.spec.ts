import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withRootProvider } from "#switcher/context.ts";

describe("context", () => {
  it("applies the slot class to a bound element", () => {
    const Held = withRootProvider("div");
    const Named = withContext("span", "name");
    const { container } = render(createElement(Held, null, createElement(Named)));

    expect(slotClasses(container, "switcher", "name")).toContain(slotClass("switcher", "name"));
  });

  it("applies the root's size to a part below it", () => {
    const Held = withRootProvider("div");
    const Named = withContext("span", "name");
    const { container } = render(createElement(Held, { size: "lg" }, createElement(Named)));

    expect(slotClasses(container, "switcher", "name")).toContain(
      variantClass(slotClass("switcher", "name"), "size", "lg"),
    );
  });
});

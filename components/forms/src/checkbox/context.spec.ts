import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withGroupContext, withProvider } from "#checkbox/context.ts";

describe("context", () => {
  it("applies the group recipe's class to the element it binds for the group", () => {
    const Listed = withGroupContext("div");
    const { container } = render(createElement(Listed, { size: "sm" }));

    expect([...(container.firstElementChild?.classList ?? [])]).toContain(
      variantClass("checkbox-group", "size", "sm"),
    );
  });

  it("applies the slot class to an element it binds", () => {
    const Row = withProvider("label", "root");
    const Boxed = withContext("div", "control");
    const { container } = render(createElement(Row, null, createElement(Boxed)));

    expect(slotClasses(container, "checkbox", "control")).toContain(
      slotClass("checkbox", "control"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Row = withProvider("label", "root");
    const Boxed = withContext("div", "control");
    const { container } = render(createElement(Row, { radius: "full" }, createElement(Boxed)));

    expect(slotClasses(container, "checkbox", "control")).toContain(
      variantClass(slotClass("checkbox", "control"), "radius", "full"),
    );
  });
});

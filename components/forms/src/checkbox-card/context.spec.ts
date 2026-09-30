import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#checkbox-card/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Card = withProvider("label", "root");
    const Boxed = withContext("span", "control");
    const { container } = render(createElement(Card, null, createElement(Boxed)));

    expect(slotClasses(container, "checkbox-card", "control")).toContain(
      slotClass("checkbox-card", "control"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Card = withProvider("label", "root");
    const Boxed = withContext("span", "control");
    const { container } = render(createElement(Card, { variant: "solid" }, createElement(Boxed)));

    expect(slotClasses(container, "checkbox-card", "control")).toContain(
      variantClass(slotClass("checkbox-card", "control"), "variant", "solid"),
    );
  });
});

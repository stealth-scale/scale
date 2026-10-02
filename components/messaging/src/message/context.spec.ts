import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#message/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("article", "root");
    const Bubble = withContext("div", "bubble");
    const { container } = render(createElement(Root, null, createElement(Bubble)));

    expect(slotClasses(container, "message", "bubble")).toContain("message__bubble");
  });

  it("applies the size class to the bubble slot", () => {
    const Root = withProvider("article", "root");
    const Bubble = withContext("div", "bubble");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Bubble)));

    expect(slotClasses(container, "message", "bubble")).toContain(
      variantClass("message__bubble", "size", "lg"),
    );
  });
});

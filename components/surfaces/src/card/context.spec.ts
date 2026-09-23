import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#card/context.ts";

describe("context", () => {
  it("applies the content slot class to an element bound with withContext", () => {
    const Panel = withProvider("article", "root");
    const Band = withContext("div", "content");
    const { container } = render(createElement(Panel, null, createElement(Band, null, "a line")));

    expect(slotClasses(container, "card", "content")).toContain("card__content");
  });

  it("applies the size variant class to the root slot", () => {
    const Panel = withProvider("article", "root");
    const Band = withContext("div", "content");
    const { container } = render(
      createElement(Panel, { size: "lg" }, createElement(Band, null, "a line")),
    );

    expect(slotClasses(container, "card", "root")).toContain(
      variantClass("card__root", "size", "lg"),
    );
  });
});

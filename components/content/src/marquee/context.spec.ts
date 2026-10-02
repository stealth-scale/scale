import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#marquee/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "marquee", "root")).toContain("marquee__root");
  });

  it("applies the root's gap to the root", () => {
    const Root = withProvider("div", "root");
    const Item = withContext("div", "item");
    const { container } = render(createElement(Root, { gap: "lg" }, createElement(Item)));

    expect(slotClasses(container, "marquee", "root")).toContain(
      slotVariantClass("marquee", "root", "gap", "lg"),
    );
  });
});

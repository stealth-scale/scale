import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#hover-card/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "hover-card", "root")).toContain("hover-card__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Content = withContext("div", "content");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Content)));

    expect(slotClasses(container, "hover-card", "content")).toContain(
      slotVariantClass("hover-card", "content", "size", "lg"),
    );
  });
});

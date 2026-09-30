import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#splitter/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "splitter", "root")).toContain("splitter__root");
  });

  it("passes the root's palette to a part below it", () => {
    const Root = withProvider("div", "root");
    const Panel = withContext("div", "panel");
    const { container } = render(createElement(Root, { palette: "accent" }, createElement(Panel)));

    expect(slotClasses(container, "splitter", "root")).toContain(
      slotVariantClass("splitter", "root", "palette", "accent"),
    );
  });
});

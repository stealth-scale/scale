import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#drawer/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "drawer", "root")).toContain("drawer__root");
  });

  it("passes the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Content = withContext("div", "content");
    const { container } = render(
      createElement(Root, { placement: "start" }, createElement(Content)),
    );

    expect(slotClasses(container, "drawer", "content")).toContain(
      slotVariantClass("drawer", "content", "placement", "start"),
    );
  });
});

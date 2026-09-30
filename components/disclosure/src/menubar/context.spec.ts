import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#menubar/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "menubar", "root")).toContain("menubar__root");
  });

  it("passes the root's size to a part below it", () => {
    const Root = withProvider("div", "root");
    const Trigger = withContext("button", "trigger");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Trigger)));

    expect(slotClasses(container, "menubar", "trigger")).toContain(
      slotVariantClass("menubar", "trigger", "size", "lg"),
    );
  });

  it("applies no size class to the root", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, { size: "lg" }));

    expect(slotClasses(container, "menubar", "root")).not.toContain(
      slotVariantClass("menubar", "root", "size", "lg"),
    );
  });
});

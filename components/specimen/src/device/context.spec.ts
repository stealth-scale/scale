import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#device/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root, null, "One"));

    expect(slotClasses(container, "device", "root")).toContain("device__root");
  });

  it("draws a part's slot class on the element it binds below the root", () => {
    const Root = withProvider("div", "root");
    const Bar = withContext("div", "bar");
    const { container } = render(createElement(Root, null, createElement(Bar, null, "One")));

    expect(slotClasses(container, "device", "bar")).toContain("device__bar");
  });
});

import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#swap/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("span", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "swap", "root")).toContain("swap__root");
  });

  it("applies the indicator's slot class below the root", () => {
    const Root = withProvider("span", "root");
    const Indicator = withContext("span", "indicator");
    const { container } = render(createElement(Root, null, createElement(Indicator)));

    expect(slotClasses(container, "swap", "indicator")).toContain("swap__indicator");
  });
});

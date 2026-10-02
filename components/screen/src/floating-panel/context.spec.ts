import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#floating-panel/context.ts";

describe("context", () => {
  it("applies the root's slot class to a bound element", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "floating-panel", "root")).toContain("floating-panel__root");
  });

  it("applies a part's slot class below the root", () => {
    const Root = withProvider("div", "root");
    const Header = withContext("div", "header");
    const { container } = render(createElement(Root, null, createElement(Header)));

    expect(slotClasses(container, "floating-panel", "header")).toContain("floating-panel__header");
  });
});

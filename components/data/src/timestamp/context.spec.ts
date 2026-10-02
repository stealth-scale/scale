import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#timestamp/context.ts";

describe("context", () => {
  it("applies the root slot class to an element bound with withProvider", () => {
    const Root = withProvider("time", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "timestamp", "root")).toContain("timestamp__root");
  });

  it("applies the exact slot class to an element bound with withContext", () => {
    const Root = withProvider("time", "root");
    const Exact = withContext("span", "exact");
    const { container } = render(createElement(Root, null, createElement(Exact)));

    expect(slotClasses(container, "timestamp", "exact")).toContain("timestamp__exact");
  });
});

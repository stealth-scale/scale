import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#status/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("span", "root");
    const Dot = withContext("span", "indicator");
    const { container } = render(createElement(Root, null, createElement(Dot)));

    expect(slotClasses(container, "status", "indicator")).toContain("status__indicator");
  });

  it("applies the size variant class a caller passes to the provider", () => {
    const Root = withProvider("span", "root");
    const { container } = render(createElement(Root, { size: "lg" }));

    expect(slotClasses(container, "status", "root")).toContain(
      variantClass("status__root", "size", "lg"),
    );
  });
});

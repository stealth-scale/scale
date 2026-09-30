import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withBadgeContext, withContext, withProvider } from "#avatar/context.ts";

describe("context", () => {
  it("applies the slot class to an element bound with withContext", () => {
    const Root = withProvider("span", "root");
    const Fallback = withContext("span", "fallback");
    const { container } = render(createElement(Root, null, createElement(Fallback, null, "AO")));

    expect(slotClasses(container, "avatar", "fallback")).toContain("avatar__fallback");
  });

  it("applies the size class to the fallback slot", () => {
    const Root = withProvider("span", "root");
    const Fallback = withContext("span", "fallback");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(Fallback)));

    expect(slotClasses(container, "avatar", "fallback")).toContain(
      variantClass("avatar__fallback", "size", "lg"),
    );
  });

  it("applies the placement class to an element bound with withBadgeContext", () => {
    const Badge = withBadgeContext("span");
    const { container } = render(createElement(Badge, { placement: "top-end" }));

    expect(container.firstElementChild?.className).toContain(
      variantClass("avatar-badge", "placement", "top-end"),
    );
  });
});

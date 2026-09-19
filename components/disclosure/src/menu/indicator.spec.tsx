import { describe, expect, it } from "vitest";

import { attr, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#menu/indicator.tsx";
import { composed, listed } from "#menu/menu.fixtures.tsx";

describe("Indicator", () => {
  it("draws a span inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Indicator />));

    expect(slotElement(container, "menu", "indicator").tagName).toBe("SPAN");
  });

  it("says the menu is shut", async () => {
    const { container } = await drawn(composed());

    expect(attr(container, "indicator", "state")).toBe("closed");
  });

  it("says the menu is open", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(attr(container, "indicator", "state")).toBe("open");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<Indicator as="i" />));

    expect(slotElement(container, "menu", "indicator").tagName).toBe("I");
  });

  it("keeps its mark out of the name the control is announced by", async () => {
    const { container } = await drawn(listed(<Indicator>▾</Indicator>));

    expect(slotElement(container, "menu", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("reads a mark out where a caller says it means something", async () => {
    const { container } = await drawn(listed(<Indicator aria-hidden={false}>3 more</Indicator>));

    expect(slotElement(container, "menu", "indicator").getAttribute("aria-hidden")).toBe("false");
  });
});

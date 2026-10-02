import { describe, expect, it } from "vitest";

import { attr, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#menu/indicator.tsx";
import { composed, listed } from "#menu/menu.fixtures.tsx";

describe("Indicator", () => {
  it("renders a span", async () => {
    const { container } = await drawn(listed(<Indicator />));

    expect(slotElement(container, "menu", "indicator").tagName).toBe("SPAN");
  });

  it("sets data-state closed while closed", async () => {
    const { container } = await drawn(composed());

    expect(attr(container, "indicator", "state")).toBe("closed");
  });

  it("sets data-state open while open", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(attr(container, "indicator", "state")).toBe("open");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(listed(<Indicator as="i" />));

    expect(slotElement(container, "menu", "indicator").tagName).toBe("I");
  });

  it("sets aria-hidden", async () => {
    const { container } = await drawn(listed(<Indicator>▾</Indicator>));

    expect(slotElement(container, "menu", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps a caller's aria-hidden false", async () => {
    const { container } = await drawn(listed(<Indicator aria-hidden={false}>3 more</Indicator>));

    expect(slotElement(container, "menu", "indicator").getAttribute("aria-hidden")).toBe("false");
  });
});

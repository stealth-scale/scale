import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#popover/indicator.tsx";
import { rooted } from "#popover/popover.fixtures.tsx";

describe("Indicator", () => {
  it("renders a span", async () => {
    const { container } = await drawn(rooted(<Indicator />));

    expect(slotElement(container, "popover", "indicator").tagName).toBe("SPAN");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(rooted(<Indicator />));

    expect(slotElement(container, "popover", "indicator").className).toContain(
      "popover__indicator",
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(rooted(<Indicator as="svg" />));

    expect(slotElement(container, "popover", "indicator").tagName).toBe("svg");
  });

  it("sets aria-hidden", async () => {
    const { container } = await drawn(rooted(<Indicator>▾</Indicator>));

    expect(slotElement(container, "popover", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps a caller's aria-hidden false", async () => {
    const { container } = await drawn(rooted(<Indicator aria-hidden={false}>3 more</Indicator>));

    expect(slotElement(container, "popover", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });
});

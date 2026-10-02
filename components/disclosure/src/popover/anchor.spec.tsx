import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Anchor } from "#popover/anchor.tsx";
import { rooted } from "#popover/popover.fixtures.tsx";

describe("Anchor", () => {
  it("renders a div", async () => {
    const { container } = await drawn(rooted(<Anchor />));

    expect(slotElement(container, "popover", "anchor").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(rooted(<Anchor />));

    expect(slotElement(container, "popover", "anchor").className).toContain("popover__anchor");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(rooted(<Anchor as="section" />));

    expect(slotElement(container, "popover", "anchor").tagName).toBe("SECTION");
  });
});

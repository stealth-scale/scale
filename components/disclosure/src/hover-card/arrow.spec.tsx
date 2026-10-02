import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#hover-card/arrow.tsx";
import { opened } from "#hover-card/hover-card.fixtures.tsx";

describe("Arrow", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Arrow />));

    expect(slotElement(container, "hover-card", "arrow").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Arrow />));

    expect(slotElement(container, "hover-card", "arrow").className).toContain("hover-card__arrow");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Arrow as="span" />));

    expect(slotElement(container, "hover-card", "arrow").tagName).toBe("SPAN");
  });
});

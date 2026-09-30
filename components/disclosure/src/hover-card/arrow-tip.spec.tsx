import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#hover-card/arrow-tip.tsx";
import { opened } from "#hover-card/hover-card.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<ArrowTip />));

    expect(slotElement(container, "hover-card", "arrowTip").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<ArrowTip />));

    expect(slotElement(container, "hover-card", "arrowTip").className).toContain(
      slotClass("hover-card", "arrowTip"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<ArrowTip as="span" />));

    expect(slotElement(container, "hover-card", "arrowTip").tagName).toBe("SPAN");
  });
});

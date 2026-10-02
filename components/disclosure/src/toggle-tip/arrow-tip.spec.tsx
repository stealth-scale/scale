import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#toggle-tip/arrow-tip.tsx";
import { opened } from "#toggle-tip/toggle-tip.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<ArrowTip />));

    expect(slotElement(container, "toggle-tip", "arrowTip").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<ArrowTip />));

    expect(slotElement(container, "toggle-tip", "arrowTip").className).toContain(
      slotClass("toggle-tip", "arrowTip"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<ArrowTip as="span" />));

    expect(slotElement(container, "toggle-tip", "arrowTip").tagName).toBe("SPAN");
  });
});

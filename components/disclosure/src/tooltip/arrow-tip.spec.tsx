import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#tooltip/arrow-tip.tsx";
import { hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div", () => {
    const { container } = render(hinted(<ArrowTip />));

    expect(slotElement(container, "tooltip", "arrowTip").tagName).toBe("DIV");
  });

  it("fills with --arrow-background", () => {
    const { container } = render(hinted(<ArrowTip />));

    expect(slotElement(container, "tooltip", "arrowTip").style.background).toBe(
      "var(--arrow-background)",
    );
  });

  it("sizes itself to the full arrow", () => {
    const { container } = render(hinted(<ArrowTip />));
    const { style } = slotElement(container, "tooltip", "arrowTip");

    expect(style.width).toBe("100%");
    expect(style.height).toBe("100%");
  });

  it("renders the element as names", () => {
    const { container } = render(hinted(<ArrowTip as="span" />));

    expect(slotElement(container, "tooltip", "arrowTip").tagName).toBe("SPAN");
  });
});

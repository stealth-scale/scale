import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#popover/arrow-tip.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div", () => {
    const { container } = render(opened(<ArrowTip />));

    expect(slotElement(container, "popover", "arrowTip").tagName).toBe("DIV");
  });

  it("applies its slot class", () => {
    const { container } = render(opened(<ArrowTip />));

    expect(slotElement(container, "popover", "arrowTip").className).toContain(
      slotClass("popover", "arrowTip"),
    );
  });

  it("renders the element as names", () => {
    const { container } = render(opened(<ArrowTip as="span" />));

    expect(slotElement(container, "popover", "arrowTip").tagName).toBe("SPAN");
  });
});

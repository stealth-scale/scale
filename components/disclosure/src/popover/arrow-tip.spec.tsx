import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#popover/arrow-tip.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<ArrowTip />));

    expect(slotElement(container, "popover", "arrowTip").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<ArrowTip />));

    expect(slotElement(container, "popover", "arrowTip").className).toContain(
      slotClass("popover", "arrowTip"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<ArrowTip as="span" />));

    expect(slotElement(container, "popover", "arrowTip").tagName).toBe("SPAN");
  });
});

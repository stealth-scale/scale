import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { ArrowTip } from "#menu/arrow-tip.tsx";
import { composed, listed } from "#menu/menu.fixtures.tsx";

describe("ArrowTip", () => {
  it("renders a div", async () => {
    const { container } = await drawn(listed(<ArrowTip />));

    expect(slotElement(container, "menu", "arrowTip").tagName).toBe("DIV");
  });

  it("takes the machine's rotation", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "arrowTip").style.transform).toContain("rotate");
  });

  it("applies the root's variant class with the panel", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, variant: "glass" }));

    expect(slotClasses(container, "menu", "arrowTip")).toContain(
      slotVariantClass("menu", "arrowTip", "variant", "glass"),
    );
    expect(slotClasses(container, "menu", "content")).toContain(
      slotVariantClass("menu", "content", "variant", "glass"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(listed(<ArrowTip as="span" />));

    expect(slotElement(container, "menu", "arrowTip").tagName).toBe("SPAN");
  });
});

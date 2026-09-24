import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Content } from "#tooltip/content.tsx";
import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(hinted(<Content>Saves without closing</Content>));

    expect(slotElement(container, "tooltip", "content").tagName).toBe("DIV");
  });

  it("sets role tooltip", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("tooltip").textContent).toContain("Saves without closing");
  });

  it("applies the root's variant class with the arrow tip", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, variant: "surface" }));

    expect(slotClasses(container, "tooltip", "content")).toContain(
      slotVariantClass("tooltip", "content", "variant", "surface"),
    );
    expect(slotClasses(container, "tooltip", "arrowTip")).toContain(
      slotVariantClass("tooltip", "arrowTip", "variant", "surface"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(hinted(<Content as="section">Saves</Content>));

    expect(slotElement(container, "tooltip", "content").tagName).toBe("SECTION");
  });
});

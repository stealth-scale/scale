import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { composed, framed } from "#hover-card/hover-card.fixtures.tsx";
import { Content, Positioner, Root } from "#hover-card/index.ts";

/**
 * Returns the panel's line of text, or null while the panel is out of the document.
 */
function card(): HTMLElement | null {
  return screen.queryByText("Wrote the first published program.");
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "hover-card", "content").tagName).toBe("DIV");
  });

  it("sets tabIndex to -1", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "hover-card", "content").tabIndex).toBe(-1);
  });

  it("sets no role", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "hover-card", "content").getAttribute("role")).toBeNull();
  });

  it("applies the root's variant class with the arrow tip", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, variant: "glass" }));

    expect(slotClasses(container, "hover-card", "content")).toContain(
      slotVariantClass("hover-card", "content", "variant", "glass"),
    );
    expect(slotClasses(container, "hover-card", "arrowTip")).toContain(
      slotVariantClass("hover-card", "arrowTip", "variant", "glass"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content as="section" />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "hover-card", "content").tagName).toBe("SECTION");
  });

  it("renders nothing before the card first opens", async () => {
    await drawn(composed());

    expect(card()).toBeNull();
  });

  it("renders nothing once the card closes", async () => {
    await drawn(composed({ defaultOpen: true }));
    await framed();
    fireEvent.keyDown(document, { key: "Escape" });
    await settled();
    await framed();

    expect(card()).toBeNull();
  });

  it("keeps the hidden panel once the card closes with unmountOnExit false", async () => {
    await drawn(composed({ defaultOpen: true, unmountOnExit: false }));
    await framed();
    fireEvent.keyDown(document, { key: "Escape" });
    await settled();
    await framed();

    expect(card()?.hidden).toBe(true);
  });
});

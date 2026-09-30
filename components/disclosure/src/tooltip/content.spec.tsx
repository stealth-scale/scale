import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Content } from "#tooltip/content.tsx";
import { Positioner } from "#tooltip/positioner.tsx";
import { Root } from "#tooltip/root.tsx";
import { composed } from "#tooltip/tooltip.fixtures.tsx";

/**
 * Waits for the next animation frame, in which the presence reads the closed content's animation.
 */
async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

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
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content as="section">Saves</Content>
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "tooltip", "content").tagName).toBe("SECTION");
  });

  it("renders nothing before the tooltip first opens", async () => {
    await drawn(composed());

    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  });

  it("renders nothing once Escape closes the tooltip", async () => {
    await drawn(composed({ defaultOpen: true }));
    await act(async () => {
      fireEvent.keyDown(document, { key: "Escape" });
      await Promise.resolve();
    });
    await frame();

    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  });
});

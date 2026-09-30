import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Content, Positioner, Root } from "#toggle-tip/index.ts";
import { composed, framed, note, region } from "#toggle-tip/toggle-tip.fixtures.tsx";

/**
 * Returns the trigger.
 */
function trigger(): HTMLElement {
  return screen.getByRole("button", { name: "About the settlement date" });
}

/**
 * Closes the note with Escape and waits for it to leave the document.
 */
async function escaped(): Promise<void> {
  fireEvent.keyDown(trigger(), { key: "Escape" });
  await settled();
  await framed();
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "toggle-tip", "content").tagName).toBe("DIV");
  });

  it("sets no role", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "toggle-tip", "content").getAttribute("role")).toBeNull();
  });

  it("sets no aria-labelledby", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "toggle-tip", "content").getAttribute("aria-labelledby")).toBe(
      null,
    );
  });

  it("announces its text through the polite live region when it opens", async () => {
    await drawn(composed());
    await pressed(trigger());
    await framed();

    expect(region()?.textContent).toBe("The day the payout clears.");
  });

  it("announces its text again when it opens a second time", async () => {
    await drawn(composed());
    await pressed(trigger());
    await framed();
    await escaped();
    region()?.replaceChildren("Earlier words");
    await pressed(trigger());
    await framed();

    expect(region()?.textContent).toBe("The day the payout clears.");
  });

  it("applies the root's variant class with the arrow tip", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, variant: "surface" }));

    expect(slotClasses(container, "toggle-tip", "content")).toContain(
      slotVariantClass("toggle-tip", "content", "variant", "surface"),
    );
    expect(slotClasses(container, "toggle-tip", "arrowTip")).toContain(
      slotVariantClass("toggle-tip", "arrowTip", "variant", "surface"),
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

    expect(slotElement(container, "toggle-tip", "content").tagName).toBe("SECTION");
  });

  it("renders nothing before the note first opens", async () => {
    const { container } = await drawn(composed());

    expect(note(container)).toBeNull();
  });

  it("renders nothing once the note closes", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    await framed();
    await escaped();

    expect(note(container)).toBeNull();
  });

  it("keeps the hidden note once it closes with unmountOnExit false", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, unmountOnExit: false }));

    await framed();
    await escaped();

    expect(note(container)?.hidden).toBe(true);
  });
});

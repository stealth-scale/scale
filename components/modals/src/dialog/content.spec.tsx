import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#dialog/dialog.fixtures.tsx";
import { Content, Positioner, Root } from "#dialog/index.ts";

/**
 * Waits for the next animation frame, in which the presence reads the closed panel's animation.
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

/**
 * Returns the panel, shown or hidden, or null while it is out of the document.
 */
function panel(): HTMLElement | null {
  return screen.queryByRole("dialog", { hidden: true });
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "dialog", "content").tagName).toBe("DIV");
  });

  it("sets role dialog", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("sets role alertdialog when the root's role is alertdialog", async () => {
    await drawn(composed({ defaultOpen: true, role: "alertdialog" }));

    expect(screen.getByRole("alertdialog")).toBeDefined();
  });

  it("sets aria-modal to true", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
  });

  it("sets aria-labelledby to the title's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Rename the report" }).id,
    );
  });

  it("sets aria-describedby to the description's id", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "dialog", "description").id,
    );
  });

  it("takes its name from the root's aria-label", async () => {
    await drawn(composed({ "aria-label": "Rename", defaultOpen: true }));

    expect(screen.getByRole("dialog", { name: "Rename" })).toBeDefined();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner>
          <Content as="section" />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "dialog", "content").tagName).toBe("SECTION");
  });

  it("renders nothing before the dialog first opens", async () => {
    await drawn(composed());

    expect(panel()).toBeNull();
  });

  it("renders nothing once the dialog closes", async () => {
    await drawn(composed({ defaultOpen: true }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await settled();
    await frame();

    expect(panel()).toBeNull();
  });

  it("keeps the hidden panel once the dialog closes with unmountOnExit false", async () => {
    await drawn(composed({ defaultOpen: true, unmountOnExit: false }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await settled();
    await frame();

    expect(panel()?.hidden).toBe(true);
  });
});

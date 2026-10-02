import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#dialog/dialog.fixtures.tsx";
import { Backdrop, Content, Positioner, Root } from "#dialog/index.ts";

/**
 * Waits for the next animation frame, in which the presence reads the closed backdrop's animation.
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
 * Closes the open dialog with Escape and waits for the backdrop's exit.
 */
async function escaped(): Promise<void> {
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
  await settled();
  await frame();
}

describe("Backdrop", () => {
  it("renders a div while the dialog is open", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "dialog", "backdrop").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "dialog", "backdrop").className).toContain(
      slotClass("dialog", "backdrop"),
    );
  });

  it("sets data-state to open while the dialog is open", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "dialog", "backdrop").dataset["state"]).toBe("open");
  });

  it("renders nothing before the dialog first opens", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".dialog__backdrop")).toBeNull();
  });

  it("renders nothing once the dialog closes", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    await escaped();

    expect(container.querySelector(".dialog__backdrop")).toBeNull();
  });

  it("keeps the hidden backdrop once the dialog closes with unmountOnExit false", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, unmountOnExit: false }));

    await escaped();

    expect(container.querySelector<HTMLElement>(".dialog__backdrop")?.hidden).toBe(true);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Backdrop as="span" />
        <Positioner>
          <Content />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "dialog", "backdrop").tagName).toBe("SPAN");
  });
});

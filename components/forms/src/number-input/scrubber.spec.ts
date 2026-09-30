import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { framed, scrubbed } from "#number-input/number-input.fixtures.tsx";

/**
 * Drags the scrubber sideways by one movement and releases it.
 *
 * @param scrubber - The scrubber to drag.
 * @param movementX - The horizontal movement in CSS pixels.
 */
async function dragged(scrubber: HTMLElement, movementX: number): Promise<void> {
  fireEvent.mouseDown(scrubber, { button: 0 });
  await settled();
  fireEvent.mouseMove(document, { movementX });
  await settled();
  fireEvent.mouseUp(document);
  await settled();
  await framed();
}

describe("Scrubber", () => {
  it("renders an input group mark in the presentation role", async () => {
    const { container } = await drawn(scrubbed());

    expect(slotElement(container, "input-group", "mark").getAttribute("role")).toBe("presentation");
  });

  it("renders its children", async () => {
    const { container } = await drawn(scrubbed());

    expect(slotElement(container, "input-group", "mark").textContent).toBe("↔");
  });

  it("sets the ew-resize cursor", async () => {
    const { container } = await drawn(scrubbed());

    expect(slotElement(container, "input-group", "mark").style.cursor).toBe("ew-resize");
  });

  it("sets no cursor on a disabled input", async () => {
    const { container } = await drawn(scrubbed({ disabled: true }));

    expect(slotElement(container, "input-group", "mark").style.cursor).toBe("");
  });

  it("steps the value up on a drag to the right", async () => {
    const { container } = await drawn(scrubbed());

    await dragged(slotElement(container, "input-group", "mark"), 4);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("2");
  });

  it("steps the value down on a drag to the left", async () => {
    const { container } = await drawn(scrubbed());

    await dragged(slotElement(container, "input-group", "mark"), -4);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("1");
  });

  it("removes the virtual cursor on release", async () => {
    const { container } = await drawn(scrubbed());

    await dragged(slotElement(container, "input-group", "mark"), 4);

    expect(document.querySelector(".scrubber--cursor")).toBeNull();
  });

  it("keeps the value on a drag in a disabled input", async () => {
    const { container } = await drawn(scrubbed({ disabled: true }));

    act(() => {
      fireEvent.mouseDown(slotElement(container, "input-group", "mark"), { button: 0 });
    });
    await settled();

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("1.5");
  });
});
